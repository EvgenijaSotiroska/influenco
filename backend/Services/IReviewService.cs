using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IReviewService
{
    Task<ReviewResponse> CreateOrUpdateAsync(Guid brandAppUserId, Guid influencerId, CreateReviewRequest request);
    Task<List<ReviewResponse>> GetForInfluencerAsync(Guid influencerId);
}
