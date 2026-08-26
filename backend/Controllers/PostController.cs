using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/posts")]
public class PostController : ControllerBase
{
    private readonly IPostService _service;

    public PostController(IPostService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Roles = "Brand,Influencer")]
    public async Task<ActionResult<PostResponse>> Create(CreatePostRequest request)
    {
        var result = await _service.CreateAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpGet("influencer/{influencerId}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<PostResponse>>> GetForInfluencer(Guid influencerId)
    {
        var result = await _service.GetForInfluencerAsync(influencerId);
        return Ok(result);
    }

    [HttpGet("brand/{brandId}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<PostResponse>>> GetForBrand(Guid brandId)
    {
        var result = await _service.GetForBrandAsync(brandId);
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
