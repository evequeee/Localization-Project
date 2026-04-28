using LocalizationProject.Models;

public class Localization
{
    public int Id { get; set; }
    public string Language { get; set; } = "Ukrainian";
    public string Status { get; set; } = "In Progress"; // Наприклад: Planned, In Progress, Completed
    
    public int GameId { get; set; }
    public Game Game { get; set; } = null!;

    public List<LocalizationTeam> Teams { get; set; } = new();
}