using System.Text.Json;
using System.Text.Json.Serialization;

namespace LocalizationProject.Services;

/// <summary>
/// Реалізація сервісу для пошуку обкладинок через RAWG API
/// https://rawg.io/apidocs
/// </summary>
public class RawgGameCoverService : IGameCoverService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<RawgGameCoverService> _logger;

    private const string RawgBaseUrl = "https://api.rawg.io/api";

    public RawgGameCoverService(HttpClient httpClient, IConfiguration configuration, ILogger<RawgGameCoverService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string?> GetGameCoverUrlAsync(string gameName)
    {
        if (string.IsNullOrWhiteSpace(gameName))
        {
            _logger.LogWarning("❌ Порожна назва гри для пошуку обкладинки");
            return null;
        }

        try
        {
            // Отримуємо API ключ з конфігурації (опціональний)
            var apiKey = _configuration["RawgApi:Key"];
            
            // Будуємо URL запиту
            var searchUrl = $"{RawgBaseUrl}/games?search={Uri.EscapeDataString(gameName)}&ordering=-rating&page_size=1";
            if (!string.IsNullOrEmpty(apiKey))
            {
                searchUrl += $"&key={apiKey}";
            }

            _logger.LogInformation($"🔍 Пошук обкладинки для гри: '{gameName}'");
            
            var response = await _httpClient.GetAsync(searchUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning($"⚠️ RAWG API повернув статус {response.StatusCode} для гри '{gameName}'");
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var rawgResponse = JsonSerializer.Deserialize<RawgSearchResponse>(content, options);

            // Обираємо першу гру з результатів
            var game = rawgResponse?.Results?.FirstOrDefault();
            
            if (game == null || string.IsNullOrEmpty(game.BackgroundImage))
            {
                _logger.LogWarning($"⚠️ Обкладинка не знайдена для гри '{gameName}'");
                return null;
            }

            _logger.LogInformation($"✅ Знайдена обкладинка для '{gameName}': {game.BackgroundImage}");
            return game.BackgroundImage;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError($"❌ HTTP помилка при запиті до RAWG API для гри '{gameName}': {ex.Message}");
            return null;
        }
        catch (JsonException ex)
        {
            _logger.LogError($"❌ Помилка парсингу JSON від RAWG API для гри '{gameName}': {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Непередбачена помилка при пошуку обкладинки для гри '{gameName}': {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// DTO для відповіді RAWG API
    /// </summary>
    private class RawgSearchResponse
    {
        [JsonPropertyName("results")]
        public List<RawgGame>? Results { get; set; }
    }

    /// <summary>
    /// DTO для гри з RAWG API
    /// </summary>
    private class RawgGame
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("background_image")]
        public string? BackgroundImage { get; set; }
    }
}
