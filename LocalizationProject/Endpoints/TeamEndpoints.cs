using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LocalizationProject.Endpoints;

public static class TeamEndpoints
{
    public static void MapTeamEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/teams");

        group.MapGet("/", GetAllTeams);
        group.MapPost("/", [Authorize(Roles = $"{UserRoles.Admin}")] async (CreateTeamDto dto, AppDbContext db) => await CreateTeam(dto, db));
    }

    private static async Task<IResult> GetAllTeams(AppDbContext db)
    {
        var teams = await db.Teams
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                ContactEmail = t.ContactEmail
            })
            .ToListAsync();
        return Results.Ok(teams);
    }

    private static async Task<IResult> CreateTeam(CreateTeamDto dto, AppDbContext db)
    {
        var newTeam = new LocalizationTeam
        {
            Name = dto.Name,
            ContactEmail = dto.ContactEmail ?? string.Empty
        };
        db.Teams.Add(newTeam);
        await db.SaveChangesAsync();
        return Results.Ok(newTeam);
    }
}
