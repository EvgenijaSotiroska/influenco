namespace influenco.backend.DTOs;

public class DiscoverInfluencerDTO
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = null!;
    public string Handle { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public string? Niche { get; set; }
    public bool IsVerified { get; set; }
}