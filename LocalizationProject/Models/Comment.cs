namespace LocalizationProject.Models;

public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int GameId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Game Game { get; set; } = null!;
    public AppUser User { get; set; } = null!;
}
