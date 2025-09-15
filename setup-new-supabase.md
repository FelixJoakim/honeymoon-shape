# Setting Up a New Supabase Project

Since your current Supabase project is paused, here's how to create a new one:

## Step 1: Create New Supabase Project

1. **Visit Supabase Dashboard**: Go to https://supabase.com/dashboard
2. **Sign in** with your account
3. **Click "New Project"**
4. **Fill in project details**:
   - Organization: Select or create
   - Name: "Honeymoon Shape" (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to you
5. **Click "Create new project"**
6. **Wait for project setup** (usually takes 2-3 minutes)

## Step 2: Get Project Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your project dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://abc123xyz.supabase.co`)
   - **anon public key** (the `anon` key under "Project API keys")

## Step 3: Update Your Local Configuration

Run this command in your project folder:

```bash
node update-supabase-config.js <PROJECT_URL> <ANON_KEY>
```

**Example:**
```bash
node update-supabase-config.js https://abc123xyz.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## Alternative: Use Local Supabase Only

If you prefer to work entirely locally:

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Start Docker Desktop**
3. **Start local Supabase**:
   ```bash
   npm run supabase:start
   ```
4. **Use local development mode**:
   ```bash
   npm run dev:local
   ```

## Troubleshooting

- **Project creation fails**: Try a different project name
- **Can't find credentials**: Look in Settings → API in your Supabase dashboard
- **Connection errors**: Make sure the URL and key are copied correctly
- **Still showing old project**: Clear browser cache and restart dev server

## What the Script Does

The `update-supabase-config.js` script automatically:
- ✅ Updates `src/utils/supabase/info.tsx` with new credentials
- ✅ Creates/updates `.env` file with environment variables
- ✅ Preserves local development configuration options

Your app will automatically switch to the new Supabase project once updated!
