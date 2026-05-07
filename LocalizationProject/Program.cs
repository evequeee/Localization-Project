using System.ComponentModel.DataAnnotations;
using FluentValidation;
using LocalizationProject;
using LocalizationProject.Dtos;
using LocalizationProject.Endpoints;
using LocalizationProject.Middlewares;
using LocalizationProject.Models;
using LocalizationProject.Validators;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("LocalizationProject")));
builder.Services.AddValidatorsFromAssemblyContaining<CreateGameDtoValidator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5176")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// pending migrations
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error applying migrations: {ex.Message}");
}

app.UseCors("AllowFrontend");

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Map all endpoints
app.MapGameEndpoints();
app.MapLocalizationEndpoints();
app.MapTeamEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();