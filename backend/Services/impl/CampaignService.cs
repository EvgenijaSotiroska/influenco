using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class CampaignService : ICampaignService
{
    private readonly AppDbContext _context;

    public CampaignService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CampaignResponse> CreateAsync(Guid appUserId, CreateCampaignRequest request)
    {
        var brand = await GetBrandOrThrow(appUserId);

        var campaign = new Campaign
        {
            BrandId = brand.Id,
            Title = request.Title,
            Description = request.Description,
            Deliverables = request.Deliverables,
            Budget = request.Budget,
            ApplicationDeadline = request.ApplicationDeadline,
            Status = ParseStatus(request.Status),
            Niches = request.Niches,
            Platforms = request.Platforms,
            MinimumFollowers = request.MinimumFollowers
        };

        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();

        return MapToResponse(campaign);
    }

    public async Task<List<CampaignSummaryResponse>> GetAllForBrandAsync(Guid appUserId)
    {
        var brand = await GetBrandOrThrow(appUserId);

        return await _context.Campaigns
            .AsNoTracking()
            .Where(c => c.BrandId == brand.Id)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CampaignSummaryResponse
            {
                Id = c.Id,
                Title = c.Title,
                ApplicantsCount = c.ApplicantsCount,
                ApplicationDeadline = c.ApplicationDeadline,
                Status = c.Status.ToString()
            })
            .ToListAsync();
    }

    public async Task<CampaignResponse> GetByIdAsync(Guid appUserId, Guid campaignId)
    {
        var brand = await GetBrandOrThrow(appUserId);

        var campaign = await _context.Campaigns
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        return MapToResponse(campaign);
    }

    public async Task UpdateAsync(Guid appUserId, Guid campaignId, CreateCampaignRequest request)
    {
        var brand = await GetBrandOrThrow(appUserId);

        var campaign = await _context.Campaigns
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        campaign.Title = request.Title;
        campaign.Description = request.Description;
        campaign.Deliverables = request.Deliverables;
        campaign.Budget = request.Budget;
        campaign.ApplicationDeadline = request.ApplicationDeadline;
        campaign.Status = ParseStatus(request.Status);
        campaign.Niches = request.Niches;
        campaign.Platforms = request.Platforms;
        campaign.MinimumFollowers = request.MinimumFollowers;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid appUserId, Guid campaignId)
    {
        var brand = await GetBrandOrThrow(appUserId);

        var campaign = await _context.Campaigns
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.BrandId == brand.Id);

        if (campaign == null)
            throw new Exception("Campaign not found.");

        _context.Campaigns.Remove(campaign);
        await _context.SaveChangesAsync();
    }

    private async Task<Brand> GetBrandOrThrow(Guid appUserId)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == appUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        return brand;
    }

    private static CampaignStatus ParseStatus(string status)
    {
        return Enum.TryParse<CampaignStatus>(status, true, out var parsed)
            ? parsed
            : CampaignStatus.Draft;
    }

    private static CampaignResponse MapToResponse(Campaign campaign)
    {
        return new CampaignResponse
        {
            Id = campaign.Id,
            Title = campaign.Title,
            Description = campaign.Description,
            Deliverables = campaign.Deliverables,
            Budget = campaign.Budget,
            ApplicationDeadline = campaign.ApplicationDeadline,
            Status = campaign.Status.ToString(),
            Niches = campaign.Niches,
            Platforms = campaign.Platforms,
            MinimumFollowers = campaign.MinimumFollowers,
            ApplicantsCount = campaign.ApplicantsCount,
            CreatedAt = campaign.CreatedAt
        };
    }
}