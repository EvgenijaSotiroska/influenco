using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class InfluencerService : IInfluencerService
{
    private readonly AppDbContext _context;

    public InfluencerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetInfluencerProfileResponse> GetProfileAsync(Guid userId)
    {
        var influencer = await _context.Influencers
            .AsNoTracking()
            .Include(i => i.AppUser)
            .FirstOrDefaultAsync(i => i.AppUserId == userId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        return MapToResponse(influencer);
    }

    public async Task<GetInfluencerProfileResponse> GetPublicProfileByIdAsync(Guid influencerId)
    {
        var influencer = await _context.Influencers
            .AsNoTracking()
            .Include(i => i.AppUser)
            .FirstOrDefaultAsync(i => i.Id == influencerId);

        if (influencer == null)
            throw new Exception("Influencer not found.");

        return MapToResponse(influencer);
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateInfluencerProfileRequest request)
    {
        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.AppUserId == userId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

        influencer.DisplayName = request.DisplayName;
        influencer.Handle = request.Handle;
        influencer.Bio = request.Bio;
        influencer.Location = request.Location;
        influencer.ProfilePictureUrl = request.ProfilePictureUrl;
        influencer.CoverImageUrl = request.CoverImageUrl;
        influencer.Categories = request.Categories;

        influencer.InstagramUrl = request.InstagramUrl;
        influencer.InstagramFollowers = request.InstagramFollowers;
        influencer.InstagramAvgViews = request.InstagramAvgViews;
        influencer.InstagramStoryViews = request.InstagramStoryViews;

        influencer.TikTokUrl = request.TikTokUrl;
        influencer.TikTokFollowers = request.TikTokFollowers;
        influencer.TikTokAvgViews = request.TikTokAvgViews;

        influencer.AudienceAgeRange = request.AudienceAgeRange;
        influencer.AudienceGenderSplit = request.AudienceGenderSplit;
        influencer.AudienceTopLocations = request.AudienceTopLocations;

        influencer.StatsUpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<DiscoverInfluencersResponseDTO> GetDiscoverInfluencersAsync(DiscoverQuery query)
    {
        var influencersQuery = _context.Influencers.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Location))
        {
            influencersQuery = influencersQuery.Where(i =>
                i.Location != null && i.Location.Contains(query.Location));
        }

        // Categories is a converted collection column — EF can't translate .Contains() on it,
        // so it's filtered client-side below, alongside the follower-range filter.
        var candidates = await influencersQuery.ToListAsync();

        var filtered = candidates
            .Select(i => new
            {
                Influencer = i,
                TotalFollowers = (i.InstagramFollowers ?? 0) + (i.TikTokFollowers ?? 0)
            })
            .Where(x => string.IsNullOrWhiteSpace(query.Category)
                || x.Influencer.Categories.Contains(query.Category))
            .Where(x => query.MinFollowers == null || x.TotalFollowers >= query.MinFollowers)
            .Where(x => query.MaxFollowers == null || x.TotalFollowers <= query.MaxFollowers)
            .OrderByDescending(x => x.Influencer.IsVerified)
            .ThenByDescending(x => x.TotalFollowers)
            .ToList();

        var totalCount = filtered.Count;

        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 6 : query.PageSize;

        var pageItems = filtered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DiscoverInfluencerDTO
            {
                Id = x.Influencer.Id,
                DisplayName = x.Influencer.DisplayName,
                Handle = x.Influencer.Handle,
                ProfilePictureUrl = x.Influencer.ProfilePictureUrl,
                Location = x.Influencer.Location,
                Niche = x.Influencer.Categories.FirstOrDefault(),
                IsVerified = x.Influencer.IsVerified,
                TotalFollowers = x.TotalFollowers,
                OverallEngagementRate = CalculateOverallEngagementRate(x.Influencer)
            })
            .ToList();

        return new DiscoverInfluencersResponseDTO
        {
            Influencers = pageItems,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            HasMore = page * pageSize < totalCount
        };
    }

    private static GetInfluencerProfileResponse MapToResponse(Influencer influencer)
    {
        var igEngagement = CalculateEngagementRate(influencer.InstagramAvgViews, influencer.InstagramFollowers);
        var ttEngagement = CalculateEngagementRate(influencer.TikTokAvgViews, influencer.TikTokFollowers);

        var rates = new List<double>();
        if (igEngagement.HasValue) rates.Add(igEngagement.Value);
        if (ttEngagement.HasValue) rates.Add(ttEngagement.Value);

        return new GetInfluencerProfileResponse
        {
            Id = influencer.Id,
            DisplayName = influencer.DisplayName,
            Email = influencer.AppUser.Email ?? "",
            Handle = influencer.Handle,
            Bio = influencer.Bio,
            ProfilePictureUrl = influencer.ProfilePictureUrl,
            CoverImageUrl = influencer.CoverImageUrl,
            Location = influencer.Location,
            Categories = influencer.Categories,
            IsVerified = influencer.IsVerified,

            InstagramUrl = influencer.InstagramUrl,
            InstagramFollowers = influencer.InstagramFollowers,
            InstagramAvgViews = influencer.InstagramAvgViews,
            InstagramStoryViews = influencer.InstagramStoryViews,

            TikTokUrl = influencer.TikTokUrl,
            TikTokFollowers = influencer.TikTokFollowers,
            TikTokAvgViews = influencer.TikTokAvgViews,

            AudienceAgeRange = influencer.AudienceAgeRange,
            AudienceGenderSplit = influencer.AudienceGenderSplit,
            AudienceTopLocations = influencer.AudienceTopLocations,

            StatsUpdatedAt = influencer.StatsUpdatedAt,

            TotalReach = (influencer.InstagramFollowers ?? 0) + (influencer.TikTokFollowers ?? 0),
            InstagramEngagementRate = igEngagement,
            TikTokEngagementRate = ttEngagement,
            OverallEngagementRate = rates.Count > 0 ? Math.Round(rates.Average(), 2) : null
        };
    }

    private static double? CalculateOverallEngagementRate(Influencer influencer)
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