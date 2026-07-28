// Shared dietary options — used by the profile form and onboarding flow.
export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
  'Low-Carb',
]

// Recipe meal and cuisine types, use by recipe generation and search/browse
export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'snack',
] as const
export type MealType = (typeof MEAL_TYPES)[number]

export const CUISINE_TYPES = [
  'American',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Mediterranean',
  'Mexican',
  'Thai',
]
