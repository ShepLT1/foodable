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
),
(
    'aaaaaaaa-0000-0000-0000-000000000013',
    '22222222-2222-2222-2222-222222222222',
    'Lemon Herb Chicken with Roasted Potatoes',
    'Juicy roasted chicken thighs served with crispy baby potatoes and fresh herbs.',
    '[{"name":"bone-in chicken thighs","quantity":2,"unit":"lb"},{"name":"baby potatoes","quantity":1.5,"unit":"lb"},{"name":"olive oil","quantity":3,"unit":"tbsp"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"fresh rosemary","quantity":1,"unit":"tbsp"},{"name":"fresh thyme","quantity":1,"unit":"tbsp"},{"name":"salt","quantity":1,"unit":"tsp"},{"name":"black pepper","quantity":0.5,"unit":"tsp"},{"name":"parsley","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Preheat the oven to 425°F and halve the baby potatoes.","ingredients":["baby potatoes"],"estimated_duration_minutes":10},{"instruction":"Mix olive oil, minced garlic, rosemary, thyme, lemon zest, salt, and pepper to create a marinade.","ingredients":["olive oil","garlic","fresh rosemary","fresh thyme","lemon","salt","black pepper"],"estimated_duration_minutes":5},{"instruction":"Coat the chicken thighs and potatoes with the marinade and spread onto a sheet pan.","ingredients":["bone-in chicken thighs","baby potatoes"],"estimated_duration_minutes":5},{"instruction":"Roast until the chicken reaches 165°F and the potatoes are golden brown.","ingredients":[],"estimated_duration_minutes":40},{"instruction":"Finish with fresh parsley and a squeeze of lemon before serving.","ingredients":["parsley","lemon"],"estimated_duration_minutes":2}]',
    '{"calories":610,"protein_g":39,"carbs_g":31,"fat_g":34,"explanation":"A balanced high-protein dinner featuring roasted vegetables and healthy fats from olive oil."}',
    ARRAY['Chef''s knife','Cutting board','Mixing bowl','Sheet pan'],
    4,
    'american',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000014',
    '44444444-4444-4444-4444-444444444444',
    'Mediterranean Chickpea Bowls',
    'A colorful grain bowl with quinoa, roasted vegetables, chickpeas, and a creamy feta yogurt sauce.',
    '[{"name":"quinoa","quantity":1,"unit":"cup"},{"name":"chickpeas","quantity":1,"unit":"can"},{"name":"cucumber","quantity":1,"unit":"whole"},{"name":"cherry tomatoes","quantity":1.5,"unit":"cups"},{"name":"red onion","quantity":0.5,"unit":"whole"},{"name":"feta cheese","quantity":0.5,"unit":"cup"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"parsley","quantity":0.25,"unit":"cup"},{"name":"paprika","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Cook the quinoa according to package directions and let it cool slightly.","ingredients":["quinoa"],"estimated_duration_minutes":20},{"instruction":"Drain and rinse the chickpeas, then toss with olive oil and paprika before roasting until lightly crisp.","ingredients":["chickpeas","olive oil","paprika"],"estimated_duration_minutes":20},{"instruction":"Dice the cucumber, halve the cherry tomatoes, and thinly slice the red onion.","ingredients":["cucumber","cherry tomatoes","red onion"],"estimated_duration_minutes":10},{"instruction":"Mix the Greek yogurt with minced garlic, lemon juice, and a pinch of salt to create the sauce.","ingredients":["greek yogurt","garlic","lemon"],"estimated_duration_minutes":5},{"instruction":"Assemble bowls with quinoa, roasted chickpeas, vegetables, feta, parsley, and drizzle with the yogurt sauce.","ingredients":["feta cheese","parsley"],"estimated_duration_minutes":5}]',
    '{"calories":520,"protein_g":22,"carbs_g":54,"fat_g":24,"explanation":"A fiber-rich vegetarian meal with complete protein from quinoa and chickpeas plus healthy fats from olive oil and feta."}',
    ARRAY['Medium saucepan','Sheet pan','Chef''s knife','Mixing bowl'],
    4,
    'mediterranean',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000015',
    '55555555-5555-5555-5555-555555555555',
    'Teriyaki Salmon Rice Bowls',
    'Oven-baked salmon glazed with teriyaki sauce served over rice with broccoli.',
    '[{"name":"salmon fillets","quantity":1.5,"unit":"lb"},{"name":"broccoli","quantity":2,"unit":"heads"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"soy sauce","quantity":0.25,"unit":"cup"},{"name":"brown sugar","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"green onions","quantity":3,"unit":"whole"},{"name":"sesame seeds","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Whisk together soy sauce, brown sugar, garlic, ginger, and sesame oil to make the teriyaki glaze.","ingredients":["soy sauce","brown sugar","garlic","ginger","sesame oil"],"estimated_duration_minutes":5},{"instruction":"Brush the salmon with the glaze and bake until flaky.","ingredients":["salmon fillets"],"estimated_duration_minutes":15},{"instruction":"Steam the broccoli until tender-crisp.","ingredients":["broccoli"],"estimated_duration_minutes":8},{"instruction":"Serve salmon over rice with broccoli and garnish with green onions and sesame seeds.","ingredients":["green onions","sesame seeds"],"estimated_duration_minutes":3}]',
    '{"calories":640,"protein_g":40,"carbs_g":46,"fat_g":30,"explanation":"Rich in omega-3 fats and lean protein with balanced carbohydrates for a satisfying dinner."}',
    ARRAY['Baking sheet','Small saucepan','Rice cooker','Mixing bowl'],
    4,
    'japanese',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000016',
    '11111111-1111-1111-1111-111111111111',
    'Black Bean Chicken Tacos',
    'Flavorful tacos with seasoned chicken, black beans, fresh vegetables, and a lime crema.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"black beans","quantity":1,"unit":"can"},{"name":"corn tortillas","quantity":8,"unit":"whole"},{"name":"avocado","quantity":1,"unit":"whole"},{"name":"roma tomatoes","quantity":2,"unit":"whole"},{"name":"red onion","quantity":0.5,"unit":"whole"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"lime","quantity":2,"unit":"whole"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"chili powder","quantity":2,"unit":"tsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"},{"name":"paprika","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Season the chicken with chili powder, cumin, paprika, salt, and pepper.","ingredients":["chicken breast","chili powder","ground cumin","paprika"],"estimated_duration_minutes":5},{"instruction":"Cook the chicken in olive oil until fully cooked, then slice into strips.","ingredients":["chicken breast","olive oil"],"estimated_duration_minutes":12},{"instruction":"Warm the black beans and lightly char the tortillas.","ingredients":["black beans","corn tortillas"],"estimated_duration_minutes":6},{"instruction":"Mix Greek yogurt, minced garlic, lime juice, and a pinch of salt to create the lime crema.","ingredients":["greek yogurt","garlic","lime"],"estimated_duration_minutes":5},{"instruction":"Assemble tacos with chicken, beans, diced tomatoes, onion, avocado, cilantro, and drizzle with the lime crema.","ingredients":["roma tomatoes","red onion","avocado","cilantro"],"estimated_duration_minutes":5}]',
    '{"calories":570,"protein_g":38,"carbs_g":42,"fat_g":24,"explanation":"A balanced meal high in lean protein and fiber with healthy fats from avocado."}',
    ARRAY['Large skillet','Chef''s knife','Mixing bowl','Tongs'],
    4,
    'mexican',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000017',
    '33333333-3333-3333-3333-333333333333',
    'Spinach Mushroom Frittata',
    'A fluffy baked egg frittata loaded with spinach, mushrooms, and feta cheese.',
    '[{"name":"eggs","quantity":8,"unit":"whole"},{"name":"baby spinach","quantity":3,"unit":"cups"},{"name":"cremini mushrooms","quantity":8,"unit":"oz"},{"name":"feta cheese","quantity":0.5,"unit":"cup"},{"name":"yellow onion","quantity":0.5,"unit":"whole"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"milk","quantity":0.25,"unit":"cup"},{"name":"salt","quantity":0.5,"unit":"tsp"},{"name":"black pepper","quantity":0.25,"unit":"tsp"},{"name":"parsley","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Preheat the oven to 375°F and whisk together the eggs, milk, salt, and pepper.","ingredients":["eggs","milk","salt","black pepper"],"estimated_duration_minutes":5},{"instruction":"Saute the onion, mushrooms, and garlic in olive oil until softened.","ingredients":["yellow onion","cremini mushrooms","garlic","olive oil"],"estimated_duration_minutes":8},{"instruction":"Add the spinach and cook until wilted.","ingredients":["baby spinach"],"estimated_duration_minutes":2},{"instruction":"Pour the egg mixture into the skillet, sprinkle with feta, and transfer to the oven.","ingredients":["feta cheese"],"estimated_duration_minutes":2},{"instruction":"Bake until the center is set, then garnish with parsley before serving.","ingredients":["parsley"],"estimated_duration_minutes":18}]',
    '{"calories":340,"protein_g":24,"carbs_g":8,"fat_g":23,"explanation":"A protein-rich vegetarian breakfast packed with vegetables while remaining relatively low in carbohydrates."}',
    ARRAY['Oven-safe skillet','Whisk','Mixing bowl','Chef''s knife'],
    4,
    'mediterranean',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000018',
    '22222222-2222-2222-2222-222222222222',
    'Creamy Tuscan Chicken',
    'Pan-seared chicken simmered in a creamy garlic parmesan sauce with spinach and sun-dried tomatoes.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"baby spinach","quantity":3,"unit":"cups"},{"name":"sun-dried tomatoes","quantity":0.5,"unit":"cup"},{"name":"heavy cream","quantity":1,"unit":"cup"},{"name":"parmesan cheese","quantity":0.75,"unit":"cup"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"italian seasoning","quantity":2,"unit":"tsp"},{"name":"chicken broth","quantity":0.5,"unit":"cup"},{"name":"salt","quantity":1,"unit":"tsp"},{"name":"black pepper","quantity":0.5,"unit":"tsp"},{"name":"parsley","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Season the chicken with salt, pepper, and Italian seasoning.","ingredients":["chicken breast","italian seasoning","salt","black pepper"],"estimated_duration_minutes":5},{"instruction":"Sear the chicken in olive oil until golden on both sides, then remove from the skillet.","ingredients":["chicken breast","olive oil"],"estimated_duration_minutes":10},{"instruction":"Cook the garlic until fragrant, then stir in the chicken broth, heavy cream, parmesan, and sun-dried tomatoes.","ingredients":["garlic","chicken broth","heavy cream","parmesan cheese","sun-dried tomatoes"],"estimated_duration_minutes":8},{"instruction":"Return the chicken to the skillet, add the spinach, and simmer until the sauce thickens and the chicken is cooked through.","ingredients":["baby spinach"],"estimated_duration_minutes":10},{"instruction":"Garnish with chopped parsley and serve.","ingredients":["parsley"],"estimated_duration_minutes":2}]',
    '{"calories":670,"protein_g":46,"carbs_g":9,"fat_g":47,"explanation":"High in protein and rich in healthy fats, making it a satisfying low-carbohydrate dinner."}',
    ARRAY['Large skillet','Chef''s knife','Cutting board','Wooden spoon'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000019',
    '44444444-4444-4444-4444-444444444444',
    'Thai Peanut Chicken Noodles',
    'Rice noodles tossed with tender chicken, crisp vegetables, and a creamy peanut sauce.',
    '[{"name":"rice noodles","quantity":8,"unit":"oz"},{"name":"chicken breast","quantity":1,"unit":"lb"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"green onions","quantity":4,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"soy sauce","quantity":3,"unit":"tbsp"},{"name":"peanut butter","quantity":0.25,"unit":"cup"},{"name":"lime","quantity":1,"unit":"whole"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"cilantro","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Cook the rice noodles according to package directions.","ingredients":["rice noodles"],"estimated_duration_minutes":8},{"instruction":"Cook the chicken until golden, then slice into bite-sized pieces.","ingredients":["chicken breast"],"estimated_duration_minutes":10},{"instruction":"Saute the carrots, bell pepper, garlic, and ginger until just tender.","ingredients":["carrots","red bell pepper","garlic","ginger"],"estimated_duration_minutes":6},{"instruction":"Whisk together peanut butter, soy sauce, sesame oil, lime juice, and a splash of warm water to create the sauce.","ingredients":["peanut butter","soy sauce","sesame oil","lime"],"estimated_duration_minutes":4},{"instruction":"Toss the noodles, chicken, vegetables, and sauce together. Finish with green onions and cilantro.","ingredients":["green onions","cilantro"],"estimated_duration_minutes":4}]',
    '{"calories":610,"protein_g":37,"carbs_g":49,"fat_g":28,"explanation":"A balanced dinner with lean protein, vegetables, and healthy fats from peanuts and sesame oil."}',
    ARRAY['Large skillet','Large pot','Whisk','Chef''s knife'],
    4,
    'thai',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000020',
    '55555555-5555-5555-5555-555555555555',
    'Greek Chicken Pitas',
    'Grilled lemon herb chicken tucked into warm pita bread with fresh vegetables and tzatziki.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"pita bread","quantity":4,"unit":"whole"},{"name":"greek yogurt","quantity":1,"unit":"cup"},{"name":"cucumber","quantity":1,"unit":"whole"},{"name":"tomato","quantity":2,"unit":"whole"},{"name":"red onion","quantity":0.5,"unit":"whole"},{"name":"feta cheese","quantity":0.5,"unit":"cup"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"oregano","quantity":2,"unit":"tsp"},{"name":"parsley","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Marinate the chicken with olive oil, oregano, garlic, lemon juice, salt, and pepper.","ingredients":["chicken breast","olive oil","oregano","garlic","lemon"],"estimated_duration_minutes":15},{"instruction":"Grill or pan-sear the chicken until cooked through, then slice thinly.","ingredients":["chicken breast"],"estimated_duration_minutes":12},{"instruction":"Mix Greek yogurt, grated cucumber, garlic, lemon juice, and parsley to make tzatziki.","ingredients":["greek yogurt","cucumber","garlic","lemon","parsley"],"estimated_duration_minutes":8},{"instruction":"Warm the pita bread and prepare the tomato, onion, and feta.","ingredients":["pita bread","tomato","red onion","feta cheese"],"estimated_duration_minutes":5},{"instruction":"Fill each pita with chicken, vegetables, feta, and tzatziki.","ingredients":[],"estimated_duration_minutes":3}]',
    '{"calories":590,"protein_g":42,"carbs_g":38,"fat_g":26,"explanation":"A protein-rich Mediterranean meal featuring fresh vegetables and a probiotic-rich yogurt sauce."}',
    ARRAY['Grill pan','Mixing bowl','Chef''s knife','Tongs'],
    4,
    'greek',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000021',
    '11111111-1111-1111-1111-111111111111',
    'Southwest Turkey Chili',
    'A hearty one-pot chili packed with lean ground turkey, beans, tomatoes, and warming spices.',
    '[{"name":"ground turkey","quantity":1.5,"unit":"lb"},{"name":"black beans","quantity":1,"unit":"can"},{"name":"kidney beans","quantity":1,"unit":"can"},{"name":"diced tomatoes","quantity":2,"unit":"cans"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"chili powder","quantity":2,"unit":"tbsp"},{"name":"ground cumin","quantity":2,"unit":"tsp"},{"name":"paprika","quantity":1,"unit":"tsp"},{"name":"chicken broth","quantity":2,"unit":"cups"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"}]',
    '[{"instruction":"Heat olive oil in a large pot and saute the onion, bell pepper, and garlic until softened.","ingredients":["olive oil","yellow onion","red bell pepper","garlic"],"estimated_duration_minutes":8},{"instruction":"Add the ground turkey and cook until browned, breaking it into small pieces.","ingredients":["ground turkey"],"estimated_duration_minutes":8},{"instruction":"Stir in the chili powder, cumin, paprika, and cook until fragrant.","ingredients":["chili powder","ground cumin","paprika"],"estimated_duration_minutes":2},{"instruction":"Add the diced tomatoes, beans, and chicken broth. Simmer until thickened.","ingredients":["diced tomatoes","black beans","kidney beans","chicken broth"],"estimated_duration_minutes":30},{"instruction":"Serve topped with Greek yogurt and fresh cilantro.","ingredients":["greek yogurt","cilantro"],"estimated_duration_minutes":2}]',
    '{"calories":520,"protein_g":42,"carbs_g":35,"fat_g":18,"explanation":"A high-protein, fiber-rich meal that reheats well for meal prep and provides sustained energy."}',
    ARRAY['Dutch oven','Wooden spoon','Chef''s knife','Can opener'],
    6,
    'american',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000022',
    '33333333-3333-3333-3333-333333333333',
    'Blueberry Almond Overnight Oats',
    'Creamy overnight oats with blueberries, almonds, chia seeds, and Greek yogurt.',
    '[{"name":"rolled oats","quantity":2,"unit":"cups"},{"name":"greek yogurt","quantity":1,"unit":"cup"},{"name":"milk","quantity":1.5,"unit":"cups"},{"name":"chia seeds","quantity":2,"unit":"tbsp"},{"name":"blueberries","quantity":1.5,"unit":"cups"},{"name":"sliced almonds","quantity":0.5,"unit":"cup"},{"name":"honey","quantity":2,"unit":"tbsp"},{"name":"vanilla extract","quantity":1,"unit":"tsp"},{"name":"ground cinnamon","quantity":0.5,"unit":"tsp"}]',
    '[{"instruction":"Combine the oats, milk, Greek yogurt, chia seeds, honey, vanilla, and cinnamon in a large bowl.","ingredients":["rolled oats","milk","greek yogurt","chia seeds","honey","vanilla extract","ground cinnamon"],"estimated_duration_minutes":5},{"instruction":"Fold in half of the blueberries.","ingredients":["blueberries"],"estimated_duration_minutes":2},{"instruction":"Divide the mixture into four jars and refrigerate overnight.","ingredients":[],"estimated_duration_minutes":3},{"instruction":"Before serving, top with the remaining blueberries and sliced almonds.","ingredients":["blueberries","sliced almonds"],"estimated_duration_minutes":2}]',
    '{"calories":390,"protein_g":18,"carbs_g":46,"fat_g":15,"explanation":"A balanced breakfast with whole grains, protein, healthy fats, and plenty of fiber."}',
    ARRAY['Mixing bowl','Measuring cups','Storage jars','Spoon'],
    4,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000023',
    '22222222-2222-2222-2222-222222222222',
    'Beef Bulgogi Rice Bowls',
    'Thinly sliced beef marinated in a sweet and savory Korean-inspired sauce served over steamed rice.',
    '[{"name":"flank steak","quantity":1.5,"unit":"lb"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"soy sauce","quantity":0.25,"unit":"cup"},{"name":"brown sugar","quantity":2,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"green onions","quantity":4,"unit":"whole"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"broccoli","quantity":2,"unit":"cups"},{"name":"sesame seeds","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Slice the flank steak as thinly as possible against the grain.","ingredients":["flank steak"],"estimated_duration_minutes":10},{"instruction":"Whisk together soy sauce, brown sugar, sesame oil, garlic, and ginger. Marinate the beef for at least 30 minutes.","ingredients":["soy sauce","brown sugar","sesame oil","garlic","ginger"],"estimated_duration_minutes":35},{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Stir-fry the beef until browned, then cook the broccoli and carrots until tender-crisp.","ingredients":["broccoli","carrots"],"estimated_duration_minutes":10},{"instruction":"Serve over rice and garnish with sliced green onions and sesame seeds.","ingredients":["green onions","sesame seeds"],"estimated_duration_minutes":3}]',
    '{"calories":690,"protein_g":43,"carbs_g":49,"fat_g":33,"explanation":"A protein-rich dinner with vegetables and balanced carbohydrates, featuring healthy fats from sesame oil."}',
    ARRAY['Large skillet','Chef''s knife','Mixing bowl','Rice cooker'],
    4,
    'korean',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000024',
    '44444444-4444-4444-4444-444444444444',
    'Mediterranean Lentil Soup',
    'A hearty soup filled with lentils, vegetables, herbs, and fresh lemon.',
    '[{"name":"dry lentils","quantity":1.5,"unit":"cups"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"celery","quantity":2,"unit":"stalks"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"diced tomatoes","quantity":1,"unit":"can"},{"name":"vegetable broth","quantity":6,"unit":"cups"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"},{"name":"paprika","quantity":1,"unit":"tsp"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"parsley","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Saute the onion, carrots, celery, and garlic in olive oil until softened.","ingredients":["yellow onion","carrots","celery","garlic","olive oil"],"estimated_duration_minutes":10},{"instruction":"Add cumin and paprika and cook until fragrant.","ingredients":["ground cumin","paprika"],"estimated_duration_minutes":2},{"instruction":"Add the lentils, diced tomatoes, and vegetable broth. Simmer until the lentils are tender.","ingredients":["dry lentils","diced tomatoes","vegetable broth"],"estimated_duration_minutes":35},{"instruction":"Stir in fresh lemon juice and season to taste.","ingredients":["lemon"],"estimated_duration_minutes":2},{"instruction":"Serve topped with chopped parsley.","ingredients":["parsley"],"estimated_duration_minutes":2}]',
    '{"calories":380,"protein_g":19,"carbs_g":54,"fat_g":10,"explanation":"A filling, fiber-rich vegetarian soup with plant-based protein and heart-healthy ingredients."}',
    ARRAY['Dutch oven','Chef''s knife','Wooden spoon'],
    6,
    'mediterranean',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000025',
    '55555555-5555-5555-5555-555555555555',
    'Shrimp Fried Rice',
    'Quick fried rice loaded with shrimp, vegetables, and scrambled eggs.',
    '[{"name":"shrimp","quantity":1.5,"unit":"lb"},{"name":"cooked jasmine rice","quantity":4,"unit":"cups"},{"name":"eggs","quantity":2,"unit":"whole"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"peas","quantity":1,"unit":"cup"},{"name":"green onions","quantity":4,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"soy sauce","quantity":3,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"ginger","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Scramble the eggs in a hot wok and set aside.","ingredients":["eggs"],"estimated_duration_minutes":4},{"instruction":"Cook the shrimp until pink, then remove from the pan.","ingredients":["shrimp"],"estimated_duration_minutes":4},{"instruction":"Saute the carrots, garlic, ginger, and peas until tender.","ingredients":["carrots","garlic","ginger","peas"],"estimated_duration_minutes":6},{"instruction":"Add the rice, soy sauce, sesame oil, shrimp, and eggs. Stir-fry until heated through.","ingredients":["cooked jasmine rice","soy sauce","sesame oil"],"estimated_duration_minutes":6},{"instruction":"Garnish with sliced green onions before serving.","ingredients":["green onions"],"estimated_duration_minutes":2}]',
    '{"calories":560,"protein_g":35,"carbs_g":48,"fat_g":20,"explanation":"A balanced one-pan meal packed with lean protein, vegetables, and satisfying carbohydrates."}',
    ARRAY['Wok','Spatula','Chef''s knife'],
    4,
    'chinese',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000026',
    '11111111-1111-1111-1111-111111111111',
    'Honey Garlic Pork Chops',
    'Juicy pork chops glazed with a sweet and savory honey garlic sauce served alongside roasted vegetables.',
    '[{"name":"boneless pork chops","quantity":4,"unit":"whole"},{"name":"broccoli","quantity":2,"unit":"cups"},{"name":"carrots","quantity":3,"unit":"whole"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"honey","quantity":3,"unit":"tbsp"},{"name":"soy sauce","quantity":2,"unit":"tbsp"},{"name":"dijon mustard","quantity":1,"unit":"tbsp"},{"name":"black pepper","quantity":0.5,"unit":"tsp"},{"name":"parsley","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Season the pork chops with salt and black pepper.","ingredients":["boneless pork chops","black pepper"],"estimated_duration_minutes":3},{"instruction":"Whisk together the honey, soy sauce, Dijon mustard, and minced garlic.","ingredients":["honey","soy sauce","dijon mustard","garlic"],"estimated_duration_minutes":3},{"instruction":"Roast the broccoli and carrots with olive oil until tender.","ingredients":["broccoli","carrots","olive oil"],"estimated_duration_minutes":25},{"instruction":"Sear the pork chops until golden, then brush with the honey garlic glaze and cook until fully done.","ingredients":["boneless pork chops"],"estimated_duration_minutes":12},{"instruction":"Serve with the roasted vegetables and garnish with chopped parsley.","ingredients":["parsley"],"estimated_duration_minutes":2}]',
    '{"calories":590,"protein_g":41,"carbs_g":24,"fat_g":34,"explanation":"A protein-rich dinner with roasted vegetables and a flavorful homemade glaze."}',
    ARRAY['Large skillet','Sheet pan','Mixing bowl','Chef''s knife'],
    4,
    'american',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000027',
    '22222222-2222-2222-2222-222222222222',
    'Spinach Ricotta Stuffed Shells',
    'Jumbo pasta shells filled with a creamy spinach and ricotta mixture baked in marinara sauce.',
    '[{"name":"jumbo pasta shells","quantity":20,"unit":"whole"},{"name":"ricotta cheese","quantity":15,"unit":"oz"},{"name":"baby spinach","quantity":3,"unit":"cups"},{"name":"mozzarella cheese","quantity":2,"unit":"cups"},{"name":"parmesan cheese","quantity":0.5,"unit":"cup"},{"name":"marinara sauce","quantity":3,"unit":"cups"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"egg","quantity":1,"unit":"whole"},{"name":"parsley","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Cook the pasta shells until just al dente.","ingredients":["jumbo pasta shells"],"estimated_duration_minutes":12},{"instruction":"Saute garlic and spinach in olive oil until wilted.","ingredients":["garlic","baby spinach","olive oil"],"estimated_duration_minutes":5},{"instruction":"Mix the ricotta, egg, parmesan, parsley, and spinach mixture together.","ingredients":["ricotta cheese","egg","parmesan cheese","parsley"],"estimated_duration_minutes":5},{"instruction":"Fill each shell, arrange in a baking dish with marinara sauce, and top with mozzarella.","ingredients":["marinara sauce","mozzarella cheese"],"estimated_duration_minutes":10},{"instruction":"Bake until bubbly and golden.","ingredients":[],"estimated_duration_minutes":30}]',
    '{"calories":610,"protein_g":29,"carbs_g":51,"fat_g":31,"explanation":"A comforting vegetarian pasta dish that provides protein from multiple dairy sources and vegetables from spinach."}',
    ARRAY['Large pot','9x13 baking dish','Mixing bowl','Wooden spoon'],
    6,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000028',
    '33333333-3333-3333-3333-333333333333',
    'Apple Cinnamon Protein Muffins',
    'Moist whole wheat muffins packed with apples, oats, Greek yogurt, and warming spices.',
    '[{"name":"whole wheat flour","quantity":2,"unit":"cups"},{"name":"rolled oats","quantity":1,"unit":"cup"},{"name":"greek yogurt","quantity":1,"unit":"cup"},{"name":"apple","quantity":2,"unit":"whole"},{"name":"eggs","quantity":2,"unit":"whole"},{"name":"honey","quantity":0.25,"unit":"cup"},{"name":"baking powder","quantity":2,"unit":"tsp"},{"name":"ground cinnamon","quantity":2,"unit":"tsp"},{"name":"vanilla extract","quantity":1,"unit":"tsp"},{"name":"milk","quantity":0.5,"unit":"cup"}]',
    '[{"instruction":"Preheat the oven to 350°F and prepare a muffin pan.","ingredients":[],"estimated_duration_minutes":5},{"instruction":"Whisk together the dry ingredients.","ingredients":["whole wheat flour","rolled oats","baking powder","ground cinnamon"],"estimated_duration_minutes":4},{"instruction":"Mix the yogurt, eggs, milk, honey, and vanilla before folding into the dry ingredients with the diced apples.","ingredients":["greek yogurt","eggs","milk","honey","vanilla extract","apple"],"estimated_duration_minutes":6},{"instruction":"Divide the batter evenly among the muffin cups.","ingredients":[],"estimated_duration_minutes":3},{"instruction":"Bake until lightly golden and a toothpick comes out clean.","ingredients":[],"estimated_duration_minutes":22}]',
    '{"calories":240,"protein_g":10,"carbs_g":32,"fat_g":8,"explanation":"A balanced breakfast muffin with extra protein and fiber from oats, yogurt, and whole wheat flour."}',
    ARRAY['Muffin tin','Mixing bowls','Whisk','Cooling rack'],
    12,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000029',
    '44444444-4444-4444-4444-444444444444',
    'Chicken Shawarma Bowls',
    'Tender spiced chicken served over turmeric rice with fresh vegetables and homemade tzatziki.',
    '[{"name":"chicken thighs","quantity":1.5,"unit":"lb"},{"name":"basmati rice","quantity":1.5,"unit":"cups"},{"name":"greek yogurt","quantity":1,"unit":"cup"},{"name":"cucumber","quantity":1,"unit":"whole"},{"name":"cherry tomatoes","quantity":1.5,"unit":"cups"},{"name":"red onion","quantity":0.5,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"paprika","quantity":2,"unit":"tsp"},{"name":"ground cumin","quantity":2,"unit":"tsp"},{"name":"ground turmeric","quantity":1,"unit":"tsp"},{"name":"parsley","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Marinate the chicken with olive oil, garlic, paprika, cumin, turmeric, lemon juice, salt, and pepper.","ingredients":["chicken thighs","olive oil","garlic","paprika","ground cumin","ground turmeric","lemon"],"estimated_duration_minutes":30},{"instruction":"Cook the basmati rice according to package directions.","ingredients":["basmati rice"],"estimated_duration_minutes":20},{"instruction":"Grill or sear the chicken until cooked through, then slice into strips.","ingredients":["chicken thighs"],"estimated_duration_minutes":12},{"instruction":"Mix Greek yogurt, grated cucumber, garlic, and lemon juice to make tzatziki.","ingredients":["greek yogurt","cucumber","garlic","lemon"],"estimated_duration_minutes":5},{"instruction":"Assemble bowls with rice, chicken, tomatoes, onion, parsley, and tzatziki.","ingredients":["cherry tomatoes","red onion","parsley"],"estimated_duration_minutes":5}]',
    '{"calories":620,"protein_g":41,"carbs_g":44,"fat_g":30,"explanation":"A balanced Mediterranean-inspired meal rich in lean protein and fresh vegetables."}',
    ARRAY['Large skillet','Mixing bowl','Rice cooker','Chef''s knife'],
    4,
    'middle eastern',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000030',
    '55555555-5555-5555-5555-555555555555',
    'Vegetable Coconut Curry',
    'A comforting curry with chickpeas, sweet potatoes, spinach, and coconut milk.',
    '[{"name":"sweet potato","quantity":2,"unit":"whole"},{"name":"chickpeas","quantity":2,"unit":"cans"},{"name":"baby spinach","quantity":3,"unit":"cups"},{"name":"coconut milk","quantity":1,"unit":"can"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"curry powder","quantity":2,"unit":"tbsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"vegetable broth","quantity":1,"unit":"cup"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"basmati rice","quantity":1.5,"unit":"cups"}]',
    '[{"instruction":"Cook the basmati rice according to package directions.","ingredients":["basmati rice"],"estimated_duration_minutes":20},{"instruction":"Saute the onion, garlic, and ginger in olive oil until fragrant.","ingredients":["yellow onion","garlic","ginger","olive oil"],"estimated_duration_minutes":8},{"instruction":"Add the curry powder and cumin, then stir in the sweet potatoes, coconut milk, and vegetable broth.","ingredients":["curry powder","ground cumin","sweet potato","coconut milk","vegetable broth"],"estimated_duration_minutes":20},{"instruction":"Add the chickpeas and spinach and simmer until the spinach wilts.","ingredients":["chickpeas","baby spinach"],"estimated_duration_minutes":8},{"instruction":"Serve over rice and garnish with fresh cilantro.","ingredients":["cilantro"],"estimated_duration_minutes":2}]',
    '{"calories":510,"protein_g":17,"carbs_g":61,"fat_g":22,"explanation":"A hearty vegan meal with fiber-rich legumes, vegetables, and healthy fats from coconut milk."}',
    ARRAY['Dutch oven','Wooden spoon','Chef''s knife','Rice cooker'],
    4,
    'indian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000031',
    '11111111-1111-1111-1111-111111111111',
    'Turkey Avocado Wraps',
    'Whole wheat wraps filled with sliced turkey, avocado, crisp vegetables, and a light yogurt spread.',
    '[{"name":"whole wheat tortillas","quantity":4,"unit":"whole"},{"name":"sliced turkey breast","quantity":12,"unit":"oz"},{"name":"avocado","quantity":1,"unit":"whole"},{"name":"baby spinach","quantity":2,"unit":"cups"},{"name":"tomato","quantity":2,"unit":"whole"},{"name":"cucumber","quantity":1,"unit":"whole"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"},{"name":"dijon mustard","quantity":1,"unit":"tbsp"},{"name":"lemon","quantity":0.5,"unit":"whole"},{"name":"black pepper","quantity":0.25,"unit":"tsp"}]',
    '[{"instruction":"Mix the Greek yogurt, Dijon mustard, lemon juice, and black pepper to create the spread.","ingredients":["greek yogurt","dijon mustard","lemon","black pepper"],"estimated_duration_minutes":3},{"instruction":"Slice the avocado, tomato, and cucumber.","ingredients":["avocado","tomato","cucumber"],"estimated_duration_minutes":5},{"instruction":"Spread the yogurt mixture evenly over each tortilla.","ingredients":["whole wheat tortillas"],"estimated_duration_minutes":2},{"instruction":"Layer the turkey, spinach, vegetables, and avocado onto each wrap.","ingredients":["sliced turkey breast","baby spinach"],"estimated_duration_minutes":4},{"instruction":"Roll tightly, slice in half, and serve immediately.","ingredients":[],"estimated_duration_minutes":2}]',
    '{"calories":450,"protein_g":31,"carbs_g":29,"fat_g":21,"explanation":"A quick high-protein lunch with fresh vegetables and healthy fats from avocado."}',
    ARRAY['Chef''s knife','Cutting board','Mixing bowl'],
    4,
    'american',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000032',
    '22222222-2222-2222-2222-222222222222',
    'Baked Ziti',
    'A classic baked pasta with Italian sausage, marinara, ricotta, and melted mozzarella.',
    '[{"name":"ziti pasta","quantity":1,"unit":"lb"},{"name":"italian sausage","quantity":1,"unit":"lb"},{"name":"marinara sauce","quantity":4,"unit":"cups"},{"name":"ricotta cheese","quantity":15,"unit":"oz"},{"name":"mozzarella cheese","quantity":2,"unit":"cups"},{"name":"parmesan cheese","quantity":0.5,"unit":"cup"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"italian seasoning","quantity":2,"unit":"tsp"},{"name":"fresh basil","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Cook the ziti until just al dente and drain.","ingredients":["ziti pasta"],"estimated_duration_minutes":12},{"instruction":"Saute the onion and garlic in olive oil, then brown the Italian sausage.","ingredients":["yellow onion","garlic","olive oil","italian sausage"],"estimated_duration_minutes":10},{"instruction":"Stir in the marinara sauce and Italian seasoning, then simmer briefly.","ingredients":["marinara sauce","italian seasoning"],"estimated_duration_minutes":8},{"instruction":"Combine the pasta with the sauce and ricotta, transfer to a baking dish, and top with mozzarella and parmesan.","ingredients":["ricotta cheese","mozzarella cheese","parmesan cheese"],"estimated_duration_minutes":8},{"instruction":"Bake until bubbly and garnish with fresh basil before serving.","ingredients":["fresh basil"],"estimated_duration_minutes":30}]',
    '{"calories":720,"protein_g":36,"carbs_g":54,"fat_g":38,"explanation":"A hearty family-style pasta dish with plenty of protein and calcium from the cheeses."}',
    ARRAY['Large pot','Large skillet','9x13 baking dish','Wooden spoon'],
    6,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000033',
    '33333333-3333-3333-3333-333333333333',
    'Sweet Potato Breakfast Hash',
    'Roasted sweet potatoes with turkey sausage, peppers, onions, and eggs.',
    '[{"name":"sweet potato","quantity":2,"unit":"whole"},{"name":"turkey sausage","quantity":12,"unit":"oz"},{"name":"eggs","quantity":4,"unit":"whole"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"baby spinach","quantity":2,"unit":"cups"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"paprika","quantity":1,"unit":"tsp"},{"name":"parsley","quantity":2,"unit":"tbsp"}]',
    '[{"instruction":"Dice the sweet potatoes and roast with olive oil and paprika until tender.","ingredients":["sweet potato","olive oil","paprika"],"estimated_duration_minutes":25},{"instruction":"Cook the turkey sausage until browned.","ingredients":["turkey sausage"],"estimated_duration_minutes":8},{"instruction":"Saute the onion, bell pepper, garlic, and spinach until softened.","ingredients":["yellow onion","red bell pepper","garlic","baby spinach"],"estimated_duration_minutes":8},{"instruction":"Combine the vegetables, sausage, and roasted sweet potatoes in a skillet. Crack the eggs over the top.","ingredients":["eggs"],"estimated_duration_minutes":3},{"instruction":"Cover and cook until the eggs reach the desired doneness. Garnish with parsley.","ingredients":["parsley"],"estimated_duration_minutes":6}]',
    '{"calories":460,"protein_g":28,"carbs_g":27,"fat_g":26,"explanation":"A protein-rich breakfast featuring complex carbohydrates and plenty of vegetables."}',
    ARRAY['Large skillet','Sheet pan','Chef''s knife'],
    4,
    'american',
    'breakfast',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000034',
    '44444444-4444-4444-4444-444444444444',
    'Grilled Steak Fajita Bowls',
    'Marinated steak served over cilantro lime rice with sauteed peppers and onions.',
    '[{"name":"flank steak","quantity":1.5,"unit":"lb"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"green bell pepper","quantity":1,"unit":"whole"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"lime","quantity":2,"unit":"whole"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"chili powder","quantity":2,"unit":"tsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Marinate the steak with olive oil, garlic, chili powder, cumin, and lime juice.","ingredients":["flank steak","olive oil","garlic","chili powder","ground cumin","lime"],"estimated_duration_minutes":30},{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Grill or sear the steak, then let it rest before slicing thinly.","ingredients":["flank steak"],"estimated_duration_minutes":10},{"instruction":"Saute the peppers and onion until lightly caramelized.","ingredients":["red bell pepper","green bell pepper","yellow onion"],"estimated_duration_minutes":8},{"instruction":"Mix chopped cilantro and lime juice into the rice, then assemble the bowls with steak and vegetables.","ingredients":["cilantro"],"estimated_duration_minutes":4}]',
    '{"calories":640,"protein_g":40,"carbs_g":45,"fat_g":29,"explanation":"A balanced Tex-Mex inspired meal packed with lean protein, vegetables, and fresh herbs."}',
    ARRAY['Grill pan','Rice cooker','Large skillet','Chef''s knife'],
    4,
    'mexican',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000035',
    '55555555-5555-5555-5555-555555555555',
    'Miso Glazed Cod with Sesame Bok Choy',
    'Flaky cod glazed with a savory miso sauce served alongside jasmine rice and sesame bok choy.',
    '[{"name":"cod fillets","quantity":1.5,"unit":"lb"},{"name":"white miso paste","quantity":2,"unit":"tbsp"},{"name":"soy sauce","quantity":2,"unit":"tbsp"},{"name":"honey","quantity":1,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"baby bok choy","quantity":4,"unit":"heads"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"green onions","quantity":3,"unit":"whole"},{"name":"sesame seeds","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Whisk together the miso paste, soy sauce, honey, sesame oil, garlic, and ginger.","ingredients":["white miso paste","soy sauce","honey","sesame oil","garlic","ginger"],"estimated_duration_minutes":5},{"instruction":"Brush the cod with the glaze and bake until it flakes easily with a fork.","ingredients":["cod fillets"],"estimated_duration_minutes":15},{"instruction":"Saute the bok choy until just tender.","ingredients":["baby bok choy"],"estimated_duration_minutes":6},{"instruction":"Serve the cod over rice and garnish with green onions and sesame seeds.","ingredients":["green onions","sesame seeds"],"estimated_duration_minutes":2}]',
    '{"calories":510,"protein_g":39,"carbs_g":38,"fat_g":19,"explanation":"A lean seafood dinner rich in protein and omega-3 fatty acids with a flavorful umami glaze."}',
    ARRAY['Sheet pan','Small bowl','Large skillet','Rice cooker'],
    4,
    'japanese',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000036',
    '11111111-1111-1111-1111-111111111111',
    'Beef & Sweet Potato Shepherd''s Pie',
    'A comforting casserole with seasoned ground beef, vegetables, and creamy mashed sweet potatoes.',
    '[{"name":"lean ground beef","quantity":1.5,"unit":"lb"},{"name":"sweet potatoes","quantity":2,"unit":"lb"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"peas","quantity":1,"unit":"cup"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"beef broth","quantity":1,"unit":"cup"},{"name":"tomato paste","quantity":2,"unit":"tbsp"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"worcestershire sauce","quantity":1,"unit":"tbsp"},{"name":"fresh thyme","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Boil the sweet potatoes until tender, then mash until smooth.","ingredients":["sweet potatoes"],"estimated_duration_minutes":20},{"instruction":"Cook the onion, carrots, and garlic in olive oil until softened.","ingredients":["yellow onion","carrots","garlic","olive oil"],"estimated_duration_minutes":8},{"instruction":"Brown the ground beef, then stir in the tomato paste, Worcestershire sauce, beef broth, thyme, and peas.","ingredients":["lean ground beef","tomato paste","worcestershire sauce","beef broth","fresh thyme","peas"],"estimated_duration_minutes":12},{"instruction":"Spread the beef mixture into a baking dish and top with the mashed sweet potatoes.","ingredients":[],"estimated_duration_minutes":5},{"instruction":"Bake until lightly browned on top.","ingredients":[],"estimated_duration_minutes":25}]',
    '{"calories":610,"protein_g":37,"carbs_g":34,"fat_g":32,"explanation":"A comforting high-protein meal with extra fiber and vitamins from sweet potatoes and vegetables."}',
    ARRAY['Large pot','Large skillet','9x13 baking dish','Potato masher'],
    6,
    'british',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000037',
    '22222222-2222-2222-2222-222222222222',
    'Crispy Tofu Stir Fry',
    'Pan-crisped tofu tossed with colorful vegetables in a savory garlic ginger sauce.',
    '[{"name":"extra firm tofu","quantity":16,"unit":"oz"},{"name":"broccoli","quantity":2,"unit":"cups"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"snap peas","quantity":2,"unit":"cups"},{"name":"soy sauce","quantity":3,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"cornstarch","quantity":2,"unit":"tbsp"},{"name":"green onions","quantity":3,"unit":"whole"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"}]',
    '[{"instruction":"Press the tofu to remove excess moisture, then cube and coat lightly with cornstarch.","ingredients":["extra firm tofu","cornstarch"],"estimated_duration_minutes":20},{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Pan-fry the tofu until golden and crispy on all sides.","ingredients":["extra firm tofu"],"estimated_duration_minutes":10},{"instruction":"Stir-fry the broccoli, carrots, snap peas, bell pepper, garlic, and ginger before adding soy sauce and sesame oil.","ingredients":["broccoli","carrots","snap peas","red bell pepper","garlic","ginger","soy sauce","sesame oil"],"estimated_duration_minutes":8},{"instruction":"Return the tofu to the pan, toss together, and garnish with green onions before serving over rice.","ingredients":["green onions"],"estimated_duration_minutes":3}]',
    '{"calories":480,"protein_g":22,"carbs_g":45,"fat_g":22,"explanation":"A satisfying vegetarian meal featuring complete plant protein and plenty of colorful vegetables."}',
    ARRAY['Wok','Rice cooker','Large skillet','Chef''s knife'],
    4,
    'asian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000038',
    '33333333-3333-3333-3333-333333333333',
    'Grilled Tilapia with Mango Salsa',
    'Lightly seasoned grilled tilapia topped with fresh mango salsa and served with cilantro lime rice.',
    '[{"name":"tilapia fillets","quantity":1.5,"unit":"lb"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"mango","quantity":1,"unit":"whole"},{"name":"red bell pepper","quantity":0.5,"unit":"whole"},{"name":"red onion","quantity":0.25,"unit":"whole"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"lime","quantity":2,"unit":"whole"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"ground cumin","quantity":1,"unit":"tsp"},{"name":"paprika","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Cook the jasmine rice according to package directions.","ingredients":["jasmine rice"],"estimated_duration_minutes":20},{"instruction":"Combine the diced mango, bell pepper, red onion, cilantro, and lime juice to make the salsa.","ingredients":["mango","red bell pepper","red onion","cilantro","lime"],"estimated_duration_minutes":10},{"instruction":"Season the tilapia with garlic, cumin, paprika, salt, and pepper.","ingredients":["tilapia fillets","garlic","ground cumin","paprika"],"estimated_duration_minutes":5},{"instruction":"Grill or pan-sear the tilapia until it flakes easily with a fork.","ingredients":["tilapia fillets","olive oil"],"estimated_duration_minutes":8},{"instruction":"Serve over cilantro lime rice and top with the fresh mango salsa.","ingredients":[],"estimated_duration_minutes":2}]',
    '{"calories":470,"protein_g":36,"carbs_g":39,"fat_g":16,"explanation":"A light seafood dinner featuring lean protein, fresh fruit, and whole-grain carbohydrates."}',
    ARRAY['Grill pan','Rice cooker','Mixing bowl','Chef''s knife'],
    4,
    'caribbean',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000039',
    '44444444-4444-4444-4444-444444444444',
    'Caprese Chicken',
    'Juicy chicken breasts baked with fresh mozzarella, tomatoes, basil, and a balsamic glaze.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"fresh mozzarella","quantity":8,"unit":"oz"},{"name":"roma tomatoes","quantity":3,"unit":"whole"},{"name":"fresh basil","quantity":0.25,"unit":"cup"},{"name":"balsamic glaze","quantity":2,"unit":"tbsp"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"italian seasoning","quantity":2,"unit":"tsp"},{"name":"salt","quantity":1,"unit":"tsp"},{"name":"black pepper","quantity":0.5,"unit":"tsp"}]',
    '[{"instruction":"Season the chicken with Italian seasoning, salt, pepper, and minced garlic.","ingredients":["chicken breast","italian seasoning","garlic","salt","black pepper"],"estimated_duration_minutes":5},{"instruction":"Sear the chicken in olive oil until lightly browned.","ingredients":["olive oil"],"estimated_duration_minutes":6},{"instruction":"Top each chicken breast with sliced tomatoes and fresh mozzarella.","ingredients":["roma tomatoes","fresh mozzarella"],"estimated_duration_minutes":4},{"instruction":"Bake until the chicken reaches 165°F and the cheese is melted.","ingredients":[],"estimated_duration_minutes":18},{"instruction":"Finish with basil and drizzle with balsamic glaze before serving.","ingredients":["fresh basil","balsamic glaze"],"estimated_duration_minutes":2}]',
    '{"calories":540,"protein_g":47,"carbs_g":8,"fat_g":34,"explanation":"A high-protein Italian-inspired dinner with healthy fats and fresh herbs."}',
    ARRAY['Oven-safe skillet','Chef''s knife','Cutting board'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000040',
    '55555555-5555-5555-5555-555555555555',
    'Roasted Vegetable Quinoa Salad',
    'A hearty quinoa salad with roasted vegetables, feta cheese, and a lemon herb vinaigrette.',
    '[{"name":"quinoa","quantity":1.5,"unit":"cups"},{"name":"zucchini","quantity":2,"unit":"whole"},{"name":"red bell pepper","quantity":1,"unit":"whole"},{"name":"red onion","quantity":0.5,"unit":"whole"},{"name":"cherry tomatoes","quantity":1.5,"unit":"cups"},{"name":"feta cheese","quantity":0.5,"unit":"cup"},{"name":"olive oil","quantity":3,"unit":"tbsp"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"parsley","quantity":0.25,"unit":"cup"},{"name":"oregano","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Cook the quinoa according to package directions and let it cool slightly.","ingredients":["quinoa"],"estimated_duration_minutes":20},{"instruction":"Roast the zucchini, bell pepper, red onion, and cherry tomatoes with olive oil until tender.","ingredients":["zucchini","red bell pepper","red onion","cherry tomatoes","olive oil"],"estimated_duration_minutes":25},{"instruction":"Whisk together lemon juice, garlic, oregano, olive oil, salt, and pepper to create the vinaigrette.","ingredients":["lemon","garlic","oregano"],"estimated_duration_minutes":5},{"instruction":"Combine the quinoa, roasted vegetables, feta cheese, and vinaigrette.","ingredients":["feta cheese"],"estimated_duration_minutes":5},{"instruction":"Garnish with chopped parsley before serving.","ingredients":["parsley"],"estimated_duration_minutes":2}]',
    '{"calories":450,"protein_g":16,"carbs_g":43,"fat_g":24,"explanation":"A satisfying vegetarian lunch rich in whole grains, vegetables, and heart-healthy fats."}',
    ARRAY['Sheet pan','Medium saucepan','Mixing bowl','Whisk'],
    4,
    'mediterranean',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000041',
    '11111111-1111-1111-1111-111111111111',
    'Chicken Burrito Bowls',
    'Meal-prep friendly burrito bowls with cilantro lime rice, seasoned chicken, black beans, and corn.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"jasmine rice","quantity":1.5,"unit":"cups"},{"name":"black beans","quantity":1,"unit":"can"},{"name":"corn","quantity":1,"unit":"cup"},{"name":"roma tomatoes","quantity":2,"unit":"whole"},{"name":"avocado","quantity":1,"unit":"whole"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"lime","quantity":2,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"chili powder","quantity":2,"unit":"tsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Season the chicken with chili powder, cumin, garlic, salt, and pepper.","ingredients":["chicken breast","chili powder","ground cumin","garlic"],"estimated_duration_minutes":5},{"instruction":"Cook the jasmine rice according to package directions, then stir in lime juice and chopped cilantro.","ingredients":["jasmine rice","lime","cilantro"],"estimated_duration_minutes":20},{"instruction":"Grill or saute the chicken until fully cooked, then slice into strips.","ingredients":["chicken breast","olive oil"],"estimated_duration_minutes":12},{"instruction":"Warm the black beans and corn.","ingredients":["black beans","corn"],"estimated_duration_minutes":5},{"instruction":"Assemble bowls with rice, chicken, beans, corn, tomatoes, avocado, and garnish with extra cilantro.","ingredients":["roma tomatoes","avocado"],"estimated_duration_minutes":5}]',
    '{"calories":595,"protein_g":42,"carbs_g":47,"fat_g":23,"explanation":"An excellent meal-prep option with lean protein, complex carbohydrates, and fiber-rich beans."}',
    ARRAY['Large skillet','Rice cooker','Chef''s knife','Mixing bowl'],
    4,
    'mexican',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000042',
    '22222222-2222-2222-2222-222222222222',
    'Slow Cooker Beef Stew',
    'Tender beef simmered with potatoes, carrots, celery, and herbs in a rich broth.',
    '[{"name":"beef chuck roast","quantity":2,"unit":"lb"},{"name":"baby potatoes","quantity":1.5,"unit":"lb"},{"name":"carrots","quantity":3,"unit":"whole"},{"name":"celery","quantity":3,"unit":"stalks"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"beef broth","quantity":4,"unit":"cups"},{"name":"tomato paste","quantity":2,"unit":"tbsp"},{"name":"worcestershire sauce","quantity":1,"unit":"tbsp"},{"name":"fresh thyme","quantity":2,"unit":"tsp"},{"name":"olive oil","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Cut the beef into bite-sized pieces and season with salt and pepper.","ingredients":["beef chuck roast"],"estimated_duration_minutes":10},{"instruction":"Brown the beef in olive oil, then transfer to the slow cooker.","ingredients":["beef chuck roast","olive oil"],"estimated_duration_minutes":8},{"instruction":"Add the potatoes, carrots, celery, onion, garlic, broth, tomato paste, Worcestershire sauce, and thyme.","ingredients":["baby potatoes","carrots","celery","yellow onion","garlic","beef broth","tomato paste","worcestershire sauce","fresh thyme"],"estimated_duration_minutes":10},{"instruction":"Cook on LOW for 8 hours or HIGH for 4 hours until the beef is fork tender.","ingredients":[],"estimated_duration_minutes":480},{"instruction":"Taste, adjust seasoning, and serve hot.","ingredients":[],"estimated_duration_minutes":5}]',
    '{"calories":560,"protein_g":44,"carbs_g":27,"fat_g":30,"explanation":"A hearty slow-cooked dinner with tender beef, vegetables, and rich flavor thats perfect for leftovers."}',
    ARRAY['Slow cooker','Large skillet','Chef''s knife','Cutting board'],
    6,
    'american',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000043',
    '33333333-3333-3333-3333-333333333333',
    'Egg Roll in a Bowl',
    'A quick one-pan dinner with ground turkey, cabbage, carrots, and an Asian-inspired garlic ginger sauce.',
    '[{"name":"ground turkey","quantity":1.5,"unit":"lb"},{"name":"green cabbage","quantity":0.5,"unit":"head"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"green onions","quantity":4,"unit":"whole"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"ginger","quantity":1,"unit":"tbsp"},{"name":"soy sauce","quantity":3,"unit":"tbsp"},{"name":"sesame oil","quantity":1,"unit":"tbsp"},{"name":"rice vinegar","quantity":1,"unit":"tbsp"},{"name":"sesame seeds","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Brown the ground turkey in a large skillet.","ingredients":["ground turkey"],"estimated_duration_minutes":8},{"instruction":"Add the garlic, ginger, carrots, and cabbage. Cook until the vegetables soften.","ingredients":["garlic","ginger","carrots","green cabbage"],"estimated_duration_minutes":8},{"instruction":"Stir in the soy sauce, sesame oil, and rice vinegar.","ingredients":["soy sauce","sesame oil","rice vinegar"],"estimated_duration_minutes":3},{"instruction":"Cook until most of the liquid has evaporated.","ingredients":[],"estimated_duration_minutes":4},{"instruction":"Top with green onions and sesame seeds before serving.","ingredients":["green onions","sesame seeds"],"estimated_duration_minutes":2}]',
    '{"calories":430,"protein_g":34,"carbs_g":14,"fat_g":24,"explanation":"A low-carb, high-protein one-pan meal packed with vegetables and bold flavor."}',
    ARRAY['Large skillet','Wooden spoon','Chef''s knife'],
    4,
    'asian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000044',
    '44444444-4444-4444-4444-444444444444',
    'Turkey Meatballs with Roasted Vegetables',
    'Lean turkey meatballs served with roasted broccoli, carrots, and garlic parmesan potatoes.',
    '[{"name":"ground turkey","quantity":1.5,"unit":"lb"},{"name":"eggs","quantity":1,"unit":"whole"},{"name":"breadcrumbs","quantity":0.5,"unit":"cup"},{"name":"parmesan cheese","quantity":0.5,"unit":"cup"},{"name":"garlic","quantity":4,"unit":"cloves"},{"name":"fresh parsley","quantity":0.25,"unit":"cup"},{"name":"baby potatoes","quantity":1.5,"unit":"lb"},{"name":"broccoli","quantity":3,"unit":"cups"},{"name":"carrots","quantity":3,"unit":"whole"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"italian seasoning","quantity":2,"unit":"tsp"}]',
    '[{"instruction":"Mix the ground turkey, egg, breadcrumbs, parmesan, parsley, garlic, Italian seasoning, salt, and pepper before forming meatballs.","ingredients":["ground turkey","eggs","breadcrumbs","parmesan cheese","fresh parsley","garlic","italian seasoning"],"estimated_duration_minutes":12},{"instruction":"Roast the potatoes, broccoli, and carrots with olive oil until tender.","ingredients":["baby potatoes","broccoli","carrots","olive oil"],"estimated_duration_minutes":30},{"instruction":"Bake the meatballs until fully cooked.","ingredients":[],"estimated_duration_minutes":20},{"instruction":"Serve the meatballs alongside the roasted vegetables.","ingredients":[],"estimated_duration_minutes":3}]',
    '{"calories":560,"protein_g":40,"carbs_g":29,"fat_g":29,"explanation":"An excellent meal-prep dinner with lean protein, roasted vegetables, and pantry-friendly ingredients."}',
    ARRAY['Sheet pan','Large mixing bowl','Baking sheet'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000045',
    '55555555-5555-5555-5555-555555555555',
    'Sheet Pan Sausage and Vegetables',
    'Italian sausage roasted with colorful vegetables for an easy weeknight dinner.',
    '[{"name":"italian sausage","quantity":1.25,"unit":"lb"},{"name":"broccoli","quantity":3,"unit":"cups"},{"name":"zucchini","quantity":2,"unit":"whole"},{"name":"red bell pepper","quantity":2,"unit":"whole"},{"name":"red onion","quantity":1,"unit":"whole"},{"name":"baby potatoes","quantity":1.5,"unit":"lb"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"italian seasoning","quantity":2,"unit":"tsp"},{"name":"parmesan cheese","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Preheat the oven and chop all vegetables into bite-sized pieces.","ingredients":["broccoli","zucchini","red bell pepper","red onion","baby potatoes"],"estimated_duration_minutes":12},{"instruction":"Toss the vegetables with olive oil, garlic, Italian seasoning, salt, and pepper.","ingredients":["olive oil","garlic","italian seasoning"],"estimated_duration_minutes":5},{"instruction":"Arrange the sausage and vegetables on a sheet pan.","ingredients":["italian sausage"],"estimated_duration_minutes":3},{"instruction":"Roast until the vegetables are tender and the sausage reaches a safe internal temperature.","ingredients":[],"estimated_duration_minutes":35},{"instruction":"Sprinkle with parmesan cheese before serving.","ingredients":["parmesan cheese"],"estimated_duration_minutes":2}]',
    '{"calories":620,"protein_g":28,"carbs_g":30,"fat_g":41,"explanation":"A simple one-pan dinner with minimal cleanup and plenty of roasted vegetables."}',
    ARRAY['Large sheet pan','Mixing bowl','Chef''s knife'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000046',
    '11111111-1111-1111-1111-111111111111',
    'Shrimp Tacos with Cabbage Slaw',
    'Seasoned shrimp tucked into warm tortillas with crunchy cabbage slaw and avocado.',
    '[{"name":"shrimp","quantity":1.5,"unit":"lb"},{"name":"corn tortillas","quantity":8,"unit":"whole"},{"name":"green cabbage","quantity":0.5,"unit":"head"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"},{"name":"lime","quantity":2,"unit":"whole"},{"name":"cilantro","quantity":0.25,"unit":"cup"},{"name":"avocado","quantity":1,"unit":"whole"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"},{"name":"chili powder","quantity":2,"unit":"tsp"},{"name":"ground cumin","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Mix the cabbage, shredded carrots, Greek yogurt, lime juice, and a pinch of salt to make the slaw.","ingredients":["green cabbage","carrots","greek yogurt","lime"],"estimated_duration_minutes":10},{"instruction":"Season the shrimp with chili powder, cumin, garlic, salt, and pepper.","ingredients":["shrimp","chili powder","ground cumin","garlic"],"estimated_duration_minutes":5},{"instruction":"Cook the shrimp in olive oil until pink and opaque.","ingredients":["olive oil"],"estimated_duration_minutes":5},{"instruction":"Warm the tortillas.","ingredients":["corn tortillas"],"estimated_duration_minutes":2},{"instruction":"Assemble the tacos with shrimp, slaw, avocado, and fresh cilantro.","ingredients":["avocado","cilantro"],"estimated_duration_minutes":5}]',
    '{"calories":500,"protein_g":35,"carbs_g":34,"fat_g":21,"explanation":"A fresh seafood dinner with lean protein, crisp vegetables, and heart-healthy fats."}',
    ARRAY['Large skillet','Mixing bowl','Chef''s knife'],
    4,
    'mexican',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000047',
    '22222222-2222-2222-2222-222222222222',
    'Chicken Caesar Salad',
    'Grilled chicken served over crisp romaine with homemade Caesar dressing, parmesan, and croutons.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"romaine lettuce","quantity":2,"unit":"heads"},{"name":"parmesan cheese","quantity":0.75,"unit":"cup"},{"name":"croutons","quantity":2,"unit":"cups"},{"name":"greek yogurt","quantity":0.5,"unit":"cup"},{"name":"dijon mustard","quantity":1,"unit":"tsp"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"worcestershire sauce","quantity":1,"unit":"tsp"}]',
    '[{"instruction":"Season the chicken with salt and pepper, then grill until cooked through before slicing.","ingredients":["chicken breast"],"estimated_duration_minutes":15},{"instruction":"Whisk together the Greek yogurt, parmesan, Dijon mustard, lemon juice, garlic, Worcestershire sauce, and olive oil to make the dressing.","ingredients":["greek yogurt","parmesan cheese","dijon mustard","lemon","garlic","worcestershire sauce","olive oil"],"estimated_duration_minutes":8},{"instruction":"Chop the romaine into bite-sized pieces.","ingredients":["romaine lettuce"],"estimated_duration_minutes":4},{"instruction":"Toss the romaine with the dressing, parmesan, and croutons.","ingredients":["croutons"],"estimated_duration_minutes":3},{"instruction":"Top with sliced grilled chicken and serve immediately.","ingredients":[],"estimated_duration_minutes":2}]',
    '{"calories":510,"protein_g":42,"carbs_g":19,"fat_g":29,"explanation":"A high-protein lunch with crisp vegetables and a lighter yogurt-based Caesar dressing."}',
    ARRAY['Grill pan','Large salad bowl','Whisk','Chef''s knife'],
    4,
    'american',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000048',
    '33333333-3333-3333-3333-333333333333',
    'Mushroom Barley Soup',
    'A hearty vegetarian soup with mushrooms, pearl barley, carrots, celery, and fresh herbs.',
    '[{"name":"cremini mushrooms","quantity":16,"unit":"oz"},{"name":"pearl barley","quantity":1,"unit":"cup"},{"name":"carrots","quantity":2,"unit":"whole"},{"name":"celery","quantity":2,"unit":"stalks"},{"name":"yellow onion","quantity":1,"unit":"whole"},{"name":"garlic","quantity":3,"unit":"cloves"},{"name":"vegetable broth","quantity":6,"unit":"cups"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"fresh thyme","quantity":2,"unit":"tsp"},{"name":"fresh parsley","quantity":0.25,"unit":"cup"}]',
    '[{"instruction":"Saute the onion, carrots, celery, garlic, and mushrooms in olive oil until softened.","ingredients":["yellow onion","carrots","celery","garlic","cremini mushrooms","olive oil"],"estimated_duration_minutes":12},{"instruction":"Add the pearl barley and stir for one minute.","ingredients":["pearl barley"],"estimated_duration_minutes":2},{"instruction":"Pour in the vegetable broth and add the thyme.","ingredients":["vegetable broth","fresh thyme"],"estimated_duration_minutes":2},{"instruction":"Simmer until the barley is tender.","ingredients":[],"estimated_duration_minutes":40},{"instruction":"Garnish with chopped parsley before serving.","ingredients":["fresh parsley"],"estimated_duration_minutes":2}]',
    '{"calories":320,"protein_g":11,"carbs_g":48,"fat_g":10,"explanation":"A budget-friendly vegetarian soup thats rich in fiber, whole grains, and vegetables."}',
    ARRAY['Dutch oven','Wooden spoon','Chef''s knife'],
    6,
    'american',
    'lunch',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000049',
    '44444444-4444-4444-4444-444444444444',
    'Pesto Chicken Pasta',
    'Grilled chicken tossed with whole wheat pasta, basil pesto, spinach, and cherry tomatoes.',
    '[{"name":"chicken breast","quantity":1.5,"unit":"lb"},{"name":"whole wheat penne","quantity":12,"unit":"oz"},{"name":"basil pesto","quantity":0.5,"unit":"cup"},{"name":"baby spinach","quantity":3,"unit":"cups"},{"name":"cherry tomatoes","quantity":2,"unit":"cups"},{"name":"parmesan cheese","quantity":0.5,"unit":"cup"},{"name":"garlic","quantity":2,"unit":"cloves"},{"name":"olive oil","quantity":1,"unit":"tbsp"}]',
    '[{"instruction":"Cook the whole wheat penne until al dente.","ingredients":["whole wheat penne"],"estimated_duration_minutes":12},{"instruction":"Season and cook the chicken until fully cooked, then slice into strips.","ingredients":["chicken breast","garlic","olive oil"],"estimated_duration_minutes":15},{"instruction":"Toss the warm pasta with the pesto until evenly coated.","ingredients":["basil pesto"],"estimated_duration_minutes":2},{"instruction":"Fold in the spinach, cherry tomatoes, and sliced chicken.","ingredients":["baby spinach","cherry tomatoes"],"estimated_duration_minutes":3},{"instruction":"Top with parmesan cheese before serving.","ingredients":["parmesan cheese"],"estimated_duration_minutes":2}]',
    '{"calories":610,"protein_g":41,"carbs_g":44,"fat_g":28,"explanation":"A flavorful weeknight pasta that balances lean protein with whole grains and vegetables."}',
    ARRAY['Large pot','Large skillet','Wooden spoon'],
    4,
    'italian',
    'dinner',
    true
),
(
    'aaaaaaaa-0000-0000-0000-000000000050',
    '55555555-5555-5555-5555-555555555555',
    'Garlic Butter Ribeye with Roasted Brussels Sprouts',
    'A premium steak dinner featuring pan-seared ribeye, garlic herb butter, roasted Brussels sprouts, and crispy baby potatoes.',
    '[{"name":"ribeye steak","quantity":2,"unit":"lb"},{"name":"brussels sprouts","quantity":1.5,"unit":"lb"},{"name":"baby potatoes","quantity":1.5,"unit":"lb"},{"name":"unsalted butter","quantity":4,"unit":"tbsp"},{"name":"garlic","quantity":5,"unit":"cloves"},{"name":"fresh rosemary","quantity":2,"unit":"sprigs"},{"name":"fresh thyme","quantity":2,"unit":"sprigs"},{"name":"olive oil","quantity":2,"unit":"tbsp"},{"name":"lemon","quantity":1,"unit":"whole"},{"name":"fresh parsley","quantity":0.25,"unit":"cup"},{"name":"black pepper","quantity":1,"unit":"tsp"},{"name":"salt","quantity":1.5,"unit":"tsp"}]',
    '[{"instruction":"Preheat the oven to 425°F. Toss the Brussels sprouts and baby potatoes with olive oil, salt, and pepper, then spread onto a sheet pan.","ingredients":["brussels sprouts","baby potatoes","olive oil","salt","black pepper"],"estimated_duration_minutes":8},{"instruction":"Roast the vegetables until browned and tender, flipping halfway through.","ingredients":[],"estimated_duration_minutes":35},{"instruction":"Pat the ribeye steaks dry and season generously with salt and black pepper.","ingredients":["ribeye steak","salt","black pepper"],"estimated_duration_minutes":5},{"instruction":"Heat a large cast iron skillet over high heat. Sear the steaks for 3 to 5 minutes per side. Add the butter, garlic, rosemary, and thyme, then continuously spoon the melted herb butter over the steaks until they reach the desired doneness.","ingredients":["unsalted butter","garlic","fresh rosemary","fresh thyme"],"estimated_duration_minutes":10},{"instruction":"Rest the steaks for 10 minutes. Finish the vegetables with lemon juice and parsley, then serve alongside the steaks with the remaining garlic butter.","ingredients":["lemon","fresh parsley"],"estimated_duration_minutes":10}]',
    '{"calories":890,"protein_g":54,"carbs_g":31,"fat_g":61,"explanation":"A premium steakhouse-style dinner that is intentionally higher in cost, making it an excellent candidate for budget optimization when generating meal plans."}',
    ARRAY['Cast iron skillet','Large sheet pan','Tongs','Instant-read thermometer','Chef''s knife'],
    4,
    'american',
    'dinner',
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

-- ============================================================
-- CURRENT MONTH'S TEST PLAN (For testing the dashboard widget)
-- Spans from today through the next 30 days
-- ============================================================
insert into public.meal_plans (id, user_id, title)
values (
  'bbbbbbbb-0000-0000-0000-000000000006', 
  '11111111-1111-1111-1111-111111111111', 
  'Current Month Test Plan'
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
-- Today's Breakfast - Pancakes
(
    'cccccccc-0000-0000-0000-000000000010',
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000003',
    2,
    CURRENT_DATE,
    'breakfast'
),

-- Today's Dinner - Spaghetti Bolognese
(
    'cccccccc-0000-0000-0000-000000000011',
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000005',
    4,
    CURRENT_DATE,
    'dinner'
),

-- Tomorrow's Lunch - Caesar Salad
(
    'cccccccc-0000-0000-0000-000000000012',
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000006',
    2,
    CURRENT_DATE + 1,
    'lunch'
),

-- Next Week's Dinner - Veggie Stir Fry
(
    'cccccccc-0000-0000-0000-000000000013',
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000001',
    2,
    CURRENT_DATE + 7,
    'dinner'
),

-- End of the month Breakfast - Banana Oat Muffins
(
    'cccccccc-0000-0000-0000-000000000014',
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000012',
    1,
    CURRENT_DATE + 30,
    'breakfast'
);