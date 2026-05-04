using FluentValidation;
using LocalizationProject.Dtos;
using LocalizationProject.Models;
using LocalizationProject.Validators;
using Microsoft.EntityFrameworkCore;

namespace LocalizationProject.Endpoints;

public static class GameEndpoints
{
    public static void MapGameEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/games");

        group.MapGet("/{id}", GetGameById);
        group.MapGet("/", GetAllGames);
        group.MapPost("/", CreateGame);
        group.MapPut("/{id}", UpdateGame);
        group.MapDelete("/{id}", DeleteGame);
    }

    private static async Task<IResult> GetGameById(int id, AppDbContext db)
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
            TranslationStatus = game.TranslationStatus,
            CreatedAt = game.CreatedAt
        };
        return Results.Ok(gameDto);
    }

    private static async Task<IResult> GetAllGames(string? status, AppDbContext db)
    {
        var query = db.Games.AsQueryable();
        if (!string.IsNullOrEmpty(status))
            query = query.Where(g => g.TranslationStatus == status);

        var games = await query
            .Include(g => g.Localizations)
                .ThenInclude(l => l.Teams)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                OriginalLanguage = g.OriginalLanguage,
                TranslationStatus = g.TranslationStatus,
                CreatedAt = g.CreatedAt,
                Localizations = g.Localizations.Select(l => new LocalizationSummaryDto
                {
                    Language = l.Language,
                    TeamNames = l.Teams.Select(t => t.Name).ToList()
                }).ToList()
            }).ToListAsync();

        return Results.Ok(games);
    }

    private static async Task<IResult> CreateGame(CreateGameDto dto, IValidator<CreateGameDto> validator, AppDbContext db)
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
    }

    private static async Task<IResult> UpdateGame(int id, UpdateGameDto dto, IValidator<UpdateGameDto> validator, AppDbContext db)
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
    }

    private static async Task<IResult> DeleteGame(int id, AppDbContext db)
    {
        var game = await db.Games.FindAsync(id);
        if (game == null)
        {
            return Results.NotFound();
        }
        db.Games.Remove(game);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
}   