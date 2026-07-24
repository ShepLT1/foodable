-- Local dev seed data. Runs automatically on `supabase db reset`.
-- Shared test login:  user@foodable.com  /  password

-- Test auth user (normally created by Supabase Auth; inserted directly for seeding)
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'user@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');

-- Profile (row auto-created by the on_auth_user_created trigger; override the derived display_name)
update public.profiles
set display_name = 'Foodable'
where id = '11111111-1111-1111-1111-111111111111';

-- Recipes
insert into public.recipes (id, user_id, title, description, ingredients_json, steps_json, nutrition_json, cuisine_type, meal_type, is_public)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
    'Veggie Stir Fry', 'Quick weeknight stir fry.',
    '[{"name":"broccoli","quantity":1,"unit":"head"},{"name":"soy sauce","quantity":2,"unit":"tbsp"}]',
    '["Chop veggies","Stir fry 8 min","Add sauce"]',
    '{"calories":420,"protein_g":18}', 'asian', 'dinner', true),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
    'Chicken & Chickpea Curry',
    'A hearty, spiced curry with tender chicken and chickpeas simmered in coconut milk. Serves 4.',
    '[{"name":"chicken thighs","quantity":1.5,"unit":"lb"},{"name":"chickpeas","quantity":1,"unit":"can"},{"name":"coconut milk","quantity":1,"unit":"can"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"curry powder","quantity":2,"unit":"tbsp"},{"name":"diced tomatoes","quantity":1,"unit":"can"},{"name":"basmati rice","quantity":1.5,"unit":"cup"},{"name":"cilantro","quantity":0.25,"unit":"cup"}]',
    '["Dice the onion and mince the garlic and ginger.","Brown the chicken thighs in a large pot over medium-high heat, then set aside.","Saute onion until soft, then add garlic, ginger, and curry powder; cook 1 minute until fragrant.","Stir in diced tomatoes, coconut milk, and chickpeas.","Return chicken to the pot, cover, and simmer 25 minutes until cooked through.","Meanwhile, cook the basmati rice per package directions.","Serve curry over rice, garnished with fresh cilantro."]',
    '{"calories":650,"protein_g":42,"carbs_g":55,"fat_g":28,"fiber_g":9}', 'indian', 'dinner', true);

-- Grocery list + items
insert into public.grocery_lists (id, user_id, title)
values ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Weekly Shop');

insert into public.grocery_list_items (list_id, name, quantity, unit, checked)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'broccoli', 1, 'head', false),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'soy sauce', 2, 'tbsp', true);

-- Meal plan + meals
insert into public.meal_plans (
    id,
    user_id,
    title
)
values (
    'cccccccc-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Weekly Meal Plan'
);

insert into public.meal_plan_meals (
    meal_plan_id,
    recipe_id,
    servings,
    scheduled_date,
    meal_type
)
values
(
    'cccccccc-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    2,
    current_date,
    'dinner'
),
(
    'cccccccc-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000002',
    4,
    null,
    null
);