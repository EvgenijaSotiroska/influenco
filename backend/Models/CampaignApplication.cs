namespace influenco.backend.Models;

public enum ApplicationStatus
{
    Pending,
    Accepted,
    Rejected
}

public class CampaignApplication : BaseEntity
{
    public Guid CampaignId { get; set; }
    public Campaign Campaign { get; set; } = null!;

    public Guid InfluencerId { get; set; }
    public Influencer Influencer { get; set; } = null!;

    public string? PitchMessage { get; set; }
    public decimal? ProposedRate { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    public string? BrandResponseMessage { get; set; }
}