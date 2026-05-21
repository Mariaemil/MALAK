-- ========================================
-- COMPLETE SETUP - Username + Password Only
-- ========================================

-- Drop old tables
DROP TABLE IF EXISTS public.auth_users CASCADE;

-- Create auth table
CREATE TABLE public.auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('manager', 'teacher')),
  church_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "allow_read_all" ON public.auth_users FOR SELECT USING (true);
CREATE POLICY "allow_insert_all" ON public.auth_users FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_all" ON public.auth_users FOR UPDATE USING (true);
CREATE POLICY "allow_delete_all" ON public.auth_users FOR DELETE USING (true);

-- Insert admin account
INSERT INTO public.auth_users (username, password_hash, full_name, role, church_name)
VALUES ('admin', 'admin', 'Admin Manager', 'manager', 'My Church')
ON CONFLICT (username) DO NOTHING;
