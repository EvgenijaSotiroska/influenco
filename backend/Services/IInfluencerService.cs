using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IInfluencerService
{
    Task<GetInfluencerProfileResponse> GetProfileAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateInfluencerProfileRequest request);
    Task<DiscoverInfluencersResponseDTO> GetDiscoverInfluencersAsync(DiscoverQuery query);
    Task<GetInfluencerProfileResponse> GetPublicProfileByIdAsync(Guid influencerId);
    Task UpdateCoverPositionAsync(Guid userId, int position);
}