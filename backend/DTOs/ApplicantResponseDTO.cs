namespace influenco.backend.DTOs;

public class ApplicantResponse
{
    public Guid ApplicationId { get; set; }
    public Guid InfluencerId { get; set; }
    public string DisplayName { get; set; } = null!;
    public string Handle { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
    public string Email { get; set; } = null!;
    public int TotalFollowers { get; set; }
    public double? OverallEngagementRate { get; set; }
    public string? PitchMessage { get; set; }
    public decimal? ProposedRate { get; set; }
    public string Status { get; set; } = null!;
    public string? BrandResponseMessage { get; set; }
}