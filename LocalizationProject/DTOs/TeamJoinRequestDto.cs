namespace LocalizationProject.Dtos;

public class TeamJoinRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public int TeamId { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class UpdateTeamJoinRequestDto
{
    public string Status { get; set; } = string.Empty; // "Approved" або "Rejected"
}
