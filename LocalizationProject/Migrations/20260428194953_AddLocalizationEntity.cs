using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LocalizationProject.Migrations
{
    /// <inheritdoc />
    public partial class AddLocalizationEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Teams_TeamId",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "Games",
                newName: "LocalizationTeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Games_TeamId",
                table: "Games",
                newName: "IX_Games_LocalizationTeamId");

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

            migrationBuilder.CreateIndex(
                name: "IX_LocalizationLocalizationTeam_TeamsId",
                table: "LocalizationLocalizationTeam",
                column: "TeamsId");

            migrationBuilder.CreateIndex(
                name: "IX_Localizations_GameId",
                table: "Localizations",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Teams_LocalizationTeamId",
                table: "Games",
                column: "LocalizationTeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Teams_LocalizationTeamId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "LocalizationLocalizationTeam");

            migrationBuilder.DropTable(
                name: "Localizations");

            migrationBuilder.RenameColumn(
                name: "LocalizationTeamId",
                table: "Games",
                newName: "TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Games_LocalizationTeamId",
                table: "Games",
                newName: "IX_Games_TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Teams_TeamId",
                table: "Games",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }
    }
}
