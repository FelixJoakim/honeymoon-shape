-- Simple weight_entries table creation
-- Copy and paste this EXACTLY into Supabase SQL Editor

CREATE TABLE public.weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own weight entries" 
  ON public.weight_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" 
  ON public.weight_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX weight_entries_user_id_date_idx 
  ON public.weight_entries (user_id, date DESC);
