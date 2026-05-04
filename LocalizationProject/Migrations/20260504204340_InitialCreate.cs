using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LocalizationProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ContactEmail = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    OriginalLanguage = table.Column<string>(type: "text", nullable: false),
                    TranslationStatus = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LocalizationTeamId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_Teams_LocalizationTeamId",
                        column: x => x.LocalizationTeamId,
                        principalTable: "Teams",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Localizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Language = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Localizations_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocalizationLocalizationTeam",
                columns: table => new
                {
                    LocalizationsId = table.Column<int>(type: "integer", nullable: false),
                    TeamsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalizationLocalizationTeam", x => new { x.LocalizationsId, x.TeamsId });
                    table.ForeignKey(
                        name: "FK_LocalizationLocalizationTeam_Localizations_LocalizationsId",
                        column: x => x.LocalizationsId,
                        principalTable: "Localizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LocalizationLocalizationTeam_Teams_TeamsId",
                        column: x => x.TeamsId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CreatedAt", "Description", "LocalizationTeamId", "OriginalLanguage", "Title", "TranslationStatus" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "JPN", "Persona 5 Royal", "In Progress" },
                    { 2, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "JPN", "Persona 3 Reload", "In Progress" },
                    { 3, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "JPN", "Persona 4 Golden", "Completed" },
                    { 4, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Dispatch", "In Progress" },
                    { 5, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "DOOM (2016)", "Completed" },
                    { 6, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Tomb Raider (2013)", "Completed" },
                    { 7, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Terraria", "Completed" },
                    { 8, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Bioshock", "Completed" },
                    { 9, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Far Cry", "Completed" },
                    { 10, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), "", null, "ENG", "Hades", "Completed" }
                });

            migrationBuilder.InsertData(
                table: "Teams",
                columns: new[] { "Id", "ContactEmail", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "info@sbt.ua", "", "SBT Localization" },
                    { 2, "contact@localize.org", "", "Localize Team" }
                });

            migrationBuilder.InsertData(
                table: "Localizations",
                columns: new[] { "Id", "GameId", "Language", "Status" },
                values: new object[,]
                {
                    { 1, 1, "Ukrainian", "In Progress" },
                    { 2, 8, "Ukrainian", "Completed" },
                    { 3, 4, "English", "Completed" }
                });

            migrationBuilder.InsertData(
                table: "LocalizationLocalizationTeam",
                columns: new[] { "LocalizationsId", "TeamsId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 },
                    { 3, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_LocalizationTeamId",
                table: "Games",
                column: "LocalizationTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_LocalizationLocalizationTeam_TeamsId",
                table: "LocalizationLocalizationTeam",
                column: "TeamsId");

            migrationBuilder.CreateIndex(
                name: "IX_Localizations_GameId",
                table: "Localizations",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LocalizationLocalizationTeam");

            migrationBuilder.DropTable(
                name: "Localizations");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Teams");
        }
    }
}
