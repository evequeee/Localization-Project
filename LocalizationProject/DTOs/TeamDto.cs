namespace LocalizationProject.Dtos;

public class TeamDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? ContactEmail { get; set; }
}