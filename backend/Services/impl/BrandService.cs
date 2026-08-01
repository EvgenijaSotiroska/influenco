using influenco.backend.Data;
using influenco.backend.DTOs;
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
            .FirstOrDefaultAsync(b => b.AppUserId == userId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        return new GetBrandProfileResponse
        {
            Id = brand.Id,
            CompanyName = brand.CompanyName,
            Description = brand.Description,
            LogoUrl = brand.LogoUrl,
            Website = brand.Website,
            Industry = brand.Industry
        };
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
}