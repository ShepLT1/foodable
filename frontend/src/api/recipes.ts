import { api } from './api'

export interface Ingredient {
  name: string
  quantity: number
  unit: string | null
}

export interface Step {
  instruction: string
  ingredients: string[]
  estimated_duration_minutes: number | null
}

export interface NutritionInfo {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  explanation: string
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  description: string | null
  meal_type: string | null
  cuisine_type: string | null
  servings: number
  tools_needed: string[]
  steps: Step[]
  ingredients: Ingredient[]
  nutrition: NutritionInfo
  is_public: boolean
  created_at: string
}

export interface GenerateRecipeRequest {
  ingredients: string[]
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'
  cuisine_type?: string
}

// Recipe API request handlers
export function generateRecipe(data: GenerateRecipeRequest) {
  return api<Recipe>('/recipes/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
