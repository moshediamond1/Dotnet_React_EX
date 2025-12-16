using TicketSystem.DTOs;
using TicketSystem.Entities;

namespace TicketSystem.Services;

public class TicketService
{
    private readonly TicketRepository _repository;
    private readonly IEmailService _emailService;
    private readonly IAiSummaryService _aiService;
    private readonly ILogger<TicketService> _logger;

    public TicketService(
        TicketRepository repository,
        IEmailService emailService,
        IAiSummaryService aiService,
        ILogger<TicketService> logger)
    {
        _repository = repository;
        _emailService = emailService;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<TicketResponseDto> CreateTicketAsync(CreateTicketDto dto)
    {
        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            CustomerEmail = dto.CustomerEmail,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        ticket.Summary = await _aiService.GenerateSummaryAsync(ticket.Description);

        _repository.Save(ticket);
        await _emailService.SendTicketCreatedEmailAsync(ticket.CustomerEmail, ticket.Id, ticket.Title);

        _logger.LogInformation("✅ Ticket created: {TicketId}", ticket.Id);

        return MapToDto(ticket);
    }

    public List<TicketResponseDto> GetAllTickets()
    {
        var tickets = _repository.GetAll();
        return tickets.Select(MapToDto).ToList();
    }

    public TicketResponseDto? GetTicketById(string id)
    {
        var ticket = _repository.GetById(id);
        return ticket != null ? MapToDto(ticket) : null;
    }

    public async Task<TicketResponseDto?> UpdateTicketAsync(string id, UpdateTicketDto dto)
    {
        var ticket = _repository.GetById(id);
        if (ticket == null)
            return null;

        if (!string.IsNullOrEmpty(dto.Status) && dto.Status != ticket.Status)
        {
            ticket.Status = dto.Status;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _emailService.SendStatusChangedEmailAsync(ticket.CustomerEmail, ticket.Id, dto.Status);
            _logger.LogInformation("📝 Ticket status updated: {TicketId} -> {Status}", id, dto.Status);
        }

        if (!string.IsNullOrEmpty(dto.Resolution))
        {
            ticket.Resolution = dto.Resolution;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _emailService.SendResolutionEmailAsync(ticket.CustomerEmail, ticket.Id, dto.Resolution);
            _logger.LogInformation("✔️ Ticket resolved: {TicketId}", id);
        }

        _repository.Save(ticket);
        return MapToDto(ticket);
    }

    private static TicketResponseDto MapToDto(Ticket ticket)
    {
        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            CustomerEmail = ticket.CustomerEmail,
            Resolution = ticket.Resolution,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            Summary = ticket.Summary
        };
    }
}
