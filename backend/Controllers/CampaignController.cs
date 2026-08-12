using System.Security.Claims;
using influenco.backend.DTOs;
using influenco.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/campaigns")]
[Authorize(Roles = "Brand")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignService _service;
    private readonly ICampaignApplicationService _applicationService;

    public CampaignController(ICampaignService service, ICampaignApplicationService applicationService)
    {
        _service = service;
        _applicationService = applicationService;
    }

    [HttpPost]
    public async Task<ActionResult<CampaignResponse>> Create(CreateCampaignRequest request)
    {
        var result = await _service.CreateAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<CampaignSummaryResponse>>> GetAll()
    {
        var result = await _service.GetAllForBrandAsync(GetUserId());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CampaignResponse>> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(GetUserId(), id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, CreateCampaignRequest request)
    {
        await _service.UpdateAsync(GetUserId(), id, request);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(GetUserId(), id);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(userId);
    }

    [HttpGet("{id}/applicants")]
    public async Task<ActionResult<CampaignApplicantsResponse>> GetApplicants(Guid id)
    {
        var result = await _applicationService.GetApplicantsAsync(GetUserId(), id);
        return Ok(result);
    }

    [HttpPut("{id}/applicants/{applicationId}")]
    public async Task<IActionResult> RespondToApplicant(
        Guid id, Guid applicationId, RespondToApplicationRequest request)
    {
        await _applicationService.RespondToApplicationAsync(GetUserId(), id, applicationId, request);
        return NoContent();
    }
}