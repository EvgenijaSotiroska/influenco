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

    public DateTime? StatsUpdatedAt { get; set; }

    public int TotalReach { get; set; }
    public double? InstagramEngagementRate { get; set; }
    public double? TikTokEngagementRate { get; set; }
    public double? OverallEngagementRate { get; set; }
}