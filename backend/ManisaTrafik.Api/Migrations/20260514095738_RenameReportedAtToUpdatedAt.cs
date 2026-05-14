using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ManisaTrafik.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameReportedAtToUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReportedAt",
                table: "Reports",
                newName: "UpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Reports",
                newName: "ReportedAt");
        }
    }
}
