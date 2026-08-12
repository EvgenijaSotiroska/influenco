using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface ICampaignApplicationService
{
    Task<BrowseCampaignsResponse> BrowseAsync(Guid? influencerAppUserId, BrowseCampaignsQuery query);
    Task ApplyAsync(Guid influencerAppUserId, Guid campaignId, ApplyToCampaignRequest request);
    Task<CampaignApplicantsResponse> GetApplicantsAsync(Guid brandAppUserId, Guid campaignId);
    Task RespondToApplicationAsync(Guid brandAppUserId, Guid campaignId, Guid applicationId, RespondToApplicationRequest request);
}