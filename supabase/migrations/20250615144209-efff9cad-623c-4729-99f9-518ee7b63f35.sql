
-- Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS email text;
