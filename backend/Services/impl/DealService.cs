using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class DealService : IDealService
{
    private readonly AppDbContext _context;

    public DealService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DealResponse> CreateAsync(Guid brandAppUserId, CreateDealRequest request)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        var influencer = await _context.Influencers
            .FirstOrDefaultAsync(i => i.Id == request.InfluencerId);

        if (influencer == null)
            throw new Exception("Influencer not found.");

        var deal = new Deal
        {
            BrandId = brand.Id,
            InfluencerId = influencer.Id,
            CampaignId = request.CampaignId,
            CampaignApplicationId = request.CampaignApplicationId,
            CollaborationRequestId = request.CollaborationRequestId,
            Title = request.Title,
            Deliverables = request.Deliverables,
            Price = request.Price
        };

        _context.Deals.Add(deal);
        await _context.SaveChangesAsync();

        return new DealResponse
        {
            Id = deal.Id,
            BrandName = brand.CompanyName,
            BrandLogoUrl = brand.LogoUrl,
            InfluencerName = influencer.DisplayName,
            InfluencerProfilePictureUrl = influencer.ProfilePictureUrl,
            Title = deal.Title,
            Deliverables = deal.Deliverables,
            Price = deal.Price,
            IsVerified = deal.IsVerified,
            CreatedAt = deal.CreatedAt
        };
    }

    public async Task<List<DealResponse>> GetForInfluencerAsync(Guid influencerId)
    {
        return await _context.Deals
            .AsNoTracking()
            .Include(d => d.Brand)
            .Include(d => d.Influencer)
            .Where(d => d.InfluencerId == influencerId)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DealResponse
            {
                Id = d.Id,
                BrandName = d.Brand.CompanyName,
                BrandLogoUrl = d.Brand.LogoUrl,
                InfluencerName = d.Influencer.DisplayName,
                InfluencerProfilePictureUrl = d.Influencer.ProfilePictureUrl,
                Title = d.Title,
                Deliverables = d.Deliverables,
                Price = d.Price,
                IsVerified = d.IsVerified,
                CreatedAt = d.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<DealResponse>> GetForBrandAsync(Guid brandAppUserId)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        return await _context.Deals
            .AsNoTracking()
            .Include(d => d.Brand)
            .Include(d => d.Influencer)
            .Where(d => d.BrandId == brand.Id)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DealResponse
            {
                Id = d.Id,
                BrandName = d.Brand.CompanyName,
                BrandLogoUrl = d.Brand.LogoUrl,
                InfluencerName = d.Influencer.DisplayName,
                InfluencerProfilePictureUrl = d.Influencer.ProfilePictureUrl,
                Title = d.Title,
                Deliverables = d.Deliverables,
                Price = d.Price,
                IsVerified = d.IsVerified,
                CreatedAt = d.CreatedAt
            })
            .ToListAsync();
    }

    public async Task VerifyAsync(Guid brandAppUserId, Guid dealId)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        var deal = await _context.Deals.FirstOrDefaultAsync(d => d.Id == dealId && d.BrandId == brand.Id);

        if (deal == null)
            throw new Exception("Deal not found.");

        deal.IsVerified = true;
        await _context.SaveChangesAsync();
    }
}