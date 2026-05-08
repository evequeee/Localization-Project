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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<LocalizationTeam>().HasData(
        new LocalizationTeam { Id = 1, Name = "SBT Localization", ContactEmail = "info@sbt.ua" },
        new LocalizationTeam { Id = 2, Name = "Localize Team", ContactEmail = "contact@localize.org" }
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
    new Localization { Id = 1, Language = "Ukrainian", Status = "In Progress", GameId = 1 }, // P5 Royal
    new Localization { Id = 2, Language = "Ukrainian", Status = "Completed", GameId = 8 },   // Bioshock
    new Localization { Id = 3, Language = "English", Status = "Completed", GameId = 4 }      // Dispatch
);

    modelBuilder.Entity("LocalizationLocalizationTeam").HasData(
    new { LocalizationsId = 1, TeamsId = 1 }, // SBT працює над Persona 5
    new { LocalizationsId = 2, TeamsId = 2 }, // Localize Team закінчили Bioshock
    new { LocalizationsId = 3, TeamsId = 2 }  // Localize Team також зробили Dispatch
    );
}
}