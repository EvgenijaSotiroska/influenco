namespace influenco.backend.DTOs;

public class CampaignApplicantsResponse
{
    public Guid CampaignId { get; set; }
    public string CampaignTitle { get; set; } = null!;
    public List<ApplicantResponse> Applicants { get; set; } = new();
    public string? CampaignDeliverables { get; set; }
}