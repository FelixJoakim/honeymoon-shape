-- Create training/workout tables for honeymoon.fit
-- Run this in your Supabase SQL Editor

-- Training logs table (general workouts)
CREATE TABLE public.training_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  key_lifts TEXT[], -- array of key exercises
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- HIT workouts table (specific HIT training)
CREATE TABLE public.hit_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  workout_name TEXT NOT NULL,
  date DATE NOT NULL,
  exercises JSONB NOT NULL, -- store exercise data as JSON
  notes TEXT,
  endorsements UUID[], -- array of user IDs who endorsed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hit_workouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for training_logs
CREATE POLICY "Users can view own training logs" 
  ON public.training_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training logs" 
  ON public.training_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training logs" 
  ON public.training_logs FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for hit_workouts
CREATE POLICY "Users can view all hit workouts" 
  ON public.hit_workouts FOR SELECT 
  TO authenticated;

CREATE POLICY "Users can insert own hit workouts" 
  ON public.hit_workouts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hit workouts" 
  ON public.hit_workouts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX training_logs_user_id_date_idx 
  ON public.training_logs (user_id, date DESC);

CREATE INDEX hit_workouts_user_id_date_idx 
  ON public.hit_workouts (user_id, date DESC);

CREATE INDEX hit_workouts_date_idx 
  ON public.hit_workouts (date DESC);
