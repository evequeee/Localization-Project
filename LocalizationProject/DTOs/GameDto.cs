namespace LocalizationProject.Dtos;

public class GameDto
{
    public int Id { get; set; } // Primary Key
    public string Title { get; set; } = string.Empty; // Назва гри
    public string Description { get; set; } = string.Empty;
    public string OriginalLanguage { get; set; } = string.Empty; // Мова оригіналу
    public string TranslationStatus { get; set; } = "Planned"; // Статус: Planned, InProgress, Completed, Dropped
    public string? ImageUrl { get; set; } // URL обкладинки гри
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<LocalizationSummaryDto> Localizations { get; set; } = new();
}

public class LocalizationSummaryDto
{
    public string Language { get; set; } = string.Empty;
    public List<string> TeamNames { get; set; } = new();
}