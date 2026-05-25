namespace LocalizationProject.Models;

public class LocalizationTeam
{
    public int Id { get; set; } // Primary Key
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public List<Game> Games { get; set; } = new();
    public List<Localization> Localizations { get; set; } = new();
    public List<TeamJoinRequest> JoinRequests { get; set; } = new();
}