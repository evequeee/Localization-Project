using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalizationProject.Migrations
{
    /// <inheritdoc />
    public partial class SyncTeamLableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_LocalizationTeam_TeamId",
                table: "Games");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocalizationTeam",
                table: "LocalizationTeam");

            migrationBuilder.RenameTable(
                name: "LocalizationTeam",
                newName: "Teams");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Teams",
                table: "Teams",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Teams_TeamId",
                table: "Games",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Teams_TeamId",
                table: "Games");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Teams",
                table: "Teams");

            migrationBuilder.RenameTable(
                name: "Teams",
                newName: "LocalizationTeam");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocalizationTeam",
                table: "LocalizationTeam",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_LocalizationTeam_TeamId",
                table: "Games",
                column: "TeamId",
                principalTable: "LocalizationTeam",
                principalColumn: "Id");
        }
    }
}
