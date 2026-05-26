using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LocalizationProject.Models;
using Microsoft.IdentityModel.Tokens;

namespace LocalizationProject.Services;

public interface ITokenService
{
    string CreateToken(AppUser user, IList<string> roles);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly ILogger<TokenService> _logger;
    private readonly SymmetricSecurityKey _key;

    public TokenService(IConfiguration config, ILogger<TokenService> logger)
    {
        _config = config;
        _logger = logger;
        // ключ з appsettings
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    }

    public string CreateToken(AppUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
        var expireDays = int.Parse(_config["Jwt:ExpireDays"]!);
        var expiresAt = DateTime.UtcNow.AddDays(expireDays);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            SigningCredentials = creds,
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        _logger.LogInformation(
            "🔐 JWT Token створено для користувача {Email} (ID: {UserId})\n" +
            "   ├─ Ролі: {Roles}\n" +
            "   ├─ Видано: {IssuedAt}\n" +
            "   ├─ Експайр: {ExpiresAt}\n" +
            "   ├─ Довжина: {TokenLength} символів\n" +
            "   └─ Issuer: {Issuer}",
            user.Email, user.Id, string.Join(", ", roles), 
            DateTime.UtcNow, expiresAt, tokenString.Length, _config["Jwt:Issuer"]
        );

        return tokenString;
    }
}