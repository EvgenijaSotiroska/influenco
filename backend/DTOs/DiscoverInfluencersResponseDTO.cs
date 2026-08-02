namespace influenco.backend.DTOs;

public class DiscoverInfluencersResponseDTO
{
	public List<DiscoverInfluencerDTO> Influencers { get; set; } = new();
	public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore { get; set; }
}