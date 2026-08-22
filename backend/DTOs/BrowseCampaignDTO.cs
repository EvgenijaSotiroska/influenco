namespace influenco.backend.DTOs;

public class BrowseCampaignDto
{
    public Guid Id { get; set; }
    public string BrandName { get; set; } = null!;
    public Guid BrandId { get; set; }
    public string? BrandLogoUrl { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public decimal? Budget { get; set; }
    public int? MinimumFollowers { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public string Status { get; set; } = null!;
    public List<string> Niches { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public int ApplicantsCount { get; set; }
    public bool HasApplied { get; set; }
}