import { z } from 'zod'
import { idSchema } from './common'
import { ingredientNameSchema, quantitySchema, unitSchema } from './grocery'

export const recipeTitleSchema = z
  .string()
  .trim()
  .min(1, 'Recipe title is required')
  .max(120, 'Title must be 120 characters or fewer')

export const instructionStepSchema = z
  .string()
  .trim()
  .min(3, 'Instruction step is too short')

export const recipeIngredientSchema = z.object({
  name: ingredientNameSchema,
  quantity: quantitySchema,
  unit: unitSchema,
})

export const recipeSchema = z.object({
  id: idSchema.optional(),
  title: recipeTitleSchema,
  description: z.string().trim().max(500, 'Description too long').optional(),
  prepTimeMinutes: z.coerce.number().int().nonnegative().optional(),
  cookTimeMinutes: z.coerce.number().int().nonnegative().optional(),
  servings: z.coerce
    .number()
    .int()
    .positive('Must serve at least 1')
    .default(1),
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, 'At least 1 ingredient required'),
  instructions: z
    .array(instructionStepSchema)
    .min(1, 'At least 1 instruction step required'),
})

export type RecipeInput = z.infer<typeof recipeSchema>
export type RecipeIngredientInput = z.infer<typeof recipeIngredientSchema>
