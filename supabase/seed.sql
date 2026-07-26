-- LOCAL DEV SEED DATA
-- Runs automatically on `supabase db reset`.
--
-- Shared Test Password for all accounts: password
--
-- Quick Account Reference:
-- USERNAME                      DESCRIPTION
-- 1. user@foodable.com          (Foodable Admin - Main Test User)
-- 2. chef.mario@foodable.com    (Chef Mario - Italian Cuisine Specialist)
-- 3. sarah.baker@foodable.com   (Sarah Baker - Vegetarian / Baking)
-- 4. alex.green@foodable.com    (Alex Green - Gluten-Free / Meal Prep)
-- 5. ken.chen@foodable.com      (Ken Chen - Asian Cuisine Fanatic)

-- AUTH USERS --
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

-- PROFILES -- 
update public.profiles
set display_name = 'Foodable Admin',
    onboarded_at = now(),
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Quick Meals", "High Protein"}'
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles
set display_name = 'Chef Mario',
    onboarded_at = now(),
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Italian", "Pasta"}'
where id = '22222222-2222-2222-2222-222222222222';

update public.profiles
set display_name = 'Sarah Baker',
    onboarded_at = now(),
    dietary_restrictions = '{"Vegetarian"}',
    allergies = '{"Peanuts"}',
    preferences = '{"Baking", "Desserts"}'
where id = '33333333-3333-3333-3333-333333333333';

update public.profiles
set display_name = 'Alex Green',
    onboarded_at = now(),
    dietary_restrictions = '{"Gluten-Free"}',
    allergies = '{"Dairy"}',
    preferences = '{"Salads", "Meal Prep"}'
where id = '44444444-4444-4444-4444-444444444444';

update public.profiles
set display_name = 'Ken Chen',
    onboarded_at = now(),
    dietary_restrictions = '{}',
    allergies = '{}',
    preferences = '{"Asian", "Spicy"}'
where id = '55555555-5555-5555-5555-555555555555';

-- 3. USER FOLLOWS (Social Graph) -- 
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

-- Recipes
insert into public.recipes (
    id,
    user_id,
    title,
    description,
    ingredients_json,
    steps_json,
    nutrition_json,
    tools_needed,
    servings,
    cuisine_type,
    meal_type,
    is_public
)
values
(
    'aaaaaaaa-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Veggie Stir Fry',
    'Quick weeknight stir fry.',
    '[{"name":"broccoli","quantity":1,"unit":"head"},{"name":"soy sauce","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Chop veggies","ingredients":["broccoli"],"estimated_duration_minutes":5},{"instruction":"Stir fry 8 min","ingredients":["broccoli"],"estimated_duration_minutes":8},{"instruction":"Add sauce","ingredients":["soy sauce"],"estimated_duration_minutes":2}]',
    '{"calories":420,"protein_g":18,"carbs_g":32,"fat_g":24,"explanation":"High in vegetables and protein with healthy fats, though the sodium may be elevated from the soy sauce."}',
    ARRAY['Chef''s knife','Cutting board','Large skillet'],
    2,
    'asian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Chicken & Chickpea Curry',
    'A hearty, spiced curry with tender chicken and chickpeas simmered in coconut milk.',
    '[{"name":"chicken thighs","quantity":1.5,"unit":"lb"},{"name":"chickpeas","quantity":1,"unit":"can"},{"name":"coconut milk","quantity":1,"unit":"can"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"curry powder","quantity":2,"unit":"tbsp"},{"name":"diced tomatoes","quantity":1,"unit":"can"},{"name":"basmati rice","quantity":1.5,"unit":"cup"},{"name":"cilantro","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Dice the onion and mince the garlic and ginger.","ingredients":["yellow onion","garlic","ginger"],"estimated_duration_minutes":10},{"instruction":"Brown the chicken thighs in a large pot over medium-high heat, then set aside.","ingredients":["chicken thighs"],"estimated_duration_minutes":8},{"instruction":"Saute onion until soft, then add garlic, ginger, and curry powder; cook 1 minute until fragrant.","ingredients":["yellow onion","garlic","ginger","curry powder"],"estimated_duration_minutes":6},{"instruction":"Stir in diced tomatoes, coconut milk, and chickpeas.","ingredients":["diced tomatoes","coconut milk","chickpeas"],"estimated_duration_minutes":3},{"instruction":"Return chicken to the pot, cover, and simmer until cooked through.","ingredients":["chicken thighs"],"estimated_duration_minutes":25},{"instruction":"Meanwhile, cook the basmati rice per package directions.","ingredients":["basmati rice"],"estimated_duration_minutes":20},{"instruction":"Serve curry over rice, garnished with fresh cilantro.","ingredients":["cilantro"],"estimated_duration_minutes":2}]',
    '{"calories":650,"protein_g":42,"carbs_g":55,"fat_g":28,"explanation":"A balanced, protein-rich meal with complex carbohydrates and healthy fats, though it is relatively calorie-dense due to the coconut milk."}',
    ARRAY['Chef''s knife','Cutting board','Large pot','Wooden spoon'],
    4,
    'indian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'Classic Pancakes',
    'Fluffy homemade pancakes.',
    '[{"name":"all-purpose flour","quantity":2,"unit":"cup"},{"name":"baking powder","quantity":2,"unit":"tsp"},{"name":"salt","quantity":0.5,"unit":"tsp"},{"name":"milk","quantity":1.5,"unit":"cup"},{"name":"egg","quantity":1,"unit":"whole"},{"name":"butter","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Mix dry ingredients.","ingredients":["all-purpose flour","baking powder","salt"],"estimated_duration_minutes":5},{"instruction":"Whisk in wet ingredients.","ingredients":["milk","egg","butter"],"estimated_duration_minutes":3},{"instruction":"Cook on a hot griddle.","ingredients":[],"estimated_duration_minutes":10}]',
    '{"calories":380,"protein_g":11,"carbs_g":50,"fat_g":15,"explanation":"Provides quick energy from carbohydrates, but is lower in protein and fiber unless served with nutritious toppings."}',
    ARRAY['Mixing bowl','Whisk','Griddle'],
    4,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Scrambled Eggs',
    'Simple fluffy scrambled eggs.',
    '[{"name":"eggs","quantity":4,"unit":"whole"},{"name":"butter","quantity":1,"unit":"tbsp"},{"name":"milk","quantity":2,"unit":"tbsp"},{"name":"salt","quantity":0.25,"unit":"tsp"},{"name":"black pepper","quantity":0.25,"unit":"tsp"}]',
    '[{"instruction":"Whisk eggs.","ingredients":["eggs","milk"],"estimated_duration_minutes":3},{"instruction":"Cook in butter.","ingredients":["butter"],"estimated_duration_minutes":5},{"instruction":"Season and serve.","ingredients":["salt","black pepper"],"estimated_duration_minutes":1}]',
    '{"calories":290,"protein_g":20,"carbs_g":3,"fat_g":22,"explanation":"High in protein and healthy fats with very few carbohydrates, making it a filling breakfast option."}',
    ARRAY['Whisk','Mixing bowl','Nonstick skillet'],
    2,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-111111111111',
    'Spaghetti Bolognese',
    'Classic meat sauce over pasta.',
    '[{"name":"ground beef","quantity":1,"unit":"lb"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"diced tomatoes","quantity":1,"unit":"can"},{"name":"tomato paste","quantity":2,"unit":"tbsp"},{"name":"spaghetti","quantity":1,"unit":"lb"},{"name":"parmesan","quantity":0.5,"unit":"cup"}]',
    '[{"instruction":"Brown beef.","ingredients":["ground beef"],"estimated_duration_minutes":8},{"instruction":"Cook onion and garlic.","ingredients":["yellow onion","garlic","olive oil"],"estimated_duration_minutes":8},{"instruction":"Simmer sauce.","ingredients":["diced tomatoes","tomato paste"],"estimated_duration_minutes":30},{"instruction":"Cook pasta.","ingredients":["spaghetti"],"estimated_duration_minutes":10},{"instruction":"Serve.","ingredients":["parmesan"],"estimated_duration_minutes":2}]',
    '{"calories":720,"protein_g":36,"carbs_g":62,"fat_g":34,"explanation":"A hearty meal with plenty of protein and carbohydrates, though it is relatively high in calories and saturated fat."}',
    ARRAY['Large pot','Large skillet','Colander'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-111111111111',
    'Caesar Salad',
    'Fresh Caesar salad.',
    '[{"name":"romaine lettuce","quantity":2,"unit":"heads"},{"name":"parmesan","quantity":0.25,"unit":"cup"},{"name":"croutons","quantity":2,"unit":"cup"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"lemon juice","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":1,"unit":"clove"}]',
    '[{"instruction":"Wash lettuce.","ingredients":["romaine lettuce"],"estimated_duration_minutes":5},{"instruction":"Prepare dressing.","ingredients":["olive oil","lemon juice","garlic"],"estimated_duration_minutes":5},{"instruction":"Toss and serve.","ingredients":["parmesan","croutons"],"estimated_duration_minutes":2}]',
    '{"calories":310,"protein_g":10,"carbs_g":18,"fat_g":22,"explanation":"Provides healthy fats and some protein, but is lower in protein overall and can be high in sodium depending on the dressing."}',
    ARRAY['Salad bowl','Chef''s knife'],
    4,
    'american',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000007',
    '11111111-1111-1111-1111-111111111111',
    'Chicken Fajitas',
    'Easy skillet fajitas.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"bell pepper","quantity":2,"unit":"whole"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"fajita seasoning","quantity":2,"unit":"tbsp"},{"name":"flour tortillas","quantity":8,"unit":"whole"}]',
    '[{"instruction":"Slice vegetables.","ingredients":["bell pepper","yellow onion"],"estimated_duration_minutes":8},{"instruction":"Cook chicken.","ingredients":["chicken breast"],"estimated_duration_minutes":10},{"instruction":"Add vegetables and seasoning.","ingredients":["olive oil","fajita seasoning"],"estimated_duration_minutes":8},{"instruction":"Serve in tortillas.","ingredients":["flour tortillas"],"estimated_duration_minutes":2}]',
    '{"calories":590,"protein_g":41,"carbs_g":34,"fat_g":24,"explanation":"High in lean protein with a good balance of carbohydrates and vegetables, making it a satisfying and nutritious meal."}',
    ARRAY['Chef''s knife','Large skillet'],
    4,
    'mexican',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000008',
    '11111111-1111-1111-1111-111111111111',
    'Greek Yogurt Parfait',
    'Healthy breakfast parfait.',
    '[{"name":"greek yogurt","quantity":2,"unit":"cup"},{"name":"blueberries","quantity":1,"unit":"cup"},{"name":"granola","quantity":1,"unit":"cup"},{"name":"honey","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Layer ingredients in a glass.","ingredients":["greek yogurt","blueberries","granola","honey"],"estimated_duration_minutes":5},{"instruction":"Serve immediately.","ingredients":[],"estimated_duration_minutes":1}]',
    '{"calories":340,"protein_g":22,"carbs_g":38,"fat_g":10,"explanation":"Rich in protein and calcium with natural sweetness from fruit, though granola and honey increase the sugar content."}',
    ARRAY['Serving glass','Spoon'],
    2,
    'greek',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000009',
    '11111111-1111-1111-1111-111111111111',
    'Vegetable Omelet',
    'Protein-packed veggie omelet.',
    '[{"name":"eggs","quantity":3,"unit":"whole"},{"name":"bell pepper","quantity":0.5,"unit":"whole"},{"name":"onion","quantity":0.25,"unit":"whole"},{"name":"spinach","quantity":1,"unit":"cup"},{"name":"cheddar cheese","quantity":0.5,"unit":"cup"},{"name":"butter","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Cook vegetables.","ingredients":["bell pepper","onion","spinach"],"estimated_duration_minutes":6},{"instruction":"Add eggs.","ingredients":["eggs","butter"],"estimated_duration_minutes":4},{"instruction":"Fold with cheese.","ingredients":["cheddar cheese"],"estimated_duration_minutes":2}]',
    '{"calories":410,"protein_g":28,"carbs_g":8,"fat_g":30,"explanation":"A protein-packed meal with nutrient-rich vegetables, though the cheese and butter contribute additional saturated fat."}',
    ARRAY['Nonstick skillet','Spatula'],
    1,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000010',
    '11111111-1111-1111-1111-111111111111',
    'Roasted Vegetables',
    'Simple roasted vegetables.',
    '[{"name":"broccoli","quantity":2,"unit":"heads"},{"name":"carrots","quantity":4,"unit":"whole"},{"name":"olive oil","quantity":3,"unit":"tbsp"},{"name":"salt","quantity":1,"unit":"tsp"},{"name":"black pepper","quantity":0.5,"unit":"tsp"}]',
    '[{"instruction":"Chop vegetables.","ingredients":["broccoli","carrots"],"estimated_duration_minutes":10},{"instruction":"Toss with oil.","ingredients":["olive oil","salt","black pepper"],"estimated_duration_minutes":3},{"instruction":"Roast until tender.","ingredients":[],"estimated_duration_minutes":30}]',
    '{"calories":220,"protein_g":6,"carbs_g":24,"fat_g":12,"explanation":"A nutrient-dense side dish rich in vegetables and healthy fats, though it is relatively low in protein on its own."}',
    ARRAY['Chef''s knife','Baking sheet'],
    4,
    'american',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000011',
    '22222222-2222-2222-2222-222222222222',
    'Classic Cacio e Pepe',
    'Traditional Roman pasta dish with Pecorino Romano and freshly cracked pepper.',
    '[{"name":"spaghetti","quantity":1,"unit":"lb"},{"name":"pecorino romano","quantity":2,"unit":"cups"},{"name":"black pepper","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Boil the spaghetti until al dente.","ingredients":["spaghetti"],"estimated_duration_minutes":10},{"instruction":"Reserve pasta water, then emulsify the Pecorino Romano with the pasta water and black pepper before tossing with the pasta.","ingredients":["pecorino romano","black pepper"],"estimated_duration_minutes":5}]',
    '{"calories":580,"protein_g":22,"carbs_g":70,"fat_g":22,"explanation":"Rich and savory comforting pasta."}',
    ARRAY['large pot','skillet'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000012',
    '33333333-3333-3333-3333-333333333333',
    'Banana Oat Muffins',
    'Wholesome gluten-free breakfast muffins sweetened with ripe bananas.',
    '[{"name":"ripe bananas","quantity":3,"unit":"whole"},{"name":"rolled oats","quantity":2,"unit":"cups"},{"name":"maple syrup","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Mash the bananas and mix them with the rolled oats and maple syrup until well combined.","ingredients":["ripe bananas","rolled oats","maple syrup"],"estimated_duration_minutes":10},{"instruction":"Divide the batter into a muffin tin and bake at 350°F until golden.","ingredients":[],"estimated_duration_minutes":20}]',
    '{"calories":180,"protein_g":5,"carbs_g":32,"fat_g":4,"explanation":"Great fiber-rich breakfast option."}',
    ARRAY['muffin tin','mixing bowl'],
    12,
    'american',
    'breakfast',
    true
);

-- Grocery list + items
insert into public.grocery_lists (id, user_id, title)
values ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Weekly Shop'),
('bbbbbbbb-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Baking Essentials');

insert into public.grocery_list_items (list_id, name, quantity, unit, checked)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'broccoli', 1, 'head', false),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'soy sauce', 2, 'tbsp', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'rolled oats', 2, 'bags', false),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'maple syrup', 1, 'bottle', false);

-- Meal plan + meals
insert into public.meal_plans (id, user_id, title)
values
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'No Scaling'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Double Recipe'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'Duplicate Recipe'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Empty'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-111111111111',
    'Weekly Demo'
  );

insert into public.meal_plan_meals (
    id,
    meal_plan_id,
    recipe_id,
    servings,
    scheduled_date,
    meal_type
)
values

-- ============================================================
-- No Scaling
-- Chicken Curry recipe serves 4, meal serves 4
-- ============================================================
(
    'cccccccc-0000-0000-0000-000000000001',
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000002',
    4,
    '2026-07-27',
    'dinner'
),

-- ============================================================
-- Double Recipe
-- Chicken Curry recipe serves 4, meal serves 8
-- ============================================================
(
    'cccccccc-0000-0000-0000-000000000002',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000002',
    8,
    '2026-07-27',
    'dinner'
),

-- ============================================================
-- Duplicate Recipe
-- Same recipe twice with different serving sizes
-- ============================================================
(
    'cccccccc-0000-0000-0000-000000000003',
    'bbbbbbbb-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000002',
    4,
    '2026-07-28',
    'dinner'
),
(
    'cccccccc-0000-0000-0000-000000000004',
    'bbbbbbbb-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000002',
    8,
    '2026-07-29',
    'dinner'
),

-- ============================================================
-- Weekly Demo
-- Multiple recipes with varying serving sizes
-- ============================================================

-- Chicken Curry (recipe serves 4 -> meal serves 4)
(
    'cccccccc-0000-0000-0000-000000000005',
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000002',
    4,
    '2026-07-27',
    'dinner'
),

-- Pancakes (recipe serves 4 -> meal serves 2)
(
    'cccccccc-0000-0000-0000-000000000006',
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000003',
    2,
    '2026-07-28',
    'breakfast'
),

-- Scrambled Eggs (recipe serves 2 -> meal serves 6)
(
    'cccccccc-0000-0000-0000-000000000007',
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000004',
    6,
    '2026-07-29',
    'breakfast'
),

-- Caesar Salad (recipe serves 2 -> meal serves 2)
(
    'cccccccc-0000-0000-0000-000000000008',
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000006',
    2,
    '2026-07-30',
    'lunch'
),

-- Chicken Fajitas (recipe serves 4 -> meal serves 8)
(
    'cccccccc-0000-0000-0000-000000000009',
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000007',
    8,
    '2026-07-31',
    'dinner'
);