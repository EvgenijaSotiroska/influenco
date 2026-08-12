using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/browse-campaigns")]
public class BrowseCampaignsController : ControllerBase
{
    private readonly ICampaignApplicationService _service;

    public BrowseCampaignsController(ICampaignApplicationService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<BrowseCampaignsResponse>> Browse([FromQuery] BrowseCampaignsQuery query)
    {
        var userId = User.Identity?.IsAuthenticated == true ? GetUserId() : (Guid?)null;
        var result = await _service.BrowseAsync(userId, query);
        return Ok(result);
    }

    [HttpPost("{campaignId}/apply")]
    [Authorize(Roles = "Influencer")]
    public async Task<IActionResult> Apply(Guid campaignId, ApplyToCampaignRequest request)
    {
        await _service.ApplyAsync(GetUserId(), campaignId, request);
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