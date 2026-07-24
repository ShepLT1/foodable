-- Create user_follows junction table
create table public.user_follows (
  follower_id  uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),

  primary key (follower_id, following_id),
  constraint prevent_self_follow check (follower_id <> following_id)
);

-- Index following_id so querying "Who is following user X?" is instant
create index idx_user_follows_following_id on public.user_follows (following_id);

-- Enable RLS (matches backend-only lockdown pattern across existing tables)
alter table public.user_follows enable row level security;