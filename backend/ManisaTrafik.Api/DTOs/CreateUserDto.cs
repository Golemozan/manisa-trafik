using System.ComponentModel.DataAnnotations;

namespace ManisaTrafik.Api.DTOs;

public class CreateUserDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Kullanıcı adı 3-50 karakter arasında olmalı")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalı")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ad Soyad zorunludur")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Ad Soyad 2-100 karakter arasında olmalı")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Rol seçimi zorunludur")]
    public string Role { get; set; } = "Personnel";
}