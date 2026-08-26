namespace influenco.backend.Models;

public class Review : BaseEntity
{
    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;

    public Guid InfluencerId { get; set; }
    public Influencer Influencer { get; set; } = null!;

    public int Rating { get; set; }
    public string? Comment { get; set; }
}
