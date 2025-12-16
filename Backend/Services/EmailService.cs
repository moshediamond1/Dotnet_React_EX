using System.Net;
using System.Net.Mail;

namespace TicketSystem.Services;

public interface IEmailService
{
    Task SendTicketCreatedEmailAsync(string customerEmail, string ticketId, string title);
    Task SendStatusChangedEmailAsync(string customerEmail, string ticketId, string newStatus);
    Task SendResolutionEmailAsync(string customerEmail, string ticketId, string resolution);
}

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _senderEmail;
    private readonly string _senderPassword;
    private readonly string _senderName;

    public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
        _smtpHost = configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
        _smtpPort = int.Parse(configuration["Email:SmtpPort"] ?? "587");
        _senderEmail = configuration["Email:SenderEmail"] ?? "";
        _senderPassword = configuration["Email:SenderPassword"] ?? "";
        _senderName = configuration["Email:SenderName"] ?? "Ticket System";
    }

    public async Task SendTicketCreatedEmailAsync(string customerEmail, string ticketId, string title)
    {
        var subject = $"Ticket Created: {title}";
        var body = $@"
            <h2>Your ticket has been created</h2>
            <p><strong>Ticket ID:</strong> {ticketId}</p>
            <p><strong>Title:</strong> {title}</p>
            <p>We will review your ticket and get back to you soon.</p>
            <p>Thank you for contacting our support team.</p>";

        await SendEmailAsync(customerEmail, subject, body);
        _logger.LogInformation("📧 Email sent: Ticket created. To: {Email}, TicketId: {TicketId}", customerEmail, ticketId);
    }

    public async Task SendStatusChangedEmailAsync(string customerEmail, string ticketId, string newStatus)
    {
        var subject = $"Ticket Status Updated: {ticketId}";
        var body = $@"
            <h2>Your ticket status has been updated</h2>
            <p><strong>Ticket ID:</strong> {ticketId}</p>
            <p><strong>New Status:</strong> {newStatus}</p>
            <p>You can view your ticket details anytime.</p>";

        await SendEmailAsync(customerEmail, subject, body);
        _logger.LogInformation("📧 Email sent: Status changed. To: {Email}, TicketId: {TicketId}, Status: {Status}",
            customerEmail, ticketId, newStatus);
    }

    public async Task SendResolutionEmailAsync(string customerEmail, string ticketId, string resolution)
    {
        var subject = $"Ticket Resolved: {ticketId}";
        var body = $@"
            <h2>Your ticket has been resolved</h2>
            <p><strong>Ticket ID:</strong> {ticketId}</p>
            <p><strong>Resolution:</strong></p>
            <p>{resolution}</p>
            <p>If you have any further questions, please don't hesitate to create a new ticket.</p>";

        await SendEmailAsync(customerEmail, subject, body);
        _logger.LogInformation("📧 Email sent: Resolution. To: {Email}, TicketId: {TicketId}", customerEmail, ticketId);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        if (string.IsNullOrEmpty(_senderEmail) || string.IsNullOrEmpty(_senderPassword))
        {
            _logger.LogWarning("⚠️ Email configuration missing. Email not sent to: {Email}", toEmail);
            return;
        }

        try
        {
            using var smtpClient = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_senderEmail, _senderPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_senderEmail, _senderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to send email to: {Email}", toEmail);
        }
    }
}
