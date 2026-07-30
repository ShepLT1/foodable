-- Create recipe_favorites junction table
create table public.recipe_favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  recipe_id  uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),

  primary key (user_id, recipe_id)
);

-- Index recipe_id so counting "how many favorited recipe X?" is instant
create index idx_recipe_favorites_recipe_id on public.recipe_favorites (recipe_id);

-- Enable RLS (matches backend-only lockdown pattern across existing tables)
alter table public.recipe_favorites enable row level security;
