-- ==============================================================================
-- LOCAL DEV SEED DATA
-- Runs automatically on `supabase db reset`.
--
-- Shared Test Password for all accounts: password
--
-- Quick Account Reference:
-- 1. user@foodable.com         (Foodable Admin - Main Test User)
-- 2. chef.mario@foodable.com    (Chef Mario - Italian Cuisine Specialist)
-- 3. sarah.baker@foodable.com   (Sarah Baker - Vegetarian / Baking)
-- 4. alex.green@foodable.com    (Alex Green - Gluten-Free / Meal Prep)
-- 5. ken.chen@foodable.com      (Ken Chen - Asian Cuisine Fanatic)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AUTH USERS
-- ------------------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values
  -- User 1
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'user@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  -- User 2
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'chef.mario@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  -- User 3
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'sarah.baker@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  -- User 4
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'alex.green@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  -- User 5
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'ken.chen@foodable.com', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');

-- ------------------------------------------------------------------------------
-- 2. PROFILES (Rows are auto-created by database trigger; updating profile info)
-- ------------------------------------------------------------------------------
update public.profiles
set display_name = 'Foodable Admin',
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Quick Meals", "High Protein"}'
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles
set display_name = 'Chef Mario',
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Italian", "Pasta"}'
where id = '22222222-2222-2222-2222-222222222222';

update public.profiles
set display_name = 'Sarah Baker',
    dietary_restrictions = '{"Vegetarian"}',
    allergies = '{"Peanuts"}',
    preferences = '{"Baking", "Desserts"}'
where id = '33333333-3333-3333-3333-333333333333';

update public.profiles
set display_name = 'Alex Green',
    dietary_restrictions = '{"Gluten-Free"}',
    allergies = '{"Dairy"}',
    preferences = '{"Salads", "Meal Prep"}'
where id = '44444444-4444-4444-4444-444444444444';

update public.profiles
set display_name = 'Ken Chen',
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Asian", "Spicy"}'
where id = '55555555-5555-5555-5555-555555555555';

-- ------------------------------------------------------------------------------
-- 3. USER FOLLOWS (Social Graph)
-- ------------------------------------------------------------------------------
insert into public.user_follows (follower_id, following_id)
values
  -- Foodable Admin (User 1) follows Chef Mario, Sarah, and Ken
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555'),
  -- Chef Mario follows Foodable Admin and Ken
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555'),
  -- Sarah follows Chef Mario and Alex
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444'),
  -- Alex follows Foodable Admin
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111'),
  -- Ken follows Foodable Admin and Chef Mario
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111'),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222');

-- ------------------------------------------------------------------------------
-- 4. RECIPES
-- ------------------------------------------------------------------------------
insert into public.recipes (id, user_id, title, description, ingredients_json, steps_json, nutrition_json, cuisine_type, meal_type, is_public)
values
  -- User 1 Recipes
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
    'Veggie Stir Fry', 'Quick weeknight stir fry.',
    '[{"name":"broccoli","quantity":1,"unit":"head"},{"name":"soy sauce","quantity":2,"unit":"tbsp"}]',
    '{"servings":2,"tools_needed":["wok","spatula"],"steps":[{"instruction":"Chop veggies","ingredients":["broccoli"]},{"instruction":"Stir fry 8 min","ingredients":["broccoli"]},{"instruction":"Add sauce","ingredients":["soy sauce"]}]}',
    '{"calories":420,"protein_g":18,"carbs_g":45,"fat_g":12,"explanation":"Light and vegetable forward."}', 'asian', 'dinner', true),

  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
    'Chicken & Chickpea Curry', 'A hearty, spiced curry with tender chicken and chickpeas simmered in coconut milk.',
    '[{"name":"chicken thighs","quantity":1.5,"unit":"lb"},{"name":"chickpeas","quantity":1,"unit":"can"},{"name":"coconut milk","quantity":1,"unit":"can"}]',
    '{"servings":4,"tools_needed":["dutch oven"],"steps":[{"instruction":"Brown chicken","ingredients":["chicken thighs"]},{"instruction":"Simmer with spices and chickpeas","ingredients":["chickpeas","coconut milk"]}]}',
    '{"calories":650,"protein_g":42,"carbs_g":55,"fat_g":28,"explanation":"High-protein, nutritious meal."}', 'indian', 'dinner', true),

  -- User 2 Recipe (Chef Mario)
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
    'Classic Cacio e Pepe', 'Traditional Roman pasta dish with Pecorino Romano and freshly cracked pepper.',
    '[{"name":"spaghetti","quantity":1,"unit":"lb"},{"name":"pecorino romano","quantity":2,"unit":"cups"},{"name":"black pepper","quantity":1,"unit":"tbsp"}]',
    '{"servings":4,"tools_needed":["large pot","skillet"],"steps":[{"instruction":"Boil pasta al dente","ingredients":["spaghetti"]},{"instruction":"Emulsify cheese and pasta water","ingredients":["pecorino romano","black pepper"]}]}',
    '{"calories":580,"protein_g":22,"carbs_g":70,"fat_g":22,"explanation":"Rich and savory comforting pasta."}', 'italian', 'dinner', true),

  -- User 3 Recipe (Sarah Baker)
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
    'Banana Oat Muffins', 'Wholesome gluten-free breakfast muffins sweetened with ripe bananas.',
    '[{"name":"ripe bananas","quantity":3,"unit":"whole"},{"name":"rolled oats","quantity":2,"unit":"cups"},{"name":"maple syrup","quantity":0.25,"unit":"cup"}]',
    '{"servings":12,"tools_needed":["muffin tin","mixing bowl"],"steps":[{"instruction":"Mash bananas and mix with oats","ingredients":["ripe bananas","rolled oats"]},{"instruction":"Bake at 350F for 20 mins","ingredients":[]}]}',
    '{"calories":180,"protein_g":5,"carbs_g":32,"fat_g":4,"explanation":"Great fiber-rich breakfast option."}', 'american', 'breakfast', true);

-- ------------------------------------------------------------------------------
-- 5. GROCERY LISTS & ITEMS
-- ------------------------------------------------------------------------------
insert into public.grocery_lists (id, user_id, title)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Weekly Shop'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Baking Essentials');

insert into public.grocery_list_items (list_id, name, quantity, unit, checked)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'broccoli', 1, 'head', false),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'soy sauce', 2, 'tbsp', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'rolled oats', 2, 'bags', false),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'maple syrup', 1, 'bottle', false);