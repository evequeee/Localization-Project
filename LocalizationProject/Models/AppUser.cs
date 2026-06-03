using Microsoft.AspNetCore.Identity;

namespace LocalizationProject.Models;

// Спадкуємося від IdentityUser<int>, щоб ID був цілим числом
public class AppUser : IdentityUser<int>
{
    public int? TeamId { get; set; } // Team the user belongs to (if approved)
    public LocalizationTeam? Team { get; set; }
    // Навігаційна властивість для заявок користувача в команди
    public List<TeamJoinRequest> JoinRequests { get; set; } = new();
    // можна додати кастомні поля, наприклад:
    // public string? TelegramHandle { get; set; }
}