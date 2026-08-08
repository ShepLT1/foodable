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
  is_favorited: boolean
  creator: {
    id: string
    display_name: string | null
  } | null
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
  following_only?: boolean
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

export interface RecipesByUserParams {
  page?: number
  limit?: number
}

export function getRecipesByUser(
  userId: string,
  params: RecipesByUserParams = {},
) {
  const queryString = buildQueryString(params)

  return api<PaginatedRecipes>(
    `/users/${userId}/recipes${queryString ? `?${queryString}` : ''}`,
  )
}

export interface RecipeUpdate {
  is_public?: boolean
}

export function updateRecipe(recipeId: string, data: RecipeUpdate) {
  return api<Recipe>(`/recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
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
export interface MyFavoriteRecipesParams {
  page?: number
  limit?: number
}

export function getMyFavoriteRecipes(params: MyFavoriteRecipesParams = {}) {
  const queryString = buildQueryString(params)

  return api<PaginatedRecipes>(
    `/recipes/favorites${queryString ? `?${queryString}` : ''}`,
  )
}

export interface FavoriteActionResponse {
  success: boolean
  message: string
}

export function favoriteRecipe(recipeId: string) {
  return api<FavoriteActionResponse>(`/recipes/${recipeId}/favorite`, {
    method: 'POST',
  })
}

export function unfavoriteRecipe(recipeId: string) {
  return api<FavoriteActionResponse>(`/recipes/${recipeId}/favorite`, {
    method: 'DELETE',
  })
}
