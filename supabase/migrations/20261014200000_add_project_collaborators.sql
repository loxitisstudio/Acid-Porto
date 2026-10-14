ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS collaborators jsonb NOT NULL DEFAULT '[]'::jsonb;
