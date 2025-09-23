-- Fix RLS policy for hit_workouts table
-- The current policy might be too restrictive

-- First, let's drop the existing policies and recreate them
DROP POLICY IF EXISTS "Users can insert own hit workouts" ON public.hit_workouts;
DROP POLICY IF EXISTS "Users can view all hit workouts" ON public.hit_workouts;

-- Create a more permissive INSERT policy
CREATE POLICY "Users can insert hit workouts" 
  ON public.hit_workouts FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create a more permissive SELECT policy  
CREATE POLICY "Users can view hit workouts" 
  ON public.hit_workouts FOR SELECT 
  TO authenticated;

-- Alternative: If you want to restrict to own workouts only, use this instead:
-- CREATE POLICY "Users can insert own hit workouts" 
--   ON public.hit_workouts FOR INSERT 
--   WITH CHECK (auth.uid()::text = user_id::text);
