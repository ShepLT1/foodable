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

export type MealSlot = z.infer<typeof mealSlotEnum>
export type MealPlanEntryInput = z.infer<typeof mealPlanEntrySchema>