using LocalizationProject.Dtos;
using LocalizationProject.Models;
using LocalizationProject.Services;
using Microsoft.AspNetCore.Identity;

namespace LocalizationProject.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        // Ендпоінт реєстрації
        group.MapPost("/register", async (RegisterDto dto, UserManager<AppUser> userManager, ITokenService tokenService, HttpContext httpContext) =>
        {
            var logger = httpContext.RequestServices.GetRequiredService<ILogger<object>>();
            logger.LogInformation("📝 Спроба реєстрації користувача: {Email}", dto.Email);

            var user = new AppUser { UserName = dto.Email, Email = dto.Email };
            
            var result = await userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                logger.LogWarning("❌ Реєстрація невдалась для {Email}: {Errors}", dto.Email, string.Join("; ", errors));
                return Results.BadRequest(new { Errors = errors });
            }

            // За замовчуванням у всіх нових користувачів роль User
            await userManager.AddToRoleAsync(user, UserRoles.User);

            var roles = await userManager.GetRolesAsync(user);
            var token = tokenService.CreateToken(user, roles);

            logger.LogInformation("✅ Користувач {Email} успішно зареєстрований (ID: {UserId})", dto.Email, user.Id);

            return Results.Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Role = UserRoles.User
                }
            });
        });

        // Ендпоінт логіну
        group.MapPost("/login", async (LoginDto dto, UserManager<AppUser> userManager, ITokenService tokenService, HttpContext httpContext) =>
        {
            var logger = httpContext.RequestServices.GetRequiredService<ILogger<object>>();
            logger.LogInformation("🔑 Спроба входу: {Email}", dto.Email);

            var user = await userManager.FindByEmailAsync(dto.Email);
            
            if (user == null)
            {
                logger.LogWarning("❌ Користувач {Email} не знайдено", dto.Email);
                return Results.Unauthorized();
            }

            if (!await userManager.CheckPasswordAsync(user, dto.Password))
            {
                logger.LogWarning("❌ Невірний пароль для {Email}", dto.Email);
                return Results.Unauthorized();
            }

            var roles = await userManager.GetRolesAsync(user);
            var token = tokenService.CreateToken(user, roles);
            
            // Беремо першу роль (або User як за замовчуванням)
            var primaryRole = roles.Count > 0 ? roles[0] : UserRoles.User;

            logger.LogInformation("✅ Користувач {Email} успішно залогінено (ID: {UserId}, Ролі: {Roles})", 
                dto.Email, user.Id, string.Join(", ", roles));

            return Results.Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Role = primaryRole
                }
            });
        });
    }
}