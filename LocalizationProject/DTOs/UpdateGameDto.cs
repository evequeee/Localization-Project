namespace LocalizationProject.Dtos;

public class UpdateGameDto
{
    public string Title { get; set; } = string.Empty; // Назва гри
    public string Description { get; set; } = string.Empty;
    public string OriginalLanguage { get; set; } = string.Empty; // Мова оригіналу
    public string TranslationStatus { get; set; } = "Planned"; // Статус: Planned, InProgress, Completed, Dropped
}