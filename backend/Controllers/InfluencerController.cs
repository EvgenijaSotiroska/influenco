using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/influencer")]
public class InfluencerController : ControllerBase
{
    private readonly IInfluencerService _service;

    public InfluencerController(IInfluencerService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    [Authorize(Roles = "Influencer")]
    public async Task<ActionResult<GetInfluencerProfileResponse>> GetProfile()
    {
        var userId = GetUserId();

        var profile = await _service.GetProfileAsync(userId);

        return Ok(profile);
    }

    [HttpPut("profile")]
    [Authorize(Roles = "Influencer")]
    public async Task<IActionResult> UpdateProfile(UpdateInfluencerProfileRequest request)
    {
        var userId = GetUserId();

        await _service.UpdateProfileAsync(userId, request);

        return NoContent();
    }

    [HttpGet("discover")]
    [AllowAnonymous]
    public async Task<ActionResult<DiscoverInfluencersResponseDTO>> GetDiscover([FromQuery] DiscoverQuery query)
    {
        var result = await _service.GetDiscoverInfluencersAsync(query);
        return Ok(result);
    }

    [HttpGet("discover/{id}")]
    [Authorize] 
    public async Task<ActionResult<GetInfluencerProfileResponse>> GetInfluencerDetail(Guid id)
    {
        var profile = await _service.GetPublicProfileByIdAsync(id);
        return Ok(profile);
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }

    [HttpPut("profile/cover-position")]
    [Authorize(Roles = "Influencer")]
    public async Task<IActionResult> UpdateCoverPosition(
    UpdateCoverPositionRequest request)
    {
        var userId = GetUserId();

        await _service.UpdateCoverPositionAsync(
            userId,
            request.CoverImagePosition
        );

        return NoContent();
    }
}