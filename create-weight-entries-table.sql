-- Create weight_entries table for tracking weight over time
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own weight entries" 
  ON weight_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" 
  ON weight_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries" 
  ON weight_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries" 
  ON weight_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS weight_entries_user_id_date_idx 
  ON weight_entries (user_id, date DESC);

-- Ensure unique weight entry per user per date
CREATE UNIQUE INDEX IF NOT EXISTS weight_entries_user_date_unique 
  ON weight_entries (user_id, date);
