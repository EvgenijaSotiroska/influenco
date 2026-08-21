namespace influenco.backend.Models;

public enum CollaborationRequestStatus
{
    Pending,
    Accepted,
    Declined
}

public class CollaborationRequest : BaseEntity
{
    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;

    public Guid InfluencerId { get; set; }
    public Influencer Influencer { get; set; } = null!;

    public Guid? CampaignId { get; set; }
    public Campaign? Campaign { get; set; }

    public List<string> Deliverables { get; set; } = new();
    public decimal? OfferedBudget { get; set; }
    public DateTime? Timeline { get; set; }
    public string? Message { get; set; }

    public CollaborationRequestStatus Status { get; set; } = CollaborationRequestStatus.Pending;
}