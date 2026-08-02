namespace influenco.backend.DTOs;

public class DiscoverQuery
{
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 6;
	public string? Location { get; set; }
	public string? Category { get; set; }
	public int? MinFollowers { get; set; }
	public int? MaxFollowers { get; set; }
}