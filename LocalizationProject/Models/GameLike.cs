namespace LocalizationProject.Models;

public class GameLike
{
    public int UserId { get; set; }
    public int GameId { get; set; }

    // Navigation properties
    public Game Game { get; set; } = null!;
    public AppUser User { get; set; } = null!;
}
