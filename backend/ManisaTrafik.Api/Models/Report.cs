using System.ComponentModel.DataAnnotations;

namespace ManisaTrafik.Api.Models;

public class Report
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    public DateTime ReportDate { get; set; }

    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? HandledBy { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }

    public DateTime? UpdatedAt { get; set; }
}