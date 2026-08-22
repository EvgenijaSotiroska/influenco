using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class BrandService : IBrandService
{
    private readonly AppDbContext _context;

    public BrandService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetBrandProfileResponse> GetProfileAsync(Guid userId)
    {
        var brand = await _context.Brands
            .AsNoTracking()
            .Include(b => b.AppUser)
            .FirstOrDefaultAsync(b => b.AppUserId == userId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        return await MapToResponseAsync(brand);
    }

    public async Task<GetBrandProfileResponse> GetPublicProfileByIdAsync(Guid brandId)
    {
        var brand = await _context.Brands
            .AsNoTracking()
            .Include(b => b.AppUser)
            .FirstOrDefaultAsync(b => b.Id == brandId);

        if (brand == null)
            throw new Exception("Brand not found.");

        return await MapToResponseAsync(brand);
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateBrandProfileRequest request)
    {
        var brand = await _context.Brands
            .FirstOrDefaultAsync(b => b.AppUserId == userId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        brand.CompanyName = request.CompanyName;
        brand.Description = request.Description;
        brand.LogoUrl = request.LogoUrl;
        brand.Website = request.Website;
        brand.Industry = request.Industry;

        await _context.SaveChangesAsync();
    }

    public async Task<List<CampaignSummaryResponse>> GetPublicActiveCampaignsAsync(Guid brandId)
    {
        var campaigns = await _context.Campaigns
            .AsNoTracking()
            .Where(c => c.BrandId == brandId && c.Status == CampaignStatus.OpenForApplications)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return campaigns
            .Where(c => c.ApplicationDeadline == null || c.ApplicationDeadline >= DateTime.UtcNow)
            .Select(c => new CampaignSummaryResponse
            {
                Id = c.Id,
                Title = c.Title,
                Budget = c.Budget,
                ApplicationDeadline = c.ApplicationDeadline,
                ApplicantsCount = c.ApplicantsCount,
                Status = c.Status.ToString()
            })
            .ToList();
    }

    private async Task<GetBrandProfileResponse> MapToResponseAsync(Brand brand)
    {
        var activeCampaignsCount = await _context.Campaigns
            .CountAsync(c => c.BrandId == brand.Id
                && c.Status == CampaignStatus.OpenForApplications
                && (c.ApplicationDeadline == null || c.ApplicationDeadline >= DateTime.UtcNow));

        var dealsCount = await _context.Deals.CountAsync(d => d.BrandId == brand.Id);

        return new GetBrandProfileResponse
        {
            Id = brand.Id,
            CompanyName = brand.CompanyName,
            Description = brand.Description,
            LogoUrl = brand.LogoUrl,
            Website = brand.Website,
            Industry = brand.Industry,
            Email = brand.AppUser.Email ?? "",
            ActiveCampaignsCount = activeCampaignsCount,
            DealsCount = dealsCount
        };
    }
}