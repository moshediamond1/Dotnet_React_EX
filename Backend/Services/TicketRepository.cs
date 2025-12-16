using System.Text.Json;
using TicketSystem.Entities;

namespace TicketSystem.Services;

public class TicketRepository
{
    private readonly string _filePath;
    private readonly object _lock = new();
    private static readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true };

    public TicketRepository(string dataPath)
    {
        _filePath = Path.Combine(dataPath, "tickets.json");
        Directory.CreateDirectory(dataPath);
        
        if (!File.Exists(_filePath))
        {
            File.WriteAllText(_filePath, "[]");
        }
    }

    public List<Ticket> GetAll()
    {
        lock (_lock)
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<Ticket>>(json) ?? [];
        }
    }

    public Ticket? GetById(string id)
    {
        var tickets = GetAll();
        return tickets.FirstOrDefault(t => t.Id == id);
    }

    public void Save(Ticket ticket)
    {
        lock (_lock)
        {
            var tickets = GetAll();
            var existing = tickets.FirstOrDefault(t => t.Id == ticket.Id);
            
            if (existing != null)
            {
                tickets.Remove(existing);
            }
            
            tickets.Add(ticket);
            var json = JsonSerializer.Serialize(tickets, _jsonOptions);
            File.WriteAllText(_filePath, json);
        }
    }

}
