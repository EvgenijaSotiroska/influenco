using influenco.backend.DTOs;

namespace influenco.backend.Services;

public interface IBrandService
{
    Task<GetBrandProfileResponse> GetProfileAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateBrandProfileRequest request);
}