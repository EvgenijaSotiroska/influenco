using System.ComponentModel.DataAnnotations.Schema;

namespace influenco.backend.Models;

public class Influencer : BaseEntity
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

    public string DisplayName { get; set; } = null!;
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public int CoverImagePosition { get; set; } = 50;
    public string? Location { get; set; }
    public List<string> Categories { get; set; } = new();
    public bool IsVerified { get; set; }
    public string? Handle { get; set; } = null!;

    // Instagram
    public string? InstagramUrl { get; set; }
    public int? InstagramFollowers { get; set; }
    public int? InstagramAvgViews { get; set; }
    public int? InstagramStoryViews { get; set; }

    // TikTok
    public string? TikTokUrl { get; set; }
    public int? TikTokFollowers { get; set; }
    public int? TikTokAvgViews { get; set; }

    // Audience
    public string? AudienceAgeRange { get; set; }
    public string? AudienceGenderSplit { get; set; }
    public string? AudienceTopLocations { get; set; }

    public DateTime? StatsUpdatedAt { get; set; }
}