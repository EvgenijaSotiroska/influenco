namespace influenco.backend.DTOs;

public class GetBrandProfileResponse
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
}