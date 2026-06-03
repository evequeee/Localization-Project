using LocalizationProject.Dtos;
using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LocalizationProject.Endpoints;

public static class TeamEndpoints
{
    public static void MapTeamEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/teams");

        group.MapGet("/", GetAllTeams);
        group.MapGet("/{teamId}", GetTeamById);
        group.MapPost("/", [Authorize] async (CreateTeamDto dto, AppDbContext db, HttpContext context) => await CreateTeam(dto, db, context));

        // Join requests endpoints
        group.MapPost("/{id}/join", [Authorize] async (int id, AppDbContext db, HttpContext context) => await JoinTeam(id, db, context));
        group.MapGet("/my-dashboard", [Authorize] async (AppDbContext db, HttpContext context) => await GetMyDashboard(db, context));
        group.MapPost("/requests/{reqId}/approve", [Authorize] async (int reqId, AppDbContext db, HttpContext context) => await ApproveRequest(reqId, db, context));
        group.MapPost("/requests/{reqId}/reject", [Authorize] async (int reqId, AppDbContext db, HttpContext context) => await RejectRequest(reqId, db, context));

        // Admin endpoints
        var adminGroup = app.MapGroup("/api/admin");
        adminGroup.MapGet("/pending-teams", [Authorize(Roles = $"{UserRoles.Admin}")] async (AppDbContext db) => await GetPendingTeams(db));
        adminGroup.MapPost("/teams/{id}/approve", [Authorize(Roles = $"{UserRoles.Admin}")] async (int id, AppDbContext db) => await ApproveTeam(id, db));
        adminGroup.MapPost("/teams/{id}/reject", [Authorize(Roles = $"{UserRoles.Admin}")] async (int id, AppDbContext db) => await RejectTeam(id, db));
        adminGroup.MapPost("/fix-legacy-teams", async (AppDbContext db) => await FixLegacyTeams(db));
    }

    private static async Task<IResult> GetAllTeams(AppDbContext db)
    {
        var teams = await db.Teams
            .Where(t => t.IsApproved)
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

    private static async Task<IResult> CreateTeam(CreateTeamDto dto, AppDbContext db, HttpContext context)
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var newTeam = new LocalizationTeam
        {
            Name = dto.Name,
            ContactEmail = dto.ContactEmail ?? string.Empty,
            OwnerId = userId,
            IsApproved = false
        };
        db.Teams.Add(newTeam);
        await db.SaveChangesAsync();
        return Results.Ok(new { message = "Заявка на створення команди відправлена модератору." });
    }

    private static async Task<IResult> JoinTeam(int id, AppDbContext db, HttpContext context)
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        try
        {
            var team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return Results.NotFound("Команду не знайдено.");
            }

            var requestExists = await db.TeamJoinRequests
                .AnyAsync(r => r.UserId == userId && r.TeamId == id);

            if (requestExists)
            {
                return Results.BadRequest("У вас вже є активна заявка до цієї команди.");
            }

            var joinRequest = new TeamJoinRequest
            {
                UserId = userId,
                TeamId = id,
                Status = JoinRequestStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            db.TeamJoinRequests.Add(joinRequest);
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "Заявку успішно надіслано" });
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }

    private static async Task<IResult> GetMyDashboard(AppDbContext db, HttpContext context)
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var user = await db.Users.FindAsync(userId);
        if (user == null)
        {
            return Results.Unauthorized();
        }

        var team = await db.Teams
            .Include(t => t.Localizations)
                .ThenInclude(l => l.Game)
            .Include(t => t.JoinRequests)
                .ThenInclude(r => r.User)
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.OwnerId == userId || (user.TeamId.HasValue && t.Id == user.TeamId.Value));

        if (team == null)
        {
            return Results.NotFound(new { message = "Ви не є членом команди" });
        }

        var isOwner = team.OwnerId == userId;

        var projects = team.Localizations
            .Select(l => new
            {
                l.Id,
                l.Language,
                l.Status,
                GameTitle = l.Game.Title
            })
            .ToList();

        var members = await db.Users
            .Where(u => u.TeamId == team.Id)
            .Select(u => new
            {
                u.Id,
                u.UserName,
                u.Email
            })
            .ToListAsync();

        var requests = team.JoinRequests
            .Where(r => r.Status == JoinRequestStatus.Pending)
            .Select(r => new
            {
                r.Id,
                r.UserId,
                UserName = r.User != null ? r.User.UserName : "Unknown",
                UserEmail = r.User != null ? r.User.Email : "Unknown",
                r.CreatedAt
            })
            .ToList();

        return Results.Ok(new
        {
            Team = new
            {
                team.Id,
                team.Name,
                team.ContactEmail,
                team.IsApproved
            },
            Projects = projects,
            Members = members,
            Requests = requests,
            IsOwner = isOwner
        });
    }

    private static async Task<IResult> ApproveRequest(int reqId, AppDbContext db, HttpContext context)
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var request = await db.TeamJoinRequests
            .Include(r => r.Team)
            .FirstOrDefaultAsync(r => r.Id == reqId);

        if (request == null)
        {
            return Results.NotFound();
        }

        if (request.Team == null || request.Team.OwnerId != userId)
        {
            return Results.Forbid();
        }

        request.Status = JoinRequestStatus.Approved;
        request.ResolvedAt = DateTime.UtcNow;

        var user = await db.Users.FindAsync(request.UserId);
        if (user != null)
        {
            user.TeamId = request.TeamId;
        }

        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Заявку схвалено" });
    }

    private static async Task<IResult> RejectRequest(int reqId, AppDbContext db, HttpContext context)
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !int.TryParse(currentUserId, out var userId))
        {
            return Results.Unauthorized();
        }

        var request = await db.TeamJoinRequests
            .Include(r => r.Team)
            .FirstOrDefaultAsync(r => r.Id == reqId);

        if (request == null)
        {
            return Results.NotFound();
        }

        if (request.Team == null || request.Team.OwnerId != userId)
        {
            return Results.Forbid();
        }

        request.Status = JoinRequestStatus.Rejected;
        request.ResolvedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Заявку відхилено" });
    }

    private static async Task<IResult> GetPendingTeams(AppDbContext db)
    {
        var pendingTeams = await db.Teams
            .Include(t => t.Owner)
            .Where(t => !t.IsApproved)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.ContactEmail,
                OwnerEmail = t.Owner.Email,
                OwnerName = t.Owner.UserName
            })
            .ToListAsync();

        return Results.Ok(pendingTeams);
    }

    private static async Task<IResult> ApproveTeam(int id, AppDbContext db)
    {
        var team = await db.Teams.FindAsync(id);
        if (team == null)
        {
            return Results.NotFound("Команду не знайдено.");
        }

        team.IsApproved = true;
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Команду схвалено." });
    }

    private static async Task<IResult> RejectTeam(int id, AppDbContext db)
    {
        var team = await db.Teams.FindAsync(id);
        if (team == null)
        {
            return Results.NotFound("Команду не знайдено.");
        }

        db.Teams.Remove(team);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Команду відхилено." });
    }

    private static async Task<IResult> FixLegacyTeams(AppDbContext db)
    {
        var updated = await db.Teams
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsApproved, true));

        return Results.Ok(new { message = $"Відновлено {updated} команд." });
    }
}
