namespace influenco.backend.DTOs;

public class PostResponse
{
    public Guid Id { get; set; }
    public string AuthorName { get; set; } = null!;
    public string? AuthorAvatarUrl { get; set; }
    public string Content { get; set; } = null!;
    public List<string> ImageUrls { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
