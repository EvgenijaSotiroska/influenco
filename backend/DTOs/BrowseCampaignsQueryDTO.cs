namespace influenco.backend.DTOs;

public class BrowseCampaignsQuery
{
	public string? Niche { get; set; }
	public string? Platform { get; set; }
	public decimal? MinBudget { get; set; }
	public decimal? MaxBudget { get; set; }
}