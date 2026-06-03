namespace LocalizationProject.Models;

public class LocalizationTeam
{
    public int Id { get; set; } // Primary Key
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public int OwnerId { get; set; } // Team owner (TeamAdmin)
    public bool IsApproved { get; set; } = false; // Admin approval required
    public AppUser Owner { get; set; } = null!;
    public List<Localization> Localizations { get; set; } = new();
    public List<TeamJoinRequest> JoinRequests { get; set; } = new();
}