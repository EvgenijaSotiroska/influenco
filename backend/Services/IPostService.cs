using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IPostService
{
    Task<PostResponse> CreateAsync(Guid appUserId, CreatePostRequest request);
    Task<List<PostResponse>> GetForInfluencerAsync(Guid influencerId);
    Task<List<PostResponse>> GetForBrandAsync(Guid brandId);
}
