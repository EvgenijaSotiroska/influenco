namespace influenco.backend.DTOs;

public class ReviewResponse
{
    public Guid Id { get; set; }
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = null!;
    public string? BrandLogoUrl { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
