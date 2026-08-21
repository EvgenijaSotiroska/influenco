using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface ICollaborationRequestService
{
    Task<List<BrandCampaignOptionDto>> GetActiveCampaignsForBrandAsync(Guid brandAppUserId);
    Task CreateAsync(Guid brandAppUserId, CreateCollaborationRequestDto request);
    Task<List<IncomingCollaborationRequestResponse>> GetMyRequestsAsync(Guid influencerAppUserId);
    Task RespondAsync(Guid influencerAppUserId, Guid requestId, RespondToCollaborationRequestDto request);
    Task<int> GetPendingCountAsync(Guid influencerAppUserId);
    Task<List<RequestedInfluencerResponse>> GetRequestedInfluencersForCampaignAsync(Guid brandAppUserId, Guid campaignId);
}