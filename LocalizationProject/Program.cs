using LocalizationProject;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("LocalizationProject")));

var app = builder.Build();

app.MapGet("/api/games", async (AppDbContext db) =>
{
    var games = await db.Games.ToListAsync();
    return Results.Ok(games);
});

app.MapPost("/api/games", async (Game game, AppDbContext db) =>
{
    db.Games.Add(game);
    await db.SaveChangesAsync();
    return Results.Ok(game);
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();