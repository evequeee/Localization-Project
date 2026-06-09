using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalizationProject.Migrations
{
    /// <inheritdoc />
    public partial class AddTargetUpdateDeadline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TargetUpdateDeadline",
                table: "Localizations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 1,
                column: "TargetUpdateDeadline",
                value: null);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 2,
                column: "TargetUpdateDeadline",
                value: null);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 3,
                column: "TargetUpdateDeadline",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetUpdateDeadline",
                table: "Localizations");
        }
    }
}
