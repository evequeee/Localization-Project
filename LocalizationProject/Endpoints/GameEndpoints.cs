using FluentValidation;
using LocalizationProject.Dtos;
using LocalizationProject.Models;
using LocalizationProject.Services;
using LocalizationProject.Validators;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LocalizationProject.Endpoints;

public static class GameEndpoints
{
    public static void MapGameEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/games");

        group.MapGet("/{id}", GetGameById);
        group.MapGet("/", GetAllGames);
        group.MapPost("/", [Authorize(Roles = $"{UserRoles.Admin}")] async (CreateGameDto dto, IValidator<CreateGameDto> validator, AppDbContext db) => await CreateGame(dto, validator, db));
        group.MapPut("/{id}", [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.TeamAdmin}")] async (int id, UpdateGameDto dto, IValidator<UpdateGameDto> validator, AppDbContext db) => await UpdateGame(id, dto, validator, db));
        group.MapDelete("/{id}", [Authorize(Roles = $"{UserRoles.Admin}")] async (int id, AppDbContext db) => await DeleteGame(id, db));
        group.MapPost("/fetch-covers", [Authorize(Roles = $"{UserRoles.Admin}")] async (IGameCoverService coverService, AppDbContext db) => await FetchMissingGameCovers(coverService, db));
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
            ImageUrl = game.ImageUrl,
            CreatedAt = game.CreatedAt
        };
        return Results.Ok(gameDto);
    }

    private static async Task<IResult> GetAllGames(string? status, AppDbContext db)
    {
        var query = db.Games.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
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
                ImageUrl = g.ImageUrl,
                CreatedAt = g.CreatedAt,
                Localizations = g.Localizations.Select(l => new LocalizationSummaryDto
                {
                    Language = l.Language,
                    Status = l.Status,
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
            TranslationStatus = dto.TranslationStatus,
            ImageUrl = dto.ImageUrl
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
        game.ImageUrl = dto.ImageUrl;
        await db.SaveChangesAsync();
        
        // Return updated game as JSON response
        var gameDto = new GameDto
        {
            Id = game.Id,
            Title = game.Title,
            Description = game.Description,
            OriginalLanguage = game.OriginalLanguage,
            TranslationStatus = game.TranslationStatus,
            ImageUrl = game.ImageUrl,
            CreatedAt = game.CreatedAt
        };
        return Results.Ok(gameDto);
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

    private static async Task<IResult> FetchMissingGameCovers(IGameCoverService coverService, AppDbContext db)
    {
        // Отримуємо всі ігри де немає обкладинки
        var gamesWithoutCovers = await db.Games
            .Where(g => g.ImageUrl == null)
            .ToListAsync();

        if (!gamesWithoutCovers.Any())
        {
            return Results.Ok(new 
            { 
                message = "✅ Усі ігри вже мають обкладинки!",
                processed = 0,
                successful = 0
            });
        }

        var successful = 0;
        var failed = 0;
        var results = new List<object>();

        // Для кожної гри пошукуємо обкладинку
        foreach (var game in gamesWithoutCovers)
        {
            try
            {
                var coverUrl = await coverService.GetGameCoverUrlAsync(game.Title);
                
                if (coverUrl != null)
                {
                    game.ImageUrl = coverUrl;
                    successful++;
                    results.Add(new 
                    { 
                        gameId = game.Id,
                        title = game.Title,
                        status = "✅ Success",
                        imageUrl = coverUrl
                    });
                }
                else
                {
                    failed++;
                    results.Add(new 
                    { 
                        gameId = game.Id,
                        title = game.Title,
                        status = "⚠️ Not Found"
                    });
                }
            }
            catch (Exception ex)
            {
                failed++;
                results.Add(new 
                { 
                    gameId = game.Id,
                    title = game.Title,
                    status = "❌ Error",
                    error = ex.Message
                });
            }

            // Незначна затримка щоб не перевантажити API
            await Task.Delay(100);
        }

        // Зберігаємо зміни в БД
        await db.SaveChangesAsync();

        return Results.Ok(new 
        { 
            message = $"🎮 Завантаження обкладинок завершено!",
            total = gamesWithoutCovers.Count,
            successful,
            failed,
            details = results
        });
    }
}   