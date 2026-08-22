namespace influenco.backend.DTOs;

public class CreateDealRequest
{
    public Guid InfluencerId { get; set; }
    public Guid? CampaignId { get; set; }
    public Guid? CampaignApplicationId { get; set; }
    public Guid? CollaborationRequestId { get; set; }
    public string Title { get; set; } = null!;
    public List<string> Deliverables { get; set; } = new();
    public decimal Price { get; set; }
}