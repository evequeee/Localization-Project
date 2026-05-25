using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LocalizationProject.Endpoints;

public static class TeamEndpoints
{
    public static void MapTeamEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/teams");

        group.MapGet("/", GetAllTeams);
        group.MapGet("/{teamId}", GetTeamById);
        group.MapPost("/", [Authorize(Roles = $"{UserRoles.Admin}")] async (CreateTeamDto dto, AppDbContext db) => await CreateTeam(dto, db));
        
        // Join requests endpoints
        group.MapPost("/{teamId}/requests", [Authorize] async (int teamId, AppDbContext db, HttpContext context) => await CreateJoinRequest(teamId, db, context));
        group.MapGet("/{teamId}/requests", [Authorize] async (int teamId, AppDbContext db, HttpContext context) => await GetTeamRequests(teamId, db, context));
        group.MapPatch("/requests/{requestId}", [Authorize] async (int requestId, UpdateTeamJoinRequestDto dto, AppDbContext db, HttpContext context) => await UpdateJoinRequest(requestId, dto, db, context));
    }

    private static async Task<IResult> GetAllTeams(AppDbContext db)
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

    private static async Task<IResult> GetTeamById(int teamId, AppDbContext db)
    {
        var team = await db.Teams
            .Where(t => t.Id == teamId)
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                ContactEmail = t.ContactEmail
            })
            .FirstOrDefaultAsync();

        if (team == null)
        {
            return Results.NotFound(new { message = "Команду не знайдено" });
        }

        return Results.Ok(team);
    }

    private static async Task<IResult> CreateTeam(CreateTeamDto dto, AppDbContext db)
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

    private static async Task<IResult> CreateJoinRequest(int teamId, AppDbContext db, HttpContext context)
    {
        // Отримуємо ID користувача з токена
        var userIdClaim = context.User.FindFirst("sub")?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        // Перевіряємо, чи існує команда
        var team = await db.Teams.FindAsync(teamId);
        if (team == null)
        {
            return Results.NotFound();
        }

        // Перевіряємо, чи вже є заявка від цього користувача
        var existingRequest = await db.TeamJoinRequests
            .FirstOrDefaultAsync(r => r.UserId == userId && r.TeamId == teamId && r.Status == "Pending");
        
        if (existingRequest != null)
        {
            return Results.BadRequest(new { message = "У вас вже є активна заявка до цієї команди" });
        }

        var joinRequest = new TeamJoinRequest
        {
            UserId = userId,
            TeamId = teamId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        db.TeamJoinRequests.Add(joinRequest);
        await db.SaveChangesAsync();

        return Results.Created($"/api/teams/{teamId}/requests/{joinRequest.Id}", joinRequest);
    }

    private static async Task<IResult> GetTeamRequests(int teamId, AppDbContext db, HttpContext context)
    {
        // Отримуємо ID користувача з токена
        var userIdClaim = context.User.FindFirst("sub")?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        // Отримуємо роль користувача
        var userRole = context.User.FindFirst("role")?.Value ??
                       context.User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

        // Перевіряємо, чи користувач є админом команди (TODO: реалізувати правильну логіку)
        // На даний момент дозволяємо Admin та TeamAdmin
        if (userRole != "Admin" && userRole != "TeamAdmin")
        {
            return Results.Forbid();
        }

        var requests = await db.TeamJoinRequests
            .Where(r => r.TeamId == teamId)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new TeamJoinRequestDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserEmail = r.User!.Email ?? string.Empty,
                TeamId = r.TeamId,
                Status = r.Status,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt
            })
            .ToListAsync();

        return Results.Ok(requests);
    }

    private static async Task<IResult> UpdateJoinRequest(int requestId, UpdateTeamJoinRequestDto dto, AppDbContext db, HttpContext context)
    {
        // Отримуємо ID користувача з токена
        var userIdClaim = context.User.FindFirst("sub")?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        // Отримуємо роль користувача
        var userRole = context.User.FindFirst("role")?.Value ??
                       context.User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

        // Перевіряємо, чи користувач має право на це
        if (userRole != "Admin" && userRole != "TeamAdmin")
        {
            return Results.Forbid();
        }

        var request = await db.TeamJoinRequests.FindAsync(requestId);
        if (request == null)
        {
            return Results.NotFound();
        }

        // Валідація статусу
        if (!new[] { "Approved", "Rejected" }.Contains(dto.Status))
        {
            return Results.BadRequest(new { message = "Невалідний статус" });
        }

        request.Status = dto.Status;
        request.ResolvedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Results.Ok(new TeamJoinRequestDto
        {
            Id = request.Id,
            UserId = request.UserId,
            TeamId = request.TeamId,
            Status = request.Status,
            CreatedAt = request.CreatedAt,
            ResolvedAt = request.ResolvedAt
        });
    }
}
