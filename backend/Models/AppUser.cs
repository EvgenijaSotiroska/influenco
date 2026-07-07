using Microsoft.AspNetCore.Identity;

namespace influenco.backend.Models;

public class AppUser : IdentityUser<Guid>
{
	public UserRole Role { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	public Influencer? InfluencerProfile { get; set; }
	public Brand? BrandProfile { get; set; }
}