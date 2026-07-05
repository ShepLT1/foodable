-- Setup initial schema

-- profiles
create table public.profiles (
  id                   uuid primary key references auth.users on delete cascade,
  display_name         text not null,
  dietary_restrictions text[] not null default '{}',
  allergies            text[] not null default '{}',
  preferences          text[] not null default '{}'
);

-- recipes
create table public.recipes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  title            text not null,
  description      text,
  ingredients_json jsonb not null,
  steps_json       jsonb not null,
  nutrition_json   jsonb,
  cuisine_type     text,
  meal_type        text,
  is_public        boolean not null default false,
  created_at       timestamptz not null default now()
);

-- grocery_lists
create table public.grocery_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  title      text not null,
  created_at timestamptz not null default now()
);

-- grocery_list_items
create table public.grocery_list_items (
  id       uuid primary key default gen_random_uuid(),
  list_id  uuid not null references public.grocery_lists on delete cascade,
  name     text not null,
  quantity numeric not null,
  unit     text,
  checked  boolean not null default false
);

