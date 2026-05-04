using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalizationProject.Endpoints;

public static class LocalizationEndpoints
{
    public static void MapLocalizationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/localizations");

        group.MapPost("/", CreateLocalization);
        group.MapPost("/{locId}/teams/{teamId}", AddTeamToLocalization);
        group.MapGet("/", GetAllLocalizations);
    }

    private static async Task<IResult> CreateLocalization(CreateLocalizationDto dto, AppDbContext db)
    {
        var localization = new Localization
        {
            Language = dto.Language,
            GameId = dto.GameId,
            Status = "In Progress"
        };

        db.Localizations.Add(localization);
        await db.SaveChangesAsync();
        return Results.Created($"/api/localizations/{localization.Id}", localization);
    }

    private static async Task<IResult> AddTeamToLocalization(int locId, int teamId, AppDbContext db)
    {
        var loc = await db.Localizations.Include(l => l.Teams).FirstOrDefaultAsync(l => l.Id == locId);
        var team = await db.Teams.FindAsync(teamId);

        if (loc == null || team == null) 
            return Results.NotFound("Локалізацію або команду не знайдено");

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