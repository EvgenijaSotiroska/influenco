namespace influenco.backend.DTOs;

public class CampaignResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Deliverables { get; set; }
    public decimal? Budget { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public string Status { get; set; } = null!;
    public List<string> Niches { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public int? MinimumFollowers { get; set; }
    public int ApplicantsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}