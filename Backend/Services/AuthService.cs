using TicketSystem.Auth;

namespace TicketSystem.Services;

public class AuthService
{
    private readonly JwtTokenGenerator _tokenGenerator;
    private readonly ILogger<AuthService> _logger;

    private readonly string _adminUsername = "admin";
    private readonly string _adminPassword = "password123";

    public AuthService(JwtTokenGenerator tokenGenerator, ILogger<AuthService> logger)
    {
        _tokenGenerator = tokenGenerator;
        _logger = logger;
    }

    public string? Login(string username, string password)
    {
        if (username == _adminUsername && password == _adminPassword)
        {
            var token = _tokenGenerator.GenerateToken(username, "Admin");
            _logger.LogInformation("✅ Admin login successful: {Username}", username);
            return token;
        }

        _logger.LogWarning("❌ Failed login attempt: {Username}", username);
        return null;
    }
}
