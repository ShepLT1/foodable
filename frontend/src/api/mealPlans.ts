import { api } from './client'
import type { NutritionInfo } from './recipes'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'

export interface MealPlanMeal {
  id: string
  recipe_id: string
  recipe_title: string
  servings: number
  scheduled_date: string | null
  meal_type: MealType | null
  created_at: string
  recipe_nutrition: NutritionInfo
}

export interface MealPlan {
  id: string
  user_id: string
  title: string
  meals: MealPlanMeal[]
  created_at: string
  updated_at: string
}

export interface CreateMealPlanRequest {
  title?: string
  initial_recipe_id?: string
}

export interface CreateMealPlanMealRequest {
  recipe_id: string
}

export interface MealPlanOptimizations {
  lower_cost: boolean
  minimize_food_waste: boolean
}

export interface GenerateMealPlanRequest {
  start_date: string
  days: number
  meal_types: MealType[]
  optimizations: MealPlanOptimizations
}

interface GenerateMealPlanParams {
  mealPlanId: string
  data: GenerateMealPlanRequest
}

interface AddMealParams {
  mealPlanId: string
  data: CreateMealPlanMealRequest
}

export interface UpdateMealPlanRequest {
  title: string
}

interface UpdateMealPlanParams {
  mealPlanId: string
  data: UpdateMealPlanRequest
}

export interface UpdateMealRequest {
  servings?: number
  scheduled_date?: string | null
  meal_type?: MealType | null
}

interface UpdateMealParams {
  mealPlanId: string
  mealId: string
  data: UpdateMealRequest
}

export interface DeleteMealPlanResponse {
  id: string
}

interface DeleteMealParams {
  mealPlanId: string
  mealId: string
}

export function getMealPlans() {
  return api<MealPlan[]>('/meal-plans')
}

export function getMealPlan(mealPlanId: string) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}`)
}

export function createMealPlan(data: CreateMealPlanRequest) {
  return api<MealPlan>('/meal-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function generateMealPlan({ mealPlanId, data }: GenerateMealPlanParams) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMealPlan({ mealPlanId, data }: UpdateMealPlanParams) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteMealPlan(mealPlanId: string) {
  return api<DeleteMealPlanResponse>(`/meal-plans/${mealPlanId}`, {
    method: 'DELETE',
  })
}

export function addMealToMealPlan({ mealPlanId, data }: AddMealParams) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}/meals`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateMeal({ mealPlanId, mealId, data }: UpdateMealParams) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}/meals/${mealId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteMeal({ mealPlanId, mealId }: DeleteMealParams) {
  return api<MealPlan>(`/meal-plans/${mealPlanId}/meals/${mealId}`, {
    method: 'DELETE',
  })
}
