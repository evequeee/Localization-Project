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
        game.TeamId = dto.TeamId;
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