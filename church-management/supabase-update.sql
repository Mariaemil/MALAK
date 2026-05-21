-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS church_name text;

-- Create unique constraint on username
ALTER TABLE public.profiles
ADD CONSTRAINT unique_username UNIQUE(username);
