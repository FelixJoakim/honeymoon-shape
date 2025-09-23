-- URGENT: Fix all RLS policies to secure your data
-- This will prevent unauthorized access to your personal data

-- Fix hit_workouts table
ALTER TABLE public.hit_workouts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies and recreate them
DROP POLICY IF EXISTS "Users can insert own hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can view all hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can update own hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Allow all authenticated users to insert" ON public.hit_workouts;
DROP POLICY IF EXISTS "Allow all authenticated users to select" ON public.hit_workouts;

-- Create secure policies for hit_workouts
CREATE POLICY "Users can insert own hit workouts"
  ON public.hit_workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all hit workouts"
  ON public.hit_workouts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own hit workouts"
  ON public.hit_workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix weight_entries table
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Users can view own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can insert own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can update own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can delete own weight entries" ON public.weight_entries;

-- Create secure policies for weight_entries
CREATE POLICY "Users can view own weight entries"
  ON public.weight_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries"
  ON public.weight_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries"
  ON public.weight_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries"
  ON public.weight_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create secure policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify all tables are secured
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE tablename IN ('profiles', 'weight_entries', 'hit_workouts')
ORDER BY tablename;
