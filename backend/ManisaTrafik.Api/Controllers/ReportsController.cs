using ManisaTrafik.Api.Data;
using ManisaTrafik.Api.DTOs;
using ManisaTrafik.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManisaTrafik.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReportDto dto)
    {
        var report = new Report
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            District = dto.District.Trim(),
            ReportDate = DateTime.SpecifyKind(dto.ReportDate, DateTimeKind.Utc),
            Status = ReportStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = report.Id },
            MapToResponseDto(report));
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound();
        return Ok(MapToResponseDto(report));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var reports = await _context.Reports
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var dtos = reports.Select(MapToResponseDto).ToList();
        return Ok(dtos);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto? dto)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound(new { message = "İhbar bulunamadı" });

        ReportStatus newStatus;
        if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
        {
            newStatus = ReportStatus.Resolved;
        }
        else
        {
            newStatus = dto.Status switch
            {
                "Bekliyor" => ReportStatus.Pending,
                "Çözüldü" => ReportStatus.Resolved,
                "Tamamlandı" => ReportStatus.Resolved,
                "İşlemde" => ReportStatus.InProgress,
                "İptal" => ReportStatus.Cancelled,
                _ => (ReportStatus)(-1)
            };

            if ((int)newStatus == -1)
            {
                return BadRequest(new { message = "Geçersiz durum" });
            }
        }

        if (report.Status == newStatus)
        {
            return BadRequest(new { message = "İhbar zaten bu durumda" });
        }

        report.Status = newStatus;
        await _context.SaveChangesAsync();

        return Ok(MapToResponseDto(report));
    }

    [HttpPatch("{id:int}/report-info")]
    [Authorize]
    public async Task<IActionResult> UpdateReportInfo(int id, [FromBody] UpdateReportInfoDto dto)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound(new { message = "İhbar bulunamadı" });

        report.HandledBy = string.IsNullOrWhiteSpace(dto.HandledBy) ? null : dto.HandledBy.Trim();
        report.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim();
        report.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(MapToResponseDto(report));
    }

    private static ReportResponseDto MapToResponseDto(Report report)
    {
        return new ReportResponseDto
        {
            Id = report.Id,
            Title = report.Title,
            Description = report.Description,
            District = report.District,
            ReportDate = report.ReportDate,
            Status = report.Status switch
            {
                ReportStatus.Pending => "Bekliyor",
                ReportStatus.Resolved => "Çözüldü",
                ReportStatus.InProgress => "İşlemde",
                ReportStatus.Cancelled => "İptal",
                _ => "Bekliyor"
            },
            CreatedAt = report.CreatedAt,
            HandledBy = report.HandledBy,
            Notes = report.Notes,
            UpdatedAt = report.UpdatedAt
        };
    }
}