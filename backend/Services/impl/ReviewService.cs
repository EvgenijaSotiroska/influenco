using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ReviewResponse> CreateOrUpdateAsync(Guid brandAppUserId, Guid influencerId, CreateReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5)
            throw new Exception("Rating must be between 1 and 5.");

        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.AppUserId == brandAppUserId);

        if (brand == null)
            throw new Exception("Brand profile not found.");

        var influencer = await _context.Influencers.FirstOrDefaultAsync(i => i.Id == influencerId);

        if (influencer == null)
            throw new Exception("Influencer not found.");

        // A brand can only have one review per influencer — resubmitting updates it.
        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.BrandId == brand.Id && r.InfluencerId == influencerId);

        if (review == null)
        {
            review = new Review
            {
                BrandId = brand.Id,
                InfluencerId = influencerId,
                Rating = request.Rating,
                Comment = request.Comment
            };
            _context.Reviews.Add(review);
        }
        else
        {
            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new ReviewResponse
        {
            Id = review.Id,
            BrandId = brand.Id,
            BrandName = brand.CompanyName,
            BrandLogoUrl = brand.LogoUrl,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<List<ReviewResponse>> GetForInfluencerAsync(Guid influencerId)
    {
        return await _context.Reviews
            .AsNoTracking()
            .Include(r => r.Brand)
            .Where(r => r.InfluencerId == influencerId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewResponse
            {
                Id = r.Id,
                BrandId = r.BrandId,
                BrandName = r.Brand.CompanyName,
                BrandLogoUrl = r.Brand.LogoUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }
}
