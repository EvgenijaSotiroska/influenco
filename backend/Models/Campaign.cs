namespace influenco.backend.Models;

public enum CampaignStatus
{
    Draft,
    OpenForApplications,
    Closed
}

public class Campaign : BaseEntity
{
    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Deliverables { get; set; }

    public decimal? Budget { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    public List<string> Niches { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public int? MinimumFollowers { get; set; }

    public int ApplicantsCount { get; set; } = 0;
}