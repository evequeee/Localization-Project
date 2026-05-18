using System.ComponentModel.DataAnnotations;
using System.Text;
using FluentValidation;
using LocalizationProject;
using LocalizationProject.Endpoints;
using LocalizationProject.Middlewares;
using LocalizationProject.Models;
using LocalizationProject.Services;
using LocalizationProject.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIdentity<AppUser, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Чи перевіряти підпис (найголовніше!)
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        
        // Хто видав токен
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        
        // Для кого виданий токен
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        
        // Перевірка часу життя (щоб протерміновані не пускало)
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();
builder.Services.AddScoped<ITokenService, TokenService>();

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

try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var roles = new[] { UserRoles.Admin, UserRoles.TeamAdmin, UserRoles.User };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<int>(role));
            }
        }

        // Seed Admin користувача
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        
        var adminEmail = "admin@test.com";
        var adminPassword = "Admin123!";
        
        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new AppUser 
            { 
                UserName = adminEmail, 
                Email = adminEmail,
                EmailConfirmed = true
            };
            
            var result = await userManager.CreateAsync(adminUser, adminPassword);
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                Console.WriteLine($"✅ Admin користувач створено: {adminEmail}");
            }
            else
            {
                Console.WriteLine($"❌ Помилка створення admin користувача: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error applying migrations or seeding roles: {ex.Message}");
}

app.UseCors("AllowFrontend");

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Map all endpoints
app.MapGameEndpoints();
app.MapLocalizationEndpoints();
app.MapTeamEndpoints();
app.MapAuthEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();