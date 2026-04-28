using System.ComponentModel.DataAnnotations;
using FluentValidation;
using LocalizationProject;
using LocalizationProject.Dtos;
using LocalizationProject.Models;
using LocalizationProject.Validators;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("LocalizationProject")));
builder.Services.AddValidatorsFromAssemblyContaining<CreateGameDtoValidator>();

var app = builder.Build();

app.MapGet("/api/games/{id}", async (int id, AppDbContext db) =>
{
    var game = await db.Games.FindAsync(id);
    if (game == null)
    {
        return Results.NotFound();
    }
        var gameDto = new GameDto
        {
            Id = game.Id,
            Title = game.Title,
            Description = game.Description,
            OriginalLanguage = game.OriginalLanguage,
            TranslationStatus = game. TranslationStatus,
            CreatedAt = game.CreatedAt
        };
        return Results.Ok(gameDto);
});

app.MapGet("/api/games", async (string? status, AppDbContext db) =>   //Фільтрація, пошук за статусом перекладу
{
    var query = db.Games.AsQueryable();
    if (!string.IsNullOrEmpty(status))
    {
        query = query.Where(g => g.TranslationStatus == status);
    }

    var games = await query
        .Include( g => g.Localizations)
        .Select(g => new GameDto
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            OriginalLanguage = g.OriginalLanguage,
            TranslationStatus = g. TranslationStatus,
            CreatedAt = g.CreatedAt,
            Languages = g.Localizations.Select(l => l.Language).ToList()
        })
    .ToListAsync();
    return Results.Ok(games);
});

app.MapPost("/api/games", async (CreateGameDto dto, IValidator<CreateGameDto> validator, AppDbContext db) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.ValidationProblem(validationResult.ToDictionary());
    }
    var newGame = new Game
    {
        Title = dto.Title,
        Description = dto.Description,
        OriginalLanguage = dto.OriginalLanguage,
        TranslationStatus = dto.TranslationStatus
    };

    db.Games.Add(newGame);
    await db.SaveChangesAsync();
    return Results.Ok(newGame);
});

app.MapPut("/api/games/{id}", async (int id, UpdateGameDto dto, IValidator<UpdateGameDto> validator, AppDbContext db) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.ValidationProblem(validationResult.ToDictionary());
    }
    var game = await db.Games.FindAsync(id);
    if (game == null)
    {
        return Results.NotFound();
    }
        game.Title = dto.Title;
        game.Description = dto.Description;
        game.OriginalLanguage = dto.OriginalLanguage;
        game.TranslationStatus = dto.TranslationStatus;
        await db.SaveChangesAsync();
        return Results.NoContent();
});

app.MapDelete("/api/games/{id}", async (int id, AppDbContext db) =>
{
    var game = await db.Games.FindAsync(id);
    if (game == null)
    {
        return Results.NotFound();
    }
    else
    {
        db.Games.Remove(game);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
});

// 1. Створити локалізацію для гри
app.MapPost("/api/localizations", async (CreateLocalizationDto dto, AppDbContext db) =>
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
});

// 2. Прив'язати команду до локалізації (Many-to-Many)
app.MapPost("/api/localizations/{locId}/teams/{teamId}", async (int locId, int teamId, AppDbContext db) =>
{
    var loc = await db.Localizations.Include(l => l.Teams).FirstOrDefaultAsync(l => l.Id == locId);
    var team = await db.Teams.FindAsync(teamId);

    if (loc == null || team == null) return Results.NotFound("Локалізацію або команду не знайдено");

    loc.Teams.Add(team);
    await db.SaveChangesAsync();

    return Results.Ok($"Команда {team.Name} тепер працює над перекладом {loc.Language}");
});

// 3. Отримати всі локалізації з їхніми командами
app.MapGet("/api/localizations", async (AppDbContext db) =>
{
    return await db.Localizations
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
});

app.MapGet("/api/teams", async (AppDbContext db) =>
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
);

app.MapPost("/api/teams", async (CreateTeamDto dto, AppDbContext db) =>
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
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();