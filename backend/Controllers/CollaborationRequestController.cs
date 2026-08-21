using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/collaboration-requests")]
public class CollaborationRequestController : ControllerBase
{
    private readonly ICollaborationRequestService _service;

    public CollaborationRequestController(ICollaborationRequestService service)
    {
        _service = service;
    }

    [HttpGet("my-active-campaigns")]
    [Authorize(Roles = "Brand")]
    public async Task<ActionResult<List<BrandCampaignOptionDto>>> GetActiveCampaigns()
    {
        var result = await _service.GetActiveCampaignsForBrandAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Brand")]
    public async Task<IActionResult> Create(CreateCollaborationRequestDto request)
    {
        await _service.CreateAsync(GetUserId(), request);
        return NoContent();
    }

    [HttpGet("my-requests")]
    [Authorize(Roles = "Influencer")]
    public async Task<ActionResult<List<IncomingCollaborationRequestResponse>>> GetMyRequests()
    {
        var result = await _service.GetMyRequestsAsync(GetUserId());
        return Ok(result);
    }

    [HttpPut("{id}/respond")]
    [Authorize(Roles = "Influencer")]
    public async Task<IActionResult> Respond(Guid id, RespondToCollaborationRequestDto request)
    {
        await _service.RespondAsync(GetUserId(), id, request);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }

    [HttpGet("pending-count")]
    [Authorize(Roles = "Influencer")]
    public async Task<ActionResult<PendingRequestsCountResponse>> GetPendingCount()
    {
        var count = await _service.GetPendingCountAsync(GetUserId());
        return Ok(new PendingRequestsCountResponse { Count = count });
    }
}