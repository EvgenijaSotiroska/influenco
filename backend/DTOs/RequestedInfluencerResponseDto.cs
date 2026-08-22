namespace influenco.backend.DTOs;

public class RequestedInfluencerResponse
{
    public Guid RequestId { get; set; }
    public Guid InfluencerId { get; set; }
    public string DisplayName { get; set; } = null!;
    public string Handle { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
    public string Status { get; set; } = null!;
    public decimal? OfferedBudget { get; set; }
    public List<string> Deliverables { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public bool HasDeal { get; set; }
}