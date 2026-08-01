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
  creator: {
    id: string
    display_name: string | null
  } | null
  created_at: string
}

export interface PaginatedRecipes {
  items: Recipe[]
  total: number
  limit: number
  offset: number
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

export interface PaginatedRecipes {
  items: Recipe[]
  total: number
  page: number
  limit: number
}

export function getRecipe(recipeId: string) {
  return api<Recipe>(`/recipes/${recipeId}`)
}

export function getRecipesByUser(
  userId: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {},
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  return api<PaginatedRecipes>(`/users/${userId}/recipes?${params}`)
}

// Recipe API request handlers
export function generateRecipe(data: GenerateRecipeRequest) {
  return api<Recipe>('/recipes/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Helper func, builds a URL query string from params
function buildQueryString<T extends object>(params: T): string {
  const query = new URLSearchParams()

  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })

  return query.toString()
}

export function searchRecipes(params: RecipeSearchParams = {}) {
  const queryString = buildQueryString(params)

  return api<PaginatedRecipes>(
    `/recipes${queryString ? `?${queryString}` : ''}`,
  )
}

export interface MyRecipesParams {
  page?: number
  limit?: number
}

export function getMyRecipes(params: MyRecipesParams = {}) {
  const queryString = buildQueryString(params)

  return api<PaginatedRecipes>(
    `/recipes/me${queryString ? `?${queryString}` : ''}`,
  )
}
