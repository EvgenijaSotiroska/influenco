using influenco.backend.Data;
using influenco.backend.DTOs;
using influenco.backend.Models;
using influenco.backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace influenco.backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
	private readonly UserManager<AppUser> _userManager;
	private readonly ITokenService _tokenService;
	private readonly AppDbContext _db;
	private readonly IConfiguration _config;

	public AuthController(UserManager<AppUser> userManager, ITokenService tokenService, AppDbContext db, IConfiguration config)
	{
		_userManager = userManager;
		_tokenService = tokenService;
		_db = db;
		_config = config;
	}

	[HttpPost("register/influencer")]
	public async Task<ActionResult<AuthResponse>> RegisterInfluencer(RegisterInfluencerRequest request)
	{
		var existing = await _userManager.FindByEmailAsync(request.Email);
		if (existing is not null)
			return Conflict("An account with this email already exists.");

		var user = new AppUser
		{
			UserName = request.Email,
			Email = request.Email,
			Role = UserRole.Influencer
		};

		var result = await _userManager.CreateAsync(user, request.Password);
		if (!result.Succeeded)
			return BadRequest(result.Errors.Select(e => e.Description));

		var influencer = new Influencer
		{
			Id = Guid.NewGuid(),
			AppUserId = user.Id,
			DisplayName = request.DisplayName
		};

		_db.Influencers.Add(influencer);
		await _db.SaveChangesAsync();

		return Ok(BuildAuthResponse(user, influencer.Id));
	}

	[HttpPost("register/brand")]
	public async Task<ActionResult<AuthResponse>> RegisterBrand(RegisterBrandRequest request)
	{
		var existing = await _userManager.FindByEmailAsync(request.Email);
		if (existing is not null)
			return Conflict("An account with this email already exists.");

		var user = new AppUser
		{
			UserName = request.Email,
			Email = request.Email,
			Role = UserRole.Brand
		};

		var result = await _userManager.CreateAsync(user, request.Password);
		if (!result.Succeeded)
			return BadRequest(result.Errors.Select(e => e.Description));

		var brand = new Brand
		{
			Id = Guid.NewGuid(),
			AppUserId = user.Id,
			CompanyName = request.CompanyName
		};

		_db.Brands.Add(brand);
		await _db.SaveChangesAsync();

		return Ok(BuildAuthResponse(user, brand.Id));
	}

	[HttpPost("login")]
	public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
	{
		var user = await _userManager.FindByEmailAsync(request.Email);
		if (user is null)
			return Unauthorized("Invalid email or password.");

		var validPassword = await _userManager.CheckPasswordAsync(user, request.Password);
		if (!validPassword)
			return Unauthorized("Invalid email or password.");

		Guid? profileId = user.Role switch
		{
			UserRole.Influencer => (await _db.Influencers.FirstOrDefaultAsync(i => i.AppUserId == user.Id))?.Id,
			UserRole.Brand => (await _db.Brands.FirstOrDefaultAsync(b => b.AppUserId == user.Id))?.Id,
			_ => null
		};

		return Ok(BuildAuthResponse(user, profileId));
	}

	private AuthResponse BuildAuthResponse(AppUser user, Guid? profileId)
	{
		var token = _tokenService.GenerateToken(user, profileId);
		var expiryMinutes = _config.GetValue<int>("Jwt:ExpiryMinutes");

		return new AuthResponse(user.Id, user.Email!, user.Role.ToString(), profileId, token,
			DateTime.UtcNow.AddMinutes(expiryMinutes));
	}
}