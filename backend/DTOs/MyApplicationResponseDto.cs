namespace influenco.backend.DTOs;

public class MyApplicationResponse
{
    public Guid ApplicationId { get; set; }
    public Guid CampaignId { get; set; }
    public string CampaignTitle { get; set; } = null!;
    public string BrandName { get; set; } = null!;
    public string? BrandLogoUrl { get; set; }
    public string? PitchMessage { get; set; }
    public decimal? ProposedRate { get; set; }
    public string Status { get; set; } = null!;
    public string? BrandResponseMessage { get; set; }
    public DateTime CreatedAt { get; set; }
}