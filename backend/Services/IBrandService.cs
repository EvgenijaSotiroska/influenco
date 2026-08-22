using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IBrandService
{
    Task<GetBrandProfileResponse> GetProfileAsync(Guid userId);
    Task<GetBrandProfileResponse> GetPublicProfileByIdAsync(Guid brandId);
    Task UpdateProfileAsync(Guid userId, UpdateBrandProfileRequest request);
    Task<List<CampaignSummaryResponse>> GetPublicActiveCampaignsAsync(Guid brandId);
}