using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/influencer")]
[Authorize(Roles = "Influencer")]
public class InfluencerController : ControllerBase
{
    private readonly IInfluencerService _service;

    public InfluencerController(IInfluencerService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<GetInfluencerProfileResponse>> GetProfile()
    {
        var userId = GetUserId();

        var profile = await _service.GetProfileAsync(userId);

        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateInfluencerProfileRequest request)
    {
        var userId = GetUserId();

        await _service.UpdateProfileAsync(userId, request);

        return NoContent();
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }
}