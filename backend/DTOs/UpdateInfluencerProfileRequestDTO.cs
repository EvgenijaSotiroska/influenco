namespace influenco.backend.DTOs;

public class UpdateInfluencerProfileRequest
{
    public string DisplayName { get; set; } = null!;
    public string Handle { get; set; } = null!;
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public List<string> Categories { get; set; } = new();
    public string? ProfilePictureUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public int CoverImagePosition { get; set; } = 50;

    public string? InstagramUrl { get; set; }
    public int? InstagramFollowers { get; set; }
    public int? InstagramAvgViews { get; set; }
    public int? InstagramStoryViews { get; set; }

    public string? TikTokUrl { get; set; }
    public int? TikTokFollowers { get; set; }
    public int? TikTokAvgViews { get; set; }

    public string? AudienceAgeRange { get; set; }
    public string? AudienceGenderSplit { get; set; }
    public string? AudienceTopLocations { get; set; }
}