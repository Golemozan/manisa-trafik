using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ManisaTrafik.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRoleAndStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(
        name: "FullName",
        table: "Users",
        type: "character varying(100)",
        maxLength: 100,
        nullable: false,
        defaultValue: "");

    migrationBuilder.AddColumn<bool>(
        name: "IsActive",
        table: "Users",
        type: "boolean",
        nullable: false,
        defaultValue: false);

    migrationBuilder.AddColumn<int>(
        name: "Role",
        table: "Users",
        type: "integer",
        nullable: false,
        defaultValue: 0);

    
    migrationBuilder.Sql("UPDATE \"Users\" SET \"IsActive\" = true WHERE \"IsActive\" = false;");
    migrationBuilder.Sql("UPDATE \"Users\" SET \"FullName\" = \"Username\" WHERE \"FullName\" = '';");
}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");
        }
    }
}
