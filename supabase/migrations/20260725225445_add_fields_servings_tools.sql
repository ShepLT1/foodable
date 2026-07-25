-- Add recipe metadata columns
alter table public.recipes
add column servings integer,
add column tools_needed text[];

-- Enforce servings requirements
alter table public.recipes
alter column servings set not null;

alter table public.recipes
add constraint recipes_servings_check
check (servings > 0);