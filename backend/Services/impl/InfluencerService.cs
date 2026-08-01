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
            .FirstOrDefaultAsync(i => i.AppUserId == userId);

        if (influencer == null)
            throw new Exception("Influencer profile not found.");

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

    public async Task<DiscoverInfluencersResponseDTO> GetDiscoverInfluencersAsync(int count)
    {
        var query = _context.Influencers.AsNoTracking();
        var totalCount = await query.CountAsync();

        var influencers = await query
            .OrderByDescending(i => i.IsVerified)
            .Take(count)
            .Select(i => new DiscoverInfluencerDTO
            {
                Id = i.Id,
                DisplayName = i.DisplayName,
                Handle = i.Handle,
                ProfilePictureUrl = i.ProfilePictureUrl,
                Location = i.Location,
                Niche = i.Categories.FirstOrDefault(),
                IsVerified = i.IsVerified
            })
            .ToListAsync();

        return new DiscoverInfluencersResponseDTO
        {
            Influencers = influencers,
            TotalCount = totalCount
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

    private static double? CalculateEngagementRate(int? avgViews, int? followers)
    {
        if (avgViews is null or 0 || followers is null or 0)
            return null;

        return Math.Round((double)avgViews / followers.Value * 100, 2);
    }
}