namespace influenco.backend.DTOs;

public class IncomingCollaborationRequestResponse
{
    public Guid RequestId { get; set; }
    public string BrandName { get; set; } = null!;
    public string? BrandLogoUrl { get; set; }
    public string? CampaignTitle { get; set; }
    public List<string> Deliverables { get; set; } = new();
    public decimal? OfferedBudget { get; set; }
    public DateTime? Timeline { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}