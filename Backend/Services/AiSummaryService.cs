namespace TicketSystem.Services;

using GenerativeAI;

public interface IAiSummaryService
{
    Task<string?> GenerateSummaryAsync(string description);
}

public class AiSummaryService : IAiSummaryService
{
    private readonly ILogger<AiSummaryService> _logger;
    private readonly GenerativeModel _model;

    public AiSummaryService(ILogger<AiSummaryService> logger, IConfiguration configuration)
    {
        _logger = logger;
        var apiKey = configuration["GoogleAI:ApiKey"] ?? throw new InvalidOperationException("AI API key is missing");
        _model = new GenerativeModel(apiKey: apiKey, model: "models/gemini-2.5-flash");
    }

    public async Task<string?> GenerateSummaryAsync(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            return null;

        try
        {
            var response = await _model.GenerateContentAsync(
                $"Summarize in 1 short sentences:\n\n{description}"
            );

            var summary = response.Text?.Trim();
            _logger.LogInformation("✅ Summary generated");
            return summary;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Summary generation failed");
            return null;
        }
    }
}
