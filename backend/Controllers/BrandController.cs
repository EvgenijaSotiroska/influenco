using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/brand")]
[Authorize]
public class BrandController : ControllerBase
{
    private readonly IBrandService _service;

    public BrandController(IBrandService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    [Authorize(Roles = "Brand")]
    public async Task<ActionResult<GetBrandProfileResponse>> GetProfile()
    {
        var userId = GetUserId();

        var profile = await _service.GetProfileAsync(userId);

        return Ok(profile);
    }

    [HttpPut("profile")]
    [Authorize(Roles = "Brand")]
    public async Task<IActionResult> UpdateProfile(
        UpdateBrandProfileRequest request)
    {
        var userId = GetUserId();

        await _service.UpdateProfileAsync(userId, request);

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetBrandProfileResponse>> GetById(Guid id)
    {
        var result = await _service.GetPublicProfileByIdAsync(id);

        return Ok(result);
    }

    [HttpGet("{id}/campaigns")]
    public async Task<ActionResult<List<CampaignSummaryResponse>>> GetActiveCampaigns(
        Guid id)
    {
        var result = await _service.GetPublicActiveCampaignsAsync(id);

        return Ok(result);
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }
}