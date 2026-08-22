namespace influenco.backend.DTOs;

public class DealResponse
{
    public Guid Id { get; set; }
    public string BrandName { get; set; } = null!;
    public string? BrandLogoUrl { get; set; }
    public string InfluencerName { get; set; } = null!;
    public string? InfluencerProfilePictureUrl { get; set; }
    public string Title { get; set; } = null!;
    public List<string> Deliverables { get; set; } = new();
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsVerified { get; set; }
}