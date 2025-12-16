# Ticket System

A full-stack ticket management system with AI-powered summaries and email notifications.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and build
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

**Backend:**
- .NET 9.0
- JWT authentication
- Google AI (Gemini) for ticket summaries
- SMTP email notifications via Gmail

## Prerequisites

- Node.js (v16 or higher)
- .NET 9.0 SDK
- Gmail account with App Password (for email notifications)
- Google AI API Key (for AI summaries)

## Setup Instructions

### 1. Backend Configuration

Navigate to the Backend directory and configure `appsettings.json`:

```json
{
  "Jwt": {
    "SecretKey": "your-super-secret-key-change-in-production-at-least-32-chars!",
    "Issuer": "TicketSystem",
    "Audience": "TicketSystemUsers",
    "ExpirationMinutes": 60
  },
  "GoogleAI": {
    "ApiKey": "YOUR_GOOGLE_AI_API_KEY"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-gmail-app-password",
    "SenderName": "Ticket System Support"
  }
}
```

#### Required Configuration:

**Gmail Setup (for email notifications):**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
4. In `appsettings.json`:
   - Set `SenderEmail` to your Gmail address
   - Set `SenderPassword` to the 16-character App Password (no spaces)

**Google AI Setup (for AI summaries):**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the API key
4. In `appsettings.json`:
   - Set `GoogleAI.ApiKey` to your API key

**JWT Secret Key:**
- Change the `Jwt.SecretKey` to a secure random string (at least 32 characters)
- Keep this secret and never commit it to version control in production

### 2. Running the Backend

```bash
cd Backend
dotnet restore
dotnet run
```

The backend will start on `http://localhost:5000` (or the port configured in your environment).

**To build the backend:**
```bash
cd Backend
dotnet build
```

### 3. Running the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

**To build the frontend:**
```bash
cd Frontend
npm run build
```

The built files will be in the `Frontend/dist` directory.

## How to Log In

The system has a hardcoded admin account for demonstration purposes:

**Admin Credentials:**
- Username: `admin`
- Password: `password123`

To log in:
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173` in your browser
3. Click on the login/admin section
4. Enter the credentials above

## API Endpoints

**Public Endpoints:**
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/{id}` - Get ticket status

**Admin Endpoints (require JWT token):**
- `GET /api/admin/tickets` - List all tickets
- `GET /api/admin/tickets/{id}` - Get ticket details
- `PUT /api/admin/tickets/{id}` - Update ticket
- `DELETE /api/admin/tickets/{id}` - Delete ticket

**Authentication:**
- `POST /api/auth/login` - Admin login (returns JWT token)

## Features

- Create and track support tickets
- AI-powered ticket summaries using Google Gemini
- Email notifications when tickets are created
- Admin dashboard for ticket management
- JWT-based authentication for admin access
- Responsive UI with Tailwind CSS

## Development Notes

- The frontend uses Vite's hot module replacement for fast development
- The backend uses in-memory/file-based storage (tickets are saved in `Backend/Data`)
- CORS is configured to allow requests from `http://localhost:5173` and `http://localhost:3000`

## Troubleshooting

**Email not sending:**
- Verify your Gmail App Password is correct (no spaces)
- Ensure 2FA is enabled on your Google account
- Check that `SmtpPort` is set to 587
- Make sure "Less secure app access" is NOT needed (use App Password instead)

**AI summaries not working:**
- Verify your Google AI API key is valid
- Check the API key has not exceeded its quota
- Ensure you're using the correct API endpoint

**Backend won't start:**
- Verify .NET 9.0 SDK is installed: `dotnet --version`
- Check for port conflicts on port 5000/5001
- Review the console output for specific error messages

**Frontend won't start:**
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for port conflicts on port 5173

## Security Notes

For production deployment:
- Change the JWT secret key to a strong, random value
- Store sensitive configuration in environment variables or a secure vault
- Update CORS policy to allow only your production domain
- Implement proper user management (currently using hardcoded admin credentials)
- Use HTTPS for all connections
- Regularly rotate API keys and passwords
