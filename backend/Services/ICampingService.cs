using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface ICampaignService
{
    Task<CampaignResponse> CreateAsync(Guid appUserId, CreateCampaignRequest request);
    Task<List<CampaignSummaryResponse>> GetAllForBrandAsync(Guid appUserId);
    Task<CampaignResponse> GetByIdAsync(Guid appUserId, Guid campaignId);
    Task UpdateAsync(Guid appUserId, Guid campaignId, CreateCampaignRequest request);
    Task DeleteAsync(Guid appUserId, Guid campaignId);
}