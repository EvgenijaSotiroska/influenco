using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class CampaignApplicationService : ICampaignApplicationService
{
    private readonly AppDbContext _context;

    public CampaignApplicationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BrowseCampaignsResponse> BrowseAsync(Guid? influencerAppUserId, BrowseCampaignsQuery query)
    {
        var campaignsQuery = _context.Campaigns
            .AsNoTracking()
            .Include(c => c.Brand)
            .Where(c => c.Status == CampaignStatus.OpenForApplications)
            .AsQueryable();

        if (query.MinBudget != null)
            campaignsQuery = campaignsQuery.Where(c => c.Budget == null || c.Budget >= query.MinBudget);

        if (query.MaxBudget != null)
            campaignsQuery = campaignsQuery.Where(c => c.Budget == null || c.Budget <= query.MaxBudget);

        var campaigns = await campaignsQuery
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        // Niches/Platforms are converted collection columns — filter client-side, same as Discover.
        var filtered = campaigns
            .Where(c => string.IsNullOrWhiteSpace(query.Niche) || c.Niches.Contains(query.Niche))
            .Where(c => string.IsNullOrWhiteSpace(query.Platform) || c.Platforms.Contains(query.Platform))
            .ToList();

        Guid? influencerId = null;
        HashSet<Guid> appliedCampaignIds = new();

        if (influencerAppUserId != null)
        {
            var influencer = await _context.Influencers
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

            if (influencer != null)
            {
                influencerId = influencer.Id;
                appliedCampaignIds = (await _context.CampaignApplications
                    .AsNoTracking()
                    .Where(a => a.InfluencerId == influencer.Id)
                    .Select(a => a.CampaignId)
                    .ToListAsync())
                    .ToHashSet();
            }
        }

        var result = filtered.Select(c => new BrowseCampaignDto
        {
            Id = c.Id,
            BrandName = c.Brand.CompanyName,
            BrandLogoUrl = c.Brand.LogoUrl,
            Title = c.Title,
            Description = c.Description,
            Budget = c.Budget,
            MinimumFollowers = c.MinimumFollowers,
            ApplicationDeadline = c.ApplicationDeadline,
            Status = c.Status.ToString(),
            Niches = c.Niches,
            Platforms = c.Platforms,
            ApplicantsCount = c.ApplicantsCount,
            HasApplied = appliedCampaignIds.Contains(c.Id)
        }).ToList();

        return new BrowseCampaignsResponse { Campaigns = result };
    }

    public async Task ApplyAsync(Guid influencerAppUserId, Guid campaignId, ApplyToCampaignRequest request)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        var campaign = await _context.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        if (campaign.Status != CampaignStatus.OpenForApplications)
            throw new Exception("This campaign is not accepting applications.");

        var alreadyApplied = await _context.CampaignApplications
            .AnyAsync(a => a.CampaignId == campaignId && a.InfluencerId == influencer.Id);

        if (alreadyApplied)
            throw new Exception("You have already applied to this campaign.");

        var application = new CampaignApplication
        {
            CampaignId = campaignId,
            InfluencerId = influencer.Id,
            PitchMessage = request.PitchMessage,
            ProposedRate = request.ProposedRate,
            Status = ApplicationStatus.Pending
        };

        _context.CampaignApplications.Add(application);
        campaign.ApplicantsCount += 1;

        await _context.SaveChangesAsync();
    }

    public async Task<CampaignApplicantsResponse> GetApplicantsAsync(Guid brandAppUserId, Guid campaignId)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        var campaign = await _context.Campaigns
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        var applications = await _context.CampaignApplications
            .AsNoTracking()
            .Include(a => a.Influencer)
            .ThenInclude(i => i.AppUser)
            .Where(a => a.CampaignId == campaignId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var applicants = applications.Select(a => new ApplicantResponse
        {
            ApplicationId = a.Id,
            InfluencerId = a.Influencer.Id,
            DisplayName = a.Influencer.DisplayName,
            Handle = a.Influencer.Handle,
            ProfilePictureUrl = a.Influencer.ProfilePictureUrl,
            Email = a.Influencer.AppUser.Email ?? "",
            TotalFollowers = (a.Influencer.InstagramFollowers ?? 0) + (a.Influencer.TikTokFollowers ?? 0),
            OverallEngagementRate = CalculateOverallEngagementRate(a.Influencer),
            PitchMessage = a.PitchMessage,
            ProposedRate = a.ProposedRate,
            Status = a.Status.ToString(),
            BrandResponseMessage = a.BrandResponseMessage
        }).ToList();

        var dealtApplicationIds = (await _context.Deals
            .Where(d => d.CampaignApplicationId != null && applications.Select(a => a.Id).Contains(d.CampaignApplicationId!.Value))
            .Select(d => d.CampaignApplicationId!.Value)
            .ToListAsync())
            .ToHashSet();

        foreach (var applicant in applicants)
        {
            applicant.HasDeal = dealtApplicationIds.Contains(applicant.ApplicationId);
        }

        return new CampaignApplicantsResponse
        {
            CampaignId = campaign.Id,
            CampaignTitle = campaign.Title,
            CampaignDeliverables = campaign.Deliverables,
            Applicants = applicants
        };
    }

    public async Task RespondToApplicationAsync(
        Guid brandAppUserId, Guid campaignId, Guid applicationId, RespondToApplicationRequest request)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        var campaign = await _context.Campaigns
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        var application = await _context.CampaignApplications
            .FirstOrDefaultAsync(a => a.Id == applicationId && a.CampaignId == campaignId);

        if (application == null)
            throw new Exception("Application not found.");

        if (!Enum.TryParse<ApplicationStatus>(request.Status, true, out var status)
            || status == ApplicationStatus.Pending)
            throw new Exception("Invalid status.");

        application.Status = status;
        application.BrandResponseMessage = request.ResponseMessage;

        await _context.SaveChangesAsync();
    }

    public async Task<List<MyApplicationResponse>> GetMyApplicationsAsync(Guid influencerAppUserId)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        return await _context.CampaignApplications
            .AsNoTracking()
            .Include(a => a.Campaign)
            .ThenInclude(c => c.Brand)
            .Where(a => a.InfluencerId == influencer.Id)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new MyApplicationResponse
            {
                ApplicationId = a.Id,
                CampaignId = a.Campaign.Id,
                CampaignTitle = a.Campaign.Title,
                BrandName = a.Campaign.Brand.CompanyName,
                BrandLogoUrl = a.Campaign.Brand.LogoUrl,
                PitchMessage = a.PitchMessage,
                ProposedRate = a.ProposedRate,
                Status = a.Status.ToString(),
                BrandResponseMessage = a.BrandResponseMessage,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    private static double? CalculateOverallEngagementRate(Models.Influencer influencer)
    {
        var ig = CalculateEngagementRate(influencer.InstagramAvgViews, influencer.InstagramFollowers);
        var tt = CalculateEngagementRate(influencer.TikTokAvgViews, influencer.TikTokFollowers);

        var rates = new List<double>();
        if (ig.HasValue) rates.Add(ig.Value);
        if (tt.HasValue) rates.Add(tt.Value);

        return rates.Count > 0 ? Math.Round(rates.Average(), 2) : null;
    }

    private static double? CalculateEngagementRate(int? avgViews, int? followers)
    {
        if (avgViews is null or 0 || followers is null or 0)
            return null;

        return Math.Round((double)avgViews / followers.Value * 100, 2);
    }
}