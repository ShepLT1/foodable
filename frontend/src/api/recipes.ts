import { api } from './client'

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

export interface RecipeSearchParams {
  q?: string
  cuisine_type?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'
  exclude_own?: boolean
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'title'
  order?: 'asc' | 'desc'
}

export interface RecipeSearchResponse {
  items: Recipe[]
  total: number
  page: number
  limit: number
}

export function getRecipe(recipeId: string) {
  return api<Recipe>(`/recipes/${recipeId}`)
}

// Recipe API request handlers
export function generateRecipe(data: GenerateRecipeRequest) {
  return api<Recipe>('/recipes/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function searchRecipes(params: RecipeSearchParams = {}) {
  const query = new URLSearchParams()

  if (params.q) query.set('q', params.q)
  if (params.cuisine_type) query.set('cuisine_type', params.cuisine_type)
  if (params.meal_type) query.set('meal_type', params.meal_type)
  if (params.exclude_own) query.set('exclude_own', String(params.exclude_own))
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.order) query.set('order', params.order)

  const queryString = query.toString()
  return api<RecipeSearchResponse>(
    `/recipes${queryString ? `?${queryString}` : ''}`,
  )
}
