using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TicketSystem.Auth;
using TicketSystem.Endpoints;
using TicketSystem.Middleware;
using TicketSystem.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var dataPath = Path.Combine(builder.Environment.ContentRootPath, "Data");
builder.Services.AddSingleton(new TicketRepository(dataPath));
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAiSummaryService, AiSummaryService>();
builder.Services.AddScoped<TicketService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddSingleton<JwtTokenGenerator>();

var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "your-super-secret-key-change-in-production-at-least-32-chars!";
var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "TicketSystem",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "TicketSystemUsers"
        };
    });

builder.Services.AddAuthorization();

// ============= BUILD APP =============

var app = builder.Build();


app.UseExceptionMiddleware();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// ============= ENDPOINT MAPPINGS =============

app.MapPublicTicketEndpoints();
app.MapAuthEndpoints();
app.MapAdminTicketEndpoints();

// ============= RUN =============

app.Run();
