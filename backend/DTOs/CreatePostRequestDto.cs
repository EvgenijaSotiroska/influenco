namespace influenco.backend.DTOs;

public class CreatePostRequest
{
    public string? Content { get; set; } = null!;
    public List<string>? ImageUrls { get; set; }
}
