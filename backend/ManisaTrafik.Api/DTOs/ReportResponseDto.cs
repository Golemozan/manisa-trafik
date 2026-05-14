namespace ManisaTrafik.Api.DTOs;

public class ReportResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime ReportDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? HandledBy { get; set; }
    public string? Notes { get; set; }
    public DateTime? UpdatedAt { get; set; }
}