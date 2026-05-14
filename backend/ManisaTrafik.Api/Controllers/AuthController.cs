using ManisaTrafik.Api.Data;
using ManisaTrafik.Api.DTOs;
using ManisaTrafik.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManisaTrafik.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _config;

    public AuthController(
        AppDbContext context,
        ITokenService tokenService,
        IConfiguration config)
    {
        _context = context;
        _tokenService = tokenService;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user == null)
        {
            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!passwordValid)
        {
            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new { message = "Hesabınız pasif durumda. Lütfen yöneticiyle iletişime geçin." });
        }

        var token = _tokenService.CreateToken(user);
        var expireHours = int.Parse(_config["Jwt:ExpireHours"] ?? "8");

        return Ok(new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddHours(expireHours)
        });
    }
}