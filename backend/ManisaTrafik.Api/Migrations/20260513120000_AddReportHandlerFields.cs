using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ManisaTrafik.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddReportHandlerFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HandledBy",
                table: "Reports",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Reports",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReportedAt",
                table: "Reports",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "HandledBy", table: "Reports");
            migrationBuilder.DropColumn(name: "Notes", table: "Reports");
            migrationBuilder.DropColumn(name: "ReportedAt", table: "Reports");
        }
    }
}
