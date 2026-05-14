using System.ComponentModel.DataAnnotations;

namespace ManisaTrafik.Api.DTOs;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "Yeni şifre zorunludur")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalı")]
    public string NewPassword { get; set; } = string.Empty;
}