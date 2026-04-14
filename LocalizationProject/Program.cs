using LocalizationProject;
using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("LocalizationProject")));

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
        .Select(g => new GameDto
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            OriginalLanguage = g.OriginalLanguage,
            TranslationStatus = g. TranslationStatus,
            CreatedAt = g.CreatedAt
        })
    .ToListAsync();
    return Results.Ok(games);
});

app.MapPost("/api/games", async (CreateGameDto dto, AppDbContext db) =>
{
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

app.MapPut("/api/games/{id}", async (int id, UpdateGameDto dto, AppDbContext db) =>
{
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();