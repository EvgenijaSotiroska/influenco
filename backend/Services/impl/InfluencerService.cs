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
            IsVerified = influencer.IsVerified
        };
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
}