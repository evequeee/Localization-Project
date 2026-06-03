namespace LocalizationProject.Models;

public enum JoinRequestStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

public class TeamJoinRequest
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TeamId { get; set; }
    public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public AppUser? User { get; set; }
    public LocalizationTeam? Team { get; set; }
}
