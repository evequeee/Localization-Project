using LocalizationProject.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalizationProject;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Game> Games { get; set; }
    public DbSet<LocalizationTeam> Teams { get; set;  }
}