namespace influenco.backend.DTOs;

public class CreateCollaborationRequestDto
{
    public Guid InfluencerId { get; set; }
    public Guid? CampaignId { get; set; }
    public List<string> Deliverables { get; set; } = new();
    public decimal? OfferedBudget { get; set; }
    public DateTime? Timeline { get; set; }
    public string? Message { get; set; }
}