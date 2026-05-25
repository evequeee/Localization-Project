namespace LocalizationProject.Models;

public class TeamJoinRequest
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TeamId { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public AppUser? User { get; set; }
    public LocalizationTeam? Team { get; set; }
}
