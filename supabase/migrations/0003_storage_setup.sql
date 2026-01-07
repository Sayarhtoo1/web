-- Migration: Setup Storage for Blog Images
-- Created: 2026-01-07

-- Create a new private bucket 'blog-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public read access to everyone
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Policy: Give authenticated (admin) full access
CREATE POLICY "Admin Full Access"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'blog-images' )
WITH CHECK ( bucket_id = 'blog-images' );
