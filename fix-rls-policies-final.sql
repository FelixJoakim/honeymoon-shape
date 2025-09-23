-- Final fix for hit_workouts RLS policies
-- This will completely reset and recreate the policies

-- First, disable RLS temporarily to clear any issues
ALTER TABLE public.hit_workouts DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (if any exist)
DROP POLICY IF EXISTS "Users can insert hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can view hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can insert own hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can view all hit workouts" ON public.hit_workouts;

-- Re-enable RLS
ALTER TABLE public.hit_workouts ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Allow all authenticated users to insert" 
  ON public.hit_workouts FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to select" 
  ON public.hit_workouts FOR SELECT 
  TO authenticated;

-- Test the policies by checking if they exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'hit_workouts';
