using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LocalizationProject.Models;

namespace LocalizationProject;
public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Game> Games { get; set; }
    public DbSet<LocalizationTeam> Teams { get; set;  }
    public DbSet<Localization> Localizations { get; set; }
    public DbSet<TeamJoinRequest> TeamJoinRequests { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<GameLike> GameLikes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configure GameLike composite key
    modelBuilder.Entity<GameLike>()
        .HasKey(gl => new { gl.UserId, gl.GameId });

    // Configure Comment relationships
    modelBuilder.Entity<Comment>()
        .HasOne(c => c.Game)
        .WithMany(g => g.Comments)
        .HasForeignKey(c => c.GameId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Comment>()
        .HasOne(c => c.User)
        .WithMany()
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // Configure GameLike relationships
    modelBuilder.Entity<GameLike>()
        .HasOne(gl => gl.Game)
        .WithMany(g => g.Likes)
        .HasForeignKey(gl => gl.GameId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<GameLike>()
        .HasOne(gl => gl.User)
        .WithMany()
        .HasForeignKey(gl => gl.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // Configure LocalizationTeam Owner relationship
    modelBuilder.Entity<LocalizationTeam>()
        .HasOne(t => t.Owner)
        .WithMany()
        .HasForeignKey(t => t.OwnerId)
        .OnDelete(DeleteBehavior.Restrict);

    // Configure AppUser Team relationship
    modelBuilder.Entity<AppUser>()
        .HasOne(u => u.Team)
        .WithMany()
        .HasForeignKey(u => u.TeamId)
        .OnDelete(DeleteBehavior.Restrict);

    // Configure Localization Team relationship
    modelBuilder.Entity<Localization>()
        .HasOne(l => l.Team)
        .WithMany(t => t.Localizations)
        .HasForeignKey(l => l.TeamId)
        .OnDelete(DeleteBehavior.Restrict);

    // Configure TeamJoinRequest relationships
    modelBuilder.Entity<TeamJoinRequest>()
        .HasOne(tjr => tjr.User)
        .WithMany(u => u.JoinRequests)
        .HasForeignKey(tjr => tjr.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<TeamJoinRequest>()
        .HasOne(tjr => tjr.Team)
        .WithMany(t => t.JoinRequests)
        .HasForeignKey(tjr => tjr.TeamId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<LocalizationTeam>().HasData(
        new LocalizationTeam { Id = 1, Name = "SBT Localization", ContactEmail = "info@sbt.ua", OwnerId = 1 },
        new LocalizationTeam { Id = 2, Name = "Localize Team", ContactEmail = "contact@localize.org", OwnerId = 2 }
    );

    var seedDate = new DateTime(2026, 04, 30, 0, 0, 0, DateTimeKind.Utc);

    modelBuilder.Entity<Game>().HasData(
        new Game { Id = 1, Title = "Persona 5 Royal", OriginalLanguage = "JPN", TranslationStatus = "In Progress", CreatedAt = seedDate },
        new Game { Id = 2, Title = "Persona 3 Reload", OriginalLanguage = "JPN", TranslationStatus = "In Progress", CreatedAt = seedDate },
        new Game { Id = 3, Title = "Persona 4 Golden", OriginalLanguage = "JPN", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 4, Title = "Dispatch", OriginalLanguage = "ENG", TranslationStatus = "In Progress", CreatedAt = seedDate },
        new Game { Id = 5, Title = "DOOM (2016)", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 6, Title = "Tomb Raider (2013)", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 7, Title = "Terraria", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 8, Title = "Bioshock", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 9, Title = "Far Cry", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate },
        new Game { Id = 10, Title = "Hades", OriginalLanguage = "ENG", TranslationStatus = "Completed", CreatedAt = seedDate }
    );

    modelBuilder.Entity<Localization>().HasData(
    new Localization { Id = 1, Language = "Ukrainian", Status = "In Progress", GameId = 1, TeamId = 1 }, // P5 Royal - SBT
    new Localization { Id = 2, Language = "Ukrainian", Status = "Completed", GameId = 8, TeamId = 2 },   // Bioshock - Localize Team
    new Localization { Id = 3, Language = "English", Status = "Completed", GameId = 4, TeamId = 2 }      // Dispatch - Localize Team
);
}
}