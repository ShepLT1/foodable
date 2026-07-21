-- Local dev seed data. Runs automatically on `supabase db reset`.
-- Shared test login: user@foodable.com / password

-- 1. Test auth user
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'user@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');

-- 2. Profile
update public.profiles
set display_name = 'Foodable'
where id = '11111111-1111-1111-1111-111111111111';

-- 3. Expanded Recipes (6 Varied Recipes)
insert into public.recipes (id, user_id, title, description, ingredients_json, steps_json, nutrition_json, cuisine_type, meal_type, is_public)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
    'Veggie Stir Fry', 'Quick weeknight stir fry.',
    '[{"name":"broccoli","quantity":1,"unit":"head"},{"name":"soy sauce","quantity":2,"unit":"tbsp"},{"name":"tofu","quantity":200,"unit":"g"}]',
    '["Chop veggies","Stir fry 8 min","Add sauce"]',
    '{"calories":420,"protein_g":18,"carbs_g":45,"fat_g":14}', 'asian', 'dinner', true),

  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
    'Chicken & Chickpea Curry', 'A hearty, spiced curry with tender chicken and chickpeas simmered in coconut milk.',
    '[{"name":"chicken thighs","quantity":1.5,"unit":"lb"},{"name":"chickpeas","quantity":1,"unit":"can"},{"name":"coconut milk","quantity":1,"unit":"can"}]',
    '["Dice chicken","Simmer curry ingredients for 25 min","Serve with rice"]',
    '{"calories":650,"protein_g":42,"carbs_g":55,"fat_g":28}', 'indian', 'dinner', true),

  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
    'Baked Salmon & Asparagus', 'Oven-roasted lemon garlic salmon with fresh asparagus spears.',
    '[{"name":"salmon fillet","quantity":2,"unit":"pieces"},{"name":"asparagus","quantity":1,"unit":"bunch"},{"name":"lemon","quantity":1,"unit":"whole"}]',
    '["Season salmon and asparagus","Bake at 400F for 15 minutes"]',
    '{"calories":510,"protein_g":38,"carbs_g":12,"fat_g":32}', 'american', 'dinner', true),

  ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
    'Turkey Tacos', 'Flavorful lean ground turkey tacos served with fresh salsa.',
    '[{"name":"ground turkey","quantity":1,"unit":"lb"},{"name":"taco shells","quantity":6,"unit":"whole"},{"name":"salsa","quantity":0.5,"unit":"cup"}]',
    '["Brown turkey in pan","Add seasoning","Assemble in taco shells"]',
    '{"calories":480,"protein_g":34,"carbs_g":38,"fat_g":18}', 'mexican', 'dinner', true),

  ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
    'Mediterranean Quinoa Bowl', 'Healthy bowl packed with quinoa, cucumbers, olives, and feta.',
    '[{"name":"quinoa","quantity":1,"unit":"cup"},{"name":"cucumber","quantity":1,"unit":"whole"},{"name":"feta cheese","quantity":50,"unit":"g"}]',
    '["Cook quinoa","Chop veggies","Toss with olive oil and feta"]',
    '{"calories":390,"protein_g":14,"carbs_g":52,"fat_g":16}', 'mediterranean', 'lunch', true),

  ('aaaaaaaa-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111',
    'Classic Avocado Toast & Eggs', 'Whole grain toast with mashed avocado and two poached eggs.',
    '[{"name":"whole grain bread","quantity":2,"unit":"slices"},{"name":"avocado","quantity":1,"unit":"whole"},{"name":"eggs","quantity":2,"unit":"whole"}]',
    '["Toast bread","Poach eggs","Mash avocado and assemble"]',
    '{"calories":430,"protein_g":19,"carbs_g":30,"fat_g":24}', 'american', 'breakfast', true);

-- 4. Initial Grocery List
insert into public.grocery_lists (id, user_id, title)
values ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Weekly Shop');

insert into public.grocery_list_items (list_id, name, quantity, unit, checked)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'broccoli', 1, 'head', false),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'soy sauce', 2, 'tbsp', true);

-- 5. Completely Unique 9-Day Meal Plan (No repeating recipes!)
INSERT INTO public.meal_plans (user_id, recipe_id, custom_name, date, slot)
VALUES
  -- 4 Days Ago
  ('11111111-1111-1111-1111-111111111111', null, 'Smoothie Bowl', CURRENT_DATE - INTERVAL '4 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000005', null, CURRENT_DATE - INTERVAL '4 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000003', null, CURRENT_DATE - INTERVAL '4 days', 'dinner'),

  -- 3 Days Ago
  ('11111111-1111-1111-1111-111111111111', null, 'Oatmeal & Berries', CURRENT_DATE - INTERVAL '3 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', null, CURRENT_DATE - INTERVAL '3 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000004', null, CURRENT_DATE - INTERVAL '3 days', 'dinner'),

  -- 2 Days Ago
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000006', null, CURRENT_DATE - INTERVAL '2 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', null, 'Turkey & Swiss Wrap', CURRENT_DATE - INTERVAL '2 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', null, CURRENT_DATE - INTERVAL '2 days', 'dinner'),

  -- 1 Day Ago
  ('11111111-1111-1111-1111-111111111111', null, 'Protein Pancakes', CURRENT_DATE - INTERVAL '1 day', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', null, 'Grilled Chicken Caesar Salad', CURRENT_DATE - INTERVAL '1 day', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000003', null, CURRENT_DATE - INTERVAL '1 day', 'dinner'),

  -- TODAY
  ('11111111-1111-1111-1111-111111111111', null, 'Greek Yogurt & Granola Parfait', CURRENT_DATE, 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', null, CURRENT_DATE, 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', null, CURRENT_DATE, 'dinner'),
  ('11111111-1111-1111-1111-111111111111', null, 'Protein Shake & Almonds', CURRENT_DATE, 'snack'),

  -- 1 Day From Now
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000006', null, CURRENT_DATE + INTERVAL '1 day', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000005', null, CURRENT_DATE + INTERVAL '1 day', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000004', null, CURRENT_DATE + INTERVAL '1 day', 'dinner'),

  -- 2 Days From Now
  ('11111111-1111-1111-1111-111111111111', null, 'Loaded Breakfast Burrito', CURRENT_DATE + INTERVAL '2 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', null, 'Meal Prepped Chicken & Rice', CURRENT_DATE + INTERVAL '2 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000003', null, CURRENT_DATE + INTERVAL '2 days', 'dinner'),

  -- 3 Days From Now
  ('11111111-1111-1111-1111-111111111111', null, 'Overnight Chia Oats', CURRENT_DATE + INTERVAL '3 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', null, CURRENT_DATE + INTERVAL '3 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', null, CURRENT_DATE + INTERVAL '3 days', 'dinner'),

  -- 4 Days From Now
  ('11111111-1111-1111-1111-111111111111', null, 'Mango Protein Smoothie', CURRENT_DATE + INTERVAL '4 days', 'breakfast'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000005', null, CURRENT_DATE + INTERVAL '4 days', 'lunch'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000004', null, CURRENT_DATE + INTERVAL '4 days', 'dinner');