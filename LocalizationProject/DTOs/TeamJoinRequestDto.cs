using LocalizationProject.Models;

namespace LocalizationProject.Dtos;

public class TeamJoinRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public int TeamId { get; set; }
    public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class UpdateTeamJoinRequestDto
{
    public JoinRequestStatus Status { get; set; } // Approved або Rejected
}
