using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class PostService : IPostService
{
    private const int MaxImages = 3;

    private readonly AppDbContext _context;

    public PostService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PostResponse> CreateAsync(Guid appUserId, CreatePostRequest request)
    {
        var content = request.Content?.Trim();

        var imageUrls = (request.ImageUrls ?? new List<string>())
            .Select(u => u.Trim())
            .Where(u => !string.IsNullOrWhiteSpace(u))
            .Take(MaxImages)
            .ToList();

        if (string.IsNullOrWhiteSpace(content) && imageUrls.Count == 0)
            throw new Exception("A post needs text or at least one image.");

        var post = new Post
        {
            AppUserId = appUserId,
            Content = string.IsNullOrWhiteSpace(content) ? null : content,
            ImageUrls = imageUrls
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var (authorName, authorAvatarUrl) = await GetAuthorInfoAsync(appUserId);

        return new PostResponse
        {
            Id = post.Id,
            AuthorName = authorName,
            AuthorAvatarUrl = authorAvatarUrl,
            Content = post.Content,
            ImageUrls = post.ImageUrls,
            CreatedAt = post.CreatedAt
        };
    }

    public async Task<List<PostResponse>> GetForInfluencerAsync(Guid influencerId)
    {
        var influencer = await _context.Influencers
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == influencerId);

        if (influencer == null)
            throw new Exception("Influencer not found.");

        return await GetForUserAsync(influencer.AppUserId, influencer.DisplayName, influencer.ProfilePictureUrl);
    }

    public async Task<List<PostResponse>> GetForBrandAsync(Guid brandId)
    {
        var brand = await _context.Brands
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == brandId);

        if (brand == null)
            throw new Exception("Brand not found.");

        return await GetForUserAsync(brand.AppUserId, brand.CompanyName, brand.LogoUrl);
    }

    private async Task<List<PostResponse>> GetForUserAsync(Guid appUserId, string authorName, string? authorAvatarUrl)
    {
        return await _context.Posts
            .AsNoTracking()
            .Where(p => p.AppUserId == appUserId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostResponse
            {
                Id = p.Id,
                AuthorName = authorName,
                AuthorAvatarUrl = authorAvatarUrl,
                Content = p.Content,
                ImageUrls = p.ImageUrls,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    private async Task<(string authorName, string? authorAvatarUrl)> GetAuthorInfoAsync(Guid appUserId)
    {
        var influencer = await _context.Influencers
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.AppUserId == appUserId);

        if (influencer != null)
            return (influencer.DisplayName, influencer.ProfilePictureUrl);

        var brand = await _context.Brands
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.AppUserId == appUserId);

        if (brand != null)
            return (brand.CompanyName, brand.LogoUrl);

        throw new Exception("No profile found for this user.");
    }
}