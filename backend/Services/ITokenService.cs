using influenco.backend.Models;

namespace influenco.backend.Services;

public interface ITokenService
{
	string GenerateToken(AppUser user, Guid? profileId);
}