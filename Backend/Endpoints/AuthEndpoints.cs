namespace TicketSystem.Endpoints;

using TicketSystem.DTOs;
using TicketSystem.Services;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth")
            .WithTags("Authentication");

        group.MapPost("/login", Login)
            .WithName("Login")
            .WithOpenApi()
            .WithSummary("Admin login")
            .WithDescription("Authenticates admin user and returns JWT token. Use this token in Authorization header for admin endpoints.");
    }

    private static IResult Login(
        LoginDto dto,
        AuthService authService)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return Results.BadRequest(new { error = "Username and password are required" });

        var token = authService.Login(dto.Username, dto.Password);

        if (token == null)
           return Results.Unauthorized();

        return Results.Ok(new LoginResponseDto { Token = token });
    }
}
