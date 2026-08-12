namespace influenco.backend.DTOs;

public class CampaignSummaryResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public int ApplicantsCount { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public string Status { get; set; } = null!;
}