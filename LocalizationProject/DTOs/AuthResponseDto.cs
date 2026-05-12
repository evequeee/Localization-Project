namespace LocalizationProject.Dtos;

public class AuthResponseDto
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public IList<string> Roles { get; set; } = new List<string>();
}