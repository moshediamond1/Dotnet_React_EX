using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace TicketSystem.Auth;

public class JwtTokenGenerator
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationMinutes;

    public JwtTokenGenerator(IConfiguration config)
    {
        _secretKey = config["Jwt:SecretKey"] ?? "your-super-secret-key-change-in-production-at-least-32-chars!";
        _issuer = config["Jwt:Issuer"] ?? "TicketSystem";
        _audience = config["Jwt:Audience"] ?? "TicketSystemUsers";
        _expirationMinutes = int.Parse(config["Jwt:ExpirationMinutes"] ?? "60");
    }

    public string GenerateToken(string username, string role = "Admin")
    {
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, username),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
