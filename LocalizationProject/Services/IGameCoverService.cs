namespace LocalizationProject.Services;

/// <summary>
/// Сервіс для пошуку обкладинок ігор через зовнішні API
/// </summary>
public interface IGameCoverService
{
    /// <summary>
    /// Пошук URL обкладинки гри за назвою
    /// </summary>
    /// <param name="gameName">Назва гри</param>
    /// <returns>URL обкладинки або null якщо не знайдено</returns>
    Task<string?> GetGameCoverUrlAsync(string gameName);
}
