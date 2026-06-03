namespace LocalizationProject.Dtos;

public class GameDetailsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OriginalLanguage { get; set; } = string.Empty;
    public string TranslationStatus { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<CommentDto> Comments { get; set; } = new();
    public int LikeCount { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
}
