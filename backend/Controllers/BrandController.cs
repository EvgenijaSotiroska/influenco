using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/brand")]
[Authorize(Roles = "Brand")]
public class BrandController : ControllerBase
{
    private readonly IBrandService _service;

    public BrandController(IBrandService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<GetBrandProfileResponse>> GetProfile()
    {
        var userId = GetUserId();
        var profile = await _service.GetProfileAsync(userId);
        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateBrandProfileRequest request)
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