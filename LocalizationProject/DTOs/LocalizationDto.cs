namespace LocalizationProject.Dtos;



public class LocalizationDto

{

    public int Id { get; set; }

    public string Language { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public int GameId { get; set; }

    public List<string> Teams { get; set; } = new();

}



public class CreateLocalizationDto

{

    public required string Language { get; set; }

    public int GameId { get; set; }

    public int? TeamId { get; set; }

    public string? Status { get; set; }

}