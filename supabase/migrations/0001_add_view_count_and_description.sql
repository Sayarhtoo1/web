-- Migration: Add view_count to posts and description to categories
-- Created: 2026-01-07

-- Add view_count column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add description column to categories table  
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index for better query performance on view_count
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);

-- Comment for documentation
COMMENT ON COLUMN posts.view_count IS 'Number of times this post has been viewed';
COMMENT ON COLUMN categories.description IS 'Optional description for the category';
