namespace influenco.backend.Models;

public class Deal : BaseEntity
{
    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;

    public Guid InfluencerId { get; set; }
    public Influencer Influencer { get; set; } = null!;

    public Guid? CampaignId { get; set; }
    public Campaign? Campaign { get; set; }

    public Guid? CampaignApplicationId { get; set; }
    public Guid? CollaborationRequestId { get; set; }

    public string Title { get; set; } = null!;
    public List<string> Deliverables { get; set; } = new();
    public decimal Price { get; set; }

    public bool IsVerified { get; set; } = false;
}