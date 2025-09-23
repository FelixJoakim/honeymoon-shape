-- Temporarily disable RLS to test workout saving
-- This will allow all operations on hit_workouts table

ALTER TABLE public.hit_workouts DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'hit_workouts';
