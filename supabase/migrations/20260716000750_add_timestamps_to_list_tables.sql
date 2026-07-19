-- grocery_lists
alter table public.grocery_lists
add column updated_at timestamptz not null default now();