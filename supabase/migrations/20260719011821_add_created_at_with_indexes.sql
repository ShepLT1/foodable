--grocery_list_items
alter table public.grocery_list_items
add column created_at timestamptz not null default timezone('utc', now());

create index idx_grocery_list_items_created_at
on public.grocery_list_items (created_at);