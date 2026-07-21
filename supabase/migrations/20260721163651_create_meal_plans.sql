-- 1. Create enum type for meal slots
CREATE TYPE meal_slot AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- 2. Create the meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  custom_name VARCHAR(150),
  date DATE NOT NULL,
  slot meal_slot NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- 4. Add RLS Policies so users can only view and manage their own meal plans
CREATE POLICY "Users can manage their own meal plans"
  ON public.meal_plans
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Add index for fast date querying on the dashboard
CREATE INDEX idx_meal_plans_user_date ON public.meal_plans (user_id, date);