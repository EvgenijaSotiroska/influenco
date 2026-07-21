namespace influenco.backend.DTOs;

public class GetInfluencerProfileResponse
{
    public Guid Id { get; set; }

    public string DisplayName { get; set; } = null!;
    public string Handle { get; set; } = null!;

    public string? Bio { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public string? CoverImageUrl { get; set; }

    public string? Location { get; set; }

    public List<string> Categories { get; set; } = new();

    public bool IsVerified { get; set; }
}