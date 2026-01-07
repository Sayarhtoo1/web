-- Migration: Create function to increment view count
-- Created: 2026-01-07

-- Create a function to safely increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE posts 
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO authenticated;
