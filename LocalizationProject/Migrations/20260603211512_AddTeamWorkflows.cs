using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LocalizationProject.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamWorkflows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Teams_LocalizationTeamId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "LocalizationLocalizationTeam");

            migrationBuilder.DropIndex(
                name: "IX_Games_LocalizationTeamId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "LocalizationTeamId",
                table: "Games");

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Teams",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(@"
                ALTER TABLE ""TeamJoinRequests"" ADD COLUMN ""StatusTemp"" integer;
                UPDATE ""TeamJoinRequests"" SET ""StatusTemp"" = CASE ""Status""
                    WHEN 'Pending' THEN 0
                    WHEN 'Approved' THEN 1
                    WHEN 'Rejected' THEN 2
                    ELSE 0
                END;
                ALTER TABLE ""TeamJoinRequests"" DROP COLUMN ""Status"";
                ALTER TABLE ""TeamJoinRequests"" RENAME COLUMN ""StatusTemp"" TO ""Status"";
            ");

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Localizations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 1,
                column: "TeamId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 2,
                column: "TeamId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Localizations",
                keyColumn: "Id",
                keyValue: 3,
                column: "TeamId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Teams",
                keyColumn: "Id",
                keyValue: 1,
                column: "OwnerId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Teams",
                keyColumn: "Id",
                keyValue: 2,
                column: "OwnerId",
                value: 2);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_OwnerId",
                table: "Teams",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Localizations_TeamId",
                table: "Localizations",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_TeamId",
                table: "AspNetUsers",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Teams_TeamId",
                table: "AspNetUsers",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Localizations_Teams_TeamId",
                table: "Localizations",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_OwnerId",
                table: "Teams",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Teams_TeamId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Localizations_Teams_TeamId",
                table: "Localizations");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_OwnerId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_OwnerId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Localizations_TeamId",
                table: "Localizations");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_TeamId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Localizations");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "AspNetUsers");

            migrationBuilder.Sql(@"
                ALTER TABLE ""TeamJoinRequests"" ADD COLUMN ""StatusTemp"" text;
                UPDATE ""TeamJoinRequests"" SET ""StatusTemp"" = CASE ""Status""
                    WHEN 0 THEN 'Pending'
                    WHEN 1 THEN 'Approved'
                    WHEN 2 THEN 'Rejected'
                    ELSE 'Pending'
                END;
                ALTER TABLE ""TeamJoinRequests"" DROP COLUMN ""Status"";
                ALTER TABLE ""TeamJoinRequests"" RENAME COLUMN ""StatusTemp"" TO ""Status"";
            ");

            migrationBuilder.AddColumn<int>(
                name: "LocalizationTeamId",
                table: "Games",
                type: "integer",
                nullable: true);

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

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 4,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 5,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 6,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 7,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 8,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 9,
                column: "LocalizationTeamId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 10,
                column: "LocalizationTeamId",
                value: null);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Teams_LocalizationTeamId",
                table: "Games",
                column: "LocalizationTeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }
    }
}
