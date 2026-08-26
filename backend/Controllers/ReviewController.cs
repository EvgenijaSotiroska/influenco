using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _service;

    public ReviewController(IReviewService service)
    {
        _service = service;
    }

    [HttpPost("influencer/{influencerId}")]
    [Authorize(Roles = "Brand")]
    public async Task<ActionResult<ReviewResponse>> Create(Guid influencerId, CreateReviewRequest request)
    {
        var result = await _service.CreateOrUpdateAsync(GetUserId(), influencerId, request);
        return Ok(result);
    }

    [HttpGet("influencer/{influencerId}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ReviewResponse>>> GetForInfluencer(Guid influencerId)
    {
        var result = await _service.GetForInfluencerAsync(influencerId);
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
