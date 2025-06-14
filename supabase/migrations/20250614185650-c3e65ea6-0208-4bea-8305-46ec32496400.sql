
-- Add post_type and poll_options columns to scheduled_posts table
ALTER TABLE public.scheduled_posts 
ADD COLUMN post_type TEXT DEFAULT 'text',
ADD COLUMN poll_options TEXT[] DEFAULT NULL;

-- Update existing posts to have 'text' type
UPDATE public.scheduled_posts 
SET post_type = 'text' 
WHERE post_type IS NULL;

-- Make post_type not null after setting default values
ALTER TABLE public.scheduled_posts 
ALTER COLUMN post_type SET NOT NULL;
