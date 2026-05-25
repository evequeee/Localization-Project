using Microsoft.AspNetCore.Identity;

namespace LocalizationProject.Models;

// Спадкуємося від IdentityUser<int>, щоб ID був цілим числом
public class AppUser : IdentityUser<int>
{
    // Навігаційна властивість для заявок користувача в команди
    public List<TeamJoinRequest> JoinRequests { get; set; } = new();
    // можна додати кастомні поля, наприклад:
    // public string? TelegramHandle { get; set; }
}