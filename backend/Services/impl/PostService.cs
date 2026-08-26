using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Services.impl;

public class PostService : IPostService
{
    private readonly AppDbContext _context;

    public PostService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PostResponse> CreateAsync(Guid appUserId, CreatePostRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new Exception("Post content can't be empty.");

        var post = new Post
        {
            AppUserId = appUserId,
            Content = request.Content.Trim()
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
