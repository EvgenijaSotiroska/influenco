namespace influenco.backend.Models;

public class Post : BaseEntity
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

    public string Content { get; set; } = null!;
    public List<string> ImageUrls { get; set; } = new();
}
