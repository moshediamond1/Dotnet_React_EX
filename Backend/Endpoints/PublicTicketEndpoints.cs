namespace TicketSystem.Endpoints;

using TicketSystem.DTOs;
using TicketSystem.Services;

public static class PublicTicketEndpoints
{
    public static void MapPublicTicketEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tickets")
            .WithTags("Tickets");

        group.MapPost("/", CreateTicket)
            .WithName("CreateTicket")
            .WithOpenApi()
            .WithSummary("Create a new ticket")
            .WithDescription("Creates a new support ticket. Public endpoint - no authentication required.");

        group.MapGet("/", GetAllTickets)
            .WithName("GetAllTickets")
            .WithOpenApi()
            .WithSummary("Get all tickets")
            .WithDescription("Retrieves all tickets with optional filtering by status and search term.");

        group.MapGet("/{id}", GetTicketById)
            .WithName("GetTicketById")
            .WithOpenApi()
            .WithSummary("Get ticket by ID")
            .WithDescription("Retrieves a specific ticket by its ID.");
    }

    private static async Task<IResult> CreateTicket(
        CreateTicketDto dto,
        TicketService service)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Description))
            return Results.BadRequest(new { error = "Title and Description are required" });

        var ticket = await service.CreateTicketAsync(dto);

        return Results.Created($"/api/tickets/{ticket.Id}", ticket);
    }

    private static IResult GetAllTickets(
        TicketService service,
        string? status,
        string? search)
    {
        var tickets = service.GetAllTickets();

        if (!string.IsNullOrEmpty(status))
            tickets = tickets.Where(t => t.Status == status).ToList();

        if (!string.IsNullOrEmpty(search))
            tickets = tickets.Where(t =>
                t.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                t.Description.Contains(search, StringComparison.OrdinalIgnoreCase)
            ).ToList();

        return Results.Ok(tickets);
    }

    private static IResult GetTicketById(
        string id,
        TicketService service)
    {
        var ticket = service.GetTicketById(id);

        if (ticket == null)
            return Results.NotFound(new { error = "Ticket not found" });

        return Results.Ok(ticket);
    }
}
