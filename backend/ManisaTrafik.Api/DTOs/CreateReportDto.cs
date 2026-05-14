using System.ComponentModel.DataAnnotations;

namespace ManisaTrafik.Api.DTOs;

public class CreateReportDto
{
    [Required(ErrorMessage = "Başlık zorunludur")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "Başlık 3-200 karakter arasında olmalı")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Açıklama zorunludur")]
    [StringLength(2000, MinimumLength = 10, ErrorMessage = "Açıklama 10-2000 karakter arasında olmalı")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "İlçe zorunludur")]
    [StringLength(100)]
    public string District { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tarih zorunludur")]
    public DateTime ReportDate { get; set; }
}