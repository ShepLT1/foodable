# Supabase (local dev)

Foodable uses Supabase for the Postgres database and authentication.

These instructions will allow you to run the full supabase stack locally via Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- Supabase CLI:
  ```bash
  brew install supabase/tap/supabase
  ```

## Start the local stack

From the project root, run:

```bash
supabase start
```

This should boot up postgres, supabase auth, and supabase studio (a db management GUI) locally in Docker, and will also print your local URLs and keys.

Be sure to copy the necessary values to your frontend + backend `.env`!

These should stay fairly static:

- **API URL:** http://localhost:54321 - supabase base URL used in both envs
- **Studio (UI):** http://localhost:54323 - provides a fully functional, local supabase GUI for managing your local database

## Stop the local supabase instance

Stop the instance with:

```bash
supabase stop`
```

## Migrations

Schema changes are configured via migrations in `supabase/migrations/`.

If you'd like to make a change to a table, do the following:

```bash
supabase migration new <name>   # create a new migration file, then edit the SQL as needed
supabase db reset               # re-apply all migrations to the local DB
```

Migrations are applied to the remote project via `supabase db push` (requires the project to be linked: `supabase link --project-ref <ref>`).

## Seed data

`supabase/seed.sql` populates the local database with a test user and sample data. It runs automatically on `supabase db reset` and on a fresh `supabase start`.

- **Local login:** `user@foodable.com` / `password`
- `supabase db reset` will wipe all local data and re-apply the migrations +
  seed, so it's the command to reach for after changing a migration or the seed.
- **Local only** — the seed never runs in production.
