import { z } from 'zod'
import { api } from './client'
import { mealSlotEnum } from '../schemas/mealplan'

export const mealPlanResponseSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  recipe_id: z.string().nullable().optional(),
  custom_name: z.string().nullable().optional(),
  date: z.string(),
  slot: mealSlotEnum,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const createMealPlanSchema = z.object({
  date: z.string(),
  slot: mealSlotEnum,
  recipe_id: z.string().optional(),
  custom_name: z.string().optional(),
})

export type MealPlanItem = z.infer<typeof mealPlanResponseSchema>
export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>

export async function getMealPlans(
  startDate: string,
  endDate: string,
): Promise<MealPlanItem[]> {
  const data = await api<unknown>(
    `/meal-plans?startDate=${startDate}&endDate=${endDate}`,
  )
  return z.array(mealPlanResponseSchema).parse(data)
}

export async function createMealPlan(
  data: CreateMealPlanInput,
): Promise<MealPlanItem> {
  const res = await api<unknown>('/meal-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return mealPlanResponseSchema.parse(res)
}

export async function deleteMealPlan(
  mealPlanId: string,
): Promise<{ id: string }> {
  return api<{ id: string }>(`/meal-plans/${mealPlanId}`, {
    method: 'DELETE',
  })
}