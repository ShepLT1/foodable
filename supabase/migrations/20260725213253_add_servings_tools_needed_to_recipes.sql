-- Pull servings and tools_needed out of steps_json into their own columns.
alter table public.recipes
  add column servings integer not null default 1,
  add column tools_needed text[] not null default '{}';

-- Drop the defaults now that they've backfilled existing rows —
-- new inserts should always supply real values explicitly.
alter table public.recipes
  alter column servings drop default,
  alter column tools_needed drop default;

-- Enforce NOT NULL on nutrition_json (was nullable in init_schema,
-- but the application schema has always required it).
update public.recipes
  set nutrition_json = '{}'::jsonb
  where nutrition_json is null;

alter table public.recipes
  alter column nutrition_json set not null;