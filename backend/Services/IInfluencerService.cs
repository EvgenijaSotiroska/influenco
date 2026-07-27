using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IInfluencerService
{
    Task<GetInfluencerProfileResponse> GetProfileAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateInfluencerProfileRequest request);
    Task<DiscoverInfluencersResponseDTO> GetDiscoverInfluencersAsync(int count);
}