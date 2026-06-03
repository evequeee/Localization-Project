using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LocalizationProject.Endpoints;

public static class LocalizationEndpoints
{
    public static void MapLocalizationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/localizations");

        group.MapPost("/", [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.TeamAdmin}")] async (CreateLocalizationDto dto, AppDbContext db) => await CreateLocalization(dto, db));
        group.MapPost("/{locId}/teams/{teamId}", [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.TeamAdmin}")] async (int locId, int teamId, AppDbContext db) => await AddTeamToLocalization(locId, teamId, db));
        group.MapGet("/", GetAllLocalizations);
    }

    private static async Task<IResult> CreateLocalization(CreateLocalizationDto dto, AppDbContext db)
    {
        LocalizationTeam? team = null;
        if (dto.TeamId.HasValue)
        {
            team = await db.Teams.FindAsync(dto.TeamId.Value);
            if (team == null)
                return Results.BadRequest("Команду не знайдено");
        }

        var localization = new Localization
        {
            Language = dto.Language,
            GameId = dto.GameId,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "In Progress" : dto.Status
        };

        if (team != null)
        {
            localization.Teams.Add(team);
        }

        db.Localizations.Add(localization);
        await db.SaveChangesAsync();

        var resultDto = new LocalizationDto
        {
            Id = localization.Id,
            Language = localization.Language,
            Status = localization.Status,
            GameId = localization.GameId,
            Teams = localization.Teams.Select(t => t.Name).ToList()
        };

        return Results.Created($"/api/localizations/{localization.Id}", resultDto);
    }

    private static async Task<IResult> AddTeamToLocalization(int locId, int teamId, AppDbContext db)
    {
        var loc = await db.Localizations.Include(l => l.Teams).FirstOrDefaultAsync(l => l.Id == locId);
        var team = await db.Teams.FindAsync(teamId);

        if (loc == null || team == null) 
            return Results.NotFound("Локалізацію або команду не знайдено");

        if (loc.Teams.Any(t => t.Id == teamId))
            return Results.Ok($"Команда {team.Name} вже закріплена за локалізацією {loc.Language}");

        loc.Teams.Add(team);
        await db.SaveChangesAsync();

        return Results.Ok($"Команда {team.Name} тепер працює над перекладом {loc.Language}");
    }

    private static async Task<IResult> GetAllLocalizations(AppDbContext db)
    {
        var localizations = await db.Localizations
            .Include(l => l.Teams)
            .Select(l => new LocalizationDto
            {
                Id = l.Id,
                Language = l.Language,
                Status = l.Status,
                GameId = l.GameId,
                Teams = l.Teams.Select(t => t.Name).ToList()
            })
            .ToListAsync();
        
        return Results.Ok(localizations);
    }
}