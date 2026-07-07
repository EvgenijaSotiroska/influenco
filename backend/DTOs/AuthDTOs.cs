namespace influenco.backend.DTOs;

public record RegisterInfluencerRequest(string Email, string Password, string DisplayName);

public record RegisterBrandRequest(string Email, string Password, string CompanyName);

public record LoginRequest(string Email, string Password);

public record AuthResponse(Guid UserId, string Email, string Role, Guid? ProfileId, string Token, DateTime ExpiresAt);