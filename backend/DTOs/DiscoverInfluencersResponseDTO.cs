namespace influenco.backend.DTOs;

public class DiscoverInfluencersResponseDTO
{
	public List<DiscoverInfluencerDTO> Influencers { get; set; } = new();
	public int TotalCount { get; set; }
}