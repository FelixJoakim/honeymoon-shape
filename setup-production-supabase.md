# Setup Production Supabase for Mobile Access

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Choose your organization
4. Name: `honeymoon-fit-production`
5. Database Password: Choose a strong password
6. Region: Choose closest to your users
7. Click "Create new project"

## Step 2: Get Your Credentials

After the project is created:

1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://abc123xyz.supabase.co`)
   - **Project API Key** (anon, public key)

## Step 3: Set Up Database Schema

Run this SQL in your Supabase project's SQL Editor:

```sql
-- Enable RLS
alter table if exists public.profiles enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('bride', 'groom', 'admin')) default 'bride',
  wedding_date date,
  current_weight numeric,
  goal_weight numeric,
  height_cm numeric,
  activity_level text,
  fitness_goals text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Step 4: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Open your `honeymoon-shape` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `VITE_SUPABASE_URL`: Your project URL
   - `VITE_SUPABASE_ANON_KEY`: Your project API key

## Step 5: Redeploy

After adding environment variables, trigger a redeploy:
- Go to **Deployments** tab
- Click the three dots on latest deployment
- Click "Redeploy"

## Step 6: Test

Test login on both laptop and mobile - should work on both!

