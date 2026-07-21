import { z } from 'zod'
import { dateStringSchema, idSchema } from './common'

export const mealSlotEnum = z.enum(['breakfast', 'lunch', 'dinner', 'snack'])

export const mealPlanEntrySchema = z.object({
  id: idSchema.optional(),
  date: dateStringSchema,
  slot: mealSlotEnum,
  recipeId: idSchema,
  notes: z.string().trim().max(200).optional(),
})

export const mealPlanResponseSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  recipe_id: z.string().nullable().optional(),
  custom_name: z.string().nullable().optional(),
  date: z.string(),
  slot: mealSlotEnum,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // 👇 Add this so TS and Zod pass nutrition/ingredient data through!
  recipe: z.any().optional(),
})

export type MealSlot = z.infer<typeof mealSlotEnum>
export type MealPlanEntryInput = z.infer<typeof mealPlanEntrySchema>
