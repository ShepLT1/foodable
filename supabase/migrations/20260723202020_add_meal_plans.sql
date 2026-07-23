-- meal_plans
create table public.meal_plans (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    title text not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

-- meal_plan_meals
-- scheduled_date is nullable so a meal plan can act as a simple
-- collection of recipes before the user assigns meals to specific days.
create table public.meal_plan_meals (
    id uuid primary key default gen_random_uuid(),

    meal_plan_id uuid not null
        references public.meal_plans(id)
        on delete cascade,

    recipe_id uuid not null
        references public.recipes(id)
        on delete cascade,

    servings integer not null check (servings > 0),

    scheduled_date date,

    meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'dessert', 'snack') or meal_type is null),

    created_at timestamptz not null default now()
);

-- indexes
create index idx_meal_plans_user_id
on public.meal_plans(user_id);

create index idx_meal_plan_meals_meal_plan_id
on public.meal_plan_meals(meal_plan_id);

create index idx_meal_plan_meals_recipe_id
on public.meal_plan_meals(recipe_id);