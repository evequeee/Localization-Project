using FluentValidation;
using LocalizationProject.Dtos;
using LocalizationProject.Models;
using LocalizationProject.Services;
using LocalizationProject.Validators;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LocalizationProject.Endpoints;

public static class GameEndpoints
{
    public static void MapGameEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/games");

        group.MapGet("/", GetAllGames);
        group.MapGet("/{id}/details", GetGameDetails);
        group.MapGet("/{id}", GetGameById);
        group.MapPost("/", [Authorize(Roles = $"{UserRoles.Admin}")] async (CreateGameDto dto, IValidator<CreateGameDto> validator, AppDbContext db) => await CreateGame(dto, validator, db));
        group.MapPut("/{id}", [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.TeamAdmin}")] async (int id, UpdateGameDto dto, IValidator<UpdateGameDto> validator, AppDbContext db) => await UpdateGame(id, dto, validator, db));
        group.MapDelete("/{id}", [Authorize(Roles = $"{UserRoles.Admin}")] async (int id, AppDbContext db) => await DeleteGame(id, db));
        group.MapPost("/fetch-covers", [Authorize(Roles = $"{UserRoles.Admin}")] async (IGameCoverService coverService, AppDbContext db) => await FetchMissingGameCovers(coverService, db));
        group.MapPost("/{id}/comments", [Authorize] async (int id, CreateCommentDto dto, AppDbContext db, HttpContext httpContext) => await AddComment(id, dto, db, httpContext));
        group.MapPost("/{id}/toggle-like", [Authorize] async (int id, AppDbContext db, HttpContext httpContext) => await ToggleLike(id, db, httpContext));
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

    private static async Task<IResult> GetAllGames(string? status, string? search, AppDbContext db)
    {
        var query = db.Games.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(g => g.TranslationStatus == status);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(g => EF.Functions.ILike(g.Title, $"%{search}%"));

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

    private static async Task<IResult> GetGameDetails(int id, AppDbContext db, HttpContext httpContext)
    {
        var game = await db.Games
            .Include(g => g.Comments)
                .ThenInclude(c => c.User)
            .Include(g => g.Likes)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game == null)
        {
            return Results.NotFound();
        }

        var currentUserId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userIdInt = currentUserId != null && int.TryParse(currentUserId, out var parsedId) ? parsedId : (int?)null;

        var comments = game.Comments
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                GameId = c.GameId,
                UserId = c.UserId,
                UserName = c.User.UserName ?? "Unknown",
                CreatedAt = c.CreatedAt
            })
            .ToList();

        var gameDetails = new GameDetailsDto
        {
            Id = game.Id,
            Title = game.Title,
            Description = game.Description,
            OriginalLanguage = game.OriginalLanguage,
            TranslationStatus = game.TranslationStatus,
            ImageUrl = game.ImageUrl,
            CreatedAt = game.CreatedAt,
            Comments = comments,
            LikeCount = game.Likes.Count,
            IsLikedByCurrentUser = userIdInt.HasValue && game.Likes.Any(l => l.UserId == userIdInt.Value)
        };

        return Results.Ok(gameDetails);
    }

    private static async Task<IResult> AddComment(int id, CreateCommentDto dto, AppDbContext db, HttpContext httpContext)
    {
        var game = await db.Games.FindAsync(id);
        if (game == null)
        {
            return Results.NotFound();
        }

        var currentUserId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var comment = new Comment
        {
            Text = dto.Text,
            GameId = id,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        var commentDto = new CommentDto
        {
            Id = comment.Id,
            Text = comment.Text,
            GameId = comment.GameId,
            UserId = comment.UserId,
            UserName = (await db.Users.FindAsync(userId))?.UserName ?? "Unknown",
            CreatedAt = comment.CreatedAt
        };

        return Results.Ok(commentDto);
    }

    private static async Task<IResult> ToggleLike(int id, AppDbContext db, HttpContext httpContext)
    {
        var game = await db.Games.FindAsync(id);
        if (game == null)
        {
            return Results.NotFound();
        }

        var currentUserId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var existingLike = await db.GameLikes
            .FirstOrDefaultAsync(gl => gl.UserId == userId && gl.GameId == id);

        if (existingLike != null)
        {
            db.GameLikes.Remove(existingLike);
            await db.SaveChangesAsync();
            return Results.Ok(new { liked = false, likeCount = await db.GameLikes.CountAsync(gl => gl.GameId == id) });
        }
        else
        {
            var like = new GameLike
            {
                UserId = userId,
                GameId = id
            };
            db.GameLikes.Add(like);
            await db.SaveChangesAsync();
            return Results.Ok(new { liked = true, likeCount = await db.GameLikes.CountAsync(gl => gl.GameId == id) });
        }
    }
}   