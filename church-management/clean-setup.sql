-- ========================================
-- CLEAN SETUP - Run this ONLY
-- ========================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.auth_users CASCADE;

-- Create custom auth table (username + password only)
CREATE TABLE public.auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('manager', 'teacher')),
  church_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy - anyone can read
CREATE POLICY "allow_read" ON public.auth_users
  FOR SELECT USING (true);

-- Managers can insert new users
CREATE POLICY "allow_insert" ON public.auth_users
  FOR INSERT WITH CHECK (true);

-- Create admin account
INSERT INTO public.auth_users (username, password_hash, full_name, role, church_name)
VALUES ('admin', 'admin', 'Admin Manager', 'manager', 'My Church');
