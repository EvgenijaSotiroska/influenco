using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/deals")]
public class DealController : ControllerBase
{
    private readonly IDealService _service;

    public DealController(IDealService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Roles = "Brand")]
    public async Task<ActionResult<DealResponse>> Create(CreateDealRequest request)
    {
        var result = await _service.CreateAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpGet("influencer/{influencerId}")]
    [Authorize] // any authenticated user can view an influencer's deal history
    public async Task<ActionResult<List<DealResponse>>> GetForInfluencer(Guid influencerId)
    {
        var result = await _service.GetForInfluencerAsync(influencerId);
        return Ok(result);
    }

    [HttpGet("my-deals")]
    [Authorize(Roles = "Brand")]
    public async Task<ActionResult<List<DealResponse>>> GetMyDeals()
    {
        var result = await _service.GetForBrandAsync(GetUserId());
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }

    [HttpPut("{id}/verify")]
    [Authorize(Roles = "Brand")]
    public async Task<IActionResult> Verify(Guid id)
    {
        await _service.VerifyAsync(GetUserId(), id);
        return NoContent();
    }
}