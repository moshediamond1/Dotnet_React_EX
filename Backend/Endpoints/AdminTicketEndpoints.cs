namespace TicketSystem.Endpoints;

using TicketSystem.DTOs;
using TicketSystem.Services;

public static class AdminTicketEndpoints
{
    public static void MapAdminTicketEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tickets")
            .WithTags("Tickets - Admin")
            .RequireAuthorization();

        group.MapPut("/{id}", UpdateTicket)
            .WithName("UpdateTicket")
            .WithOpenApi()
            .WithSummary("Update ticket (admin only)")
            .WithDescription("Updates a ticket's status and/or resolution. Requires JWT authentication.");
    }

    private static async Task<IResult> UpdateTicket(
        string id,
        UpdateTicketDto dto,
        TicketService service)
    {
        var updated = await service.UpdateTicketAsync(id, dto);

        if (updated == null)
            return Results.NotFound(new { error = "Ticket not found" });

        return Results.Ok(updated);
    }
}
