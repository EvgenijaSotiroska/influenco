using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IDealService
{
    Task<DealResponse> CreateAsync(Guid brandAppUserId, CreateDealRequest request);
    Task<List<DealResponse>> GetForInfluencerAsync(Guid influencerId);
    Task<List<DealResponse>> GetForBrandAsync(Guid brandAppUserId);
    Task VerifyAsync(Guid brandAppUserId, Guid dealId);
}