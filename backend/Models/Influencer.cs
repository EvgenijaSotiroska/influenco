using System.ComponentModel.DataAnnotations.Schema;

namespace influenco.backend.Models;

public class Influencer : BaseEntity
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

    public string DisplayName { get; set; } = null!;
    public string? Bio { get; set; }                  
    public string? ProfilePictureUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Location { get; set; }
    public List<string> Categories { get; set; } = new(); 
    public bool IsVerified { get; set; }
}