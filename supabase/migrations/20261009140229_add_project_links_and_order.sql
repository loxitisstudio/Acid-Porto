ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS sort_order integer;

WITH unranked_projects AS (
  SELECT
    id,
    (
      COALESCE((SELECT MAX(sort_order) FROM public.projects), -1)
      + ROW_NUMBER() OVER (ORDER BY id DESC)
    )::integer AS next_sort_order
  FROM public.projects
  WHERE sort_order IS NULL
)
UPDATE public.projects AS project
SET sort_order = unranked_projects.next_sort_order
FROM unranked_projects
WHERE project.id = unranked_projects.id;
