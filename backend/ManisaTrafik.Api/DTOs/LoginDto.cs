using System.ComponentModel.DataAnnotations;
namespace ManisaTrafik.Api.DTOs;

public class LoginDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Parola zorunludur")]
    public string Password { get; set; } = string.Empty;
}