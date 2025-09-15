# Local Development Setup

## Current Status
✅ App is running on http://localhost:3000/
✅ Supabase CLI installed
✅ Local Supabase project initialized
✅ Environment configuration ready

## Running the App
The app is currently running and connected to the remote Supabase instance.

## Setting up Local Supabase (Optional)

To run Supabase locally for development:

### 1. Install Docker Desktop
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
# Or using Homebrew:
brew install --cask docker
```

### 2. Start Docker Desktop
Open Docker Desktop application and wait for it to start.

### 3. Start Local Supabase
```bash
supabase start
```

This will:
- Start PostgreSQL database
- Start Supabase Studio (database admin)
- Start Edge Functions runtime
- Start other Supabase services

### 4. Switch to Local Environment
Create a `.env.local` file with:
```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### 5. Restart the Dev Server
```bash
npm run dev
```

## Useful Commands

### Supabase
- `supabase start` - Start local Supabase
- `supabase stop` - Stop local Supabase
- `supabase status` - Check service status
- `supabase db reset` - Reset local database
- `supabase studio` - Open database admin

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Database Management
- Local Supabase Studio: http://localhost:54323
- Remote Supabase Dashboard: https://supabase.com/dashboard/project/lmwrnkoprmugdiqhoagu

## Environment Variables
The app automatically detects environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

If not set, it falls back to the remote configuration in `src/utils/supabase/info.tsx`.
