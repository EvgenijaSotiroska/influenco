using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class CollaborationRequestService : ICollaborationRequestService
{
    private readonly AppDbContext _context;

    public CollaborationRequestService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BrandCampaignOptionDto>> GetActiveCampaignsForBrandAsync(Guid brandAppUserId)
    {
        var brand = await GetBrandOrThrow(brandAppUserId);

        return await _context.Campaigns
            .AsNoTracking()
            .Where(c => c.BrandId == brand.Id && c.Status == CampaignStatus.OpenForApplications)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new BrandCampaignOptionDto
            {
                Id = c.Id,
                Title = c.Title
            })
            .ToListAsync();
    }

    public async Task CreateAsync(Guid brandAppUserId, CreateCollaborationRequestDto request)
    {
        var brand = await GetBrandOrThrow(brandAppUserId);

        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.Id == request.InfluencerId);

        if (influencer == null)
            throw new Exception("Influencer not found.");

        if (request.CampaignId != null)
        {
            var campaignExists = await _context.Campaigns
                .AnyAsync(c => c.Id == request.CampaignId && c.BrandId == brand.Id);

            if (!campaignExists)
                throw new Exception("Campaign not found.");
        }

        var collaborationRequest = new CollaborationRequest
        {
            BrandId = brand.Id,
            InfluencerId = influencer.Id,
            CampaignId = request.CampaignId,
            Deliverables = request.Deliverables,
            OfferedBudget = request.OfferedBudget,
            Timeline = request.Timeline,
            Message = request.Message,
            Status = CollaborationRequestStatus.Pending
        };

        _context.CollaborationRequests.Add(collaborationRequest);
        await _context.SaveChangesAsync();
    }

    private async Task<Brand> GetBrandOrThrow(Guid brandAppUserId)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        return brand;
    }
    public async Task<List<IncomingCollaborationRequestResponse>> GetMyRequestsAsync(Guid influencerAppUserId)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        return await _context.CollaborationRequests
            .AsNoTracking()
            .Include(r => r.Brand)
            .Include(r => r.Campaign)
            .Where(r => r.InfluencerId == influencer.Id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new IncomingCollaborationRequestResponse
            {
                RequestId = r.Id,
                BrandName = r.Brand.CompanyName,
                BrandLogoUrl = r.Brand.LogoUrl,
                CampaignTitle = r.Campaign != null ? r.Campaign.Title : null,
                Deliverables = r.Deliverables,
                OfferedBudget = r.OfferedBudget,
                Timeline = r.Timeline,
                Message = r.Message,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task RespondAsync(Guid influencerAppUserId, Guid requestId, RespondToCollaborationRequestDto request)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        var collaborationRequest = await _context.CollaborationRequests
            .FirstOrDefaultAsync(r => r.Id == requestId && r.InfluencerId == influencer.Id);

        if (collaborationRequest == null)
            throw new Exception("Request not found.");

        if (!Enum.TryParse<CollaborationRequestStatus>(request.Status, true, out var status)
            || status == CollaborationRequestStatus.Pending)
            throw new Exception("Invalid status.");

        collaborationRequest.Status = status;
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetPendingCountAsync(Guid influencerAppUserId)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == influencerAppUserId);

        if (influencer == null)
            return 0;

        return await _context.CollaborationRequests
            .CountAsync(r => r.InfluencerId == influencer.Id
                && r.Status == CollaborationRequestStatus.Pending);
    }

    public async Task<List<RequestedInfluencerResponse>> GetRequestedInfluencersForCampaignAsync(
     Guid brandAppUserId, Guid campaignId)
    {
        var brand = await GetBrandOrThrow(brandAppUserId);

        var campaignExists = await _context.Campaigns
            .AnyAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (!campaignExists)
            throw new Exception("Campaign not found.");

        var requests = await _context.CollaborationRequests
            .AsNoTracking()
            .Include(r => r.Influencer)
            .Where(r => r.CampaignId == campaignId && r.BrandId == brand.Id)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var dealtRequestIds = (await _context.Deals
            .Where(d => d.CollaborationRequestId != null)
            .Select(d => d.CollaborationRequestId!.Value)
            .ToListAsync())
            .ToHashSet();

        return requests.Select(r => new RequestedInfluencerResponse
        {
            RequestId = r.Id,
            InfluencerId = r.Influencer.Id,
            DisplayName = r.Influencer.DisplayName,
            Handle = r.Influencer.Handle,
            ProfilePictureUrl = r.Influencer.ProfilePictureUrl,
            Status = r.Status.ToString(),
            OfferedBudget = r.OfferedBudget,
            Deliverables = r.Deliverables,
            CreatedAt = r.CreatedAt,
            HasDeal = dealtRequestIds.Contains(r.Id)
        }).ToList();
    }
}