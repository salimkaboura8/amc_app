using System.Security.Claims;
using Amc.Auth;
using Amc.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Amc.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IUserStore _users;
    private readonly IJwtTokenService _jwt;

    public AuthController(IUserStore users, IJwtTokenService jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (req is null || string.IsNullOrWhiteSpace(req.Email) || req.Password is null)
            return BadRequest(new { error = "Email and password are required." });

        if (!_users.ValidateCredentials(req.Email, req.Password))
            return Unauthorized();

        var user = _users.FindByEmail(req.Email)!;
        var claims = user.Roles.Select(r => new Claim(ClaimTypes.Role, r));
        var token = _jwt.CreateToken(user.Email, claims);
        return Ok(new LoginResponse(token));
    }
}
