import { z } from 'zod'

// 1. Field-level primitives (exported for single input validation)
export const listTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title cannot be empty')
  .max(100, 'Title must be 100 characters or fewer')

export const ingredientNameSchema = z
  .string()
  .trim()
  .min(1, 'Ingredient name is required')
  .max(150, 'Ingredient name is too long')

export const quantitySchema = z.coerce
  .number({ message: 'Must be a number' })
  .positive('Quantity must be greater than 0')
  .max(9999, 'Quantity is too large')
  .nullable()
  .optional()

export const unitSchema = z
  .string()
  .trim()
  .max(50, 'Unit is too long')
  .nullable()
  .optional()

export const tagSchema = z
  .string()
  .trim()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag name is too long')

// 2. Composed API / Form Schemas
export const groceryItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: ingredientNameSchema,
  quantity: quantitySchema,
  category: z.string().trim().optional(),
  is_completed: z.boolean().default(false),
})

export const groceryListSchema = z.object({
  title: listTitleSchema,
  tags: z.array(tagSchema).default([]),
})

// 3. API Response Schemas (Matching FastAPI backend shape)
export const groceryListItemResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: quantitySchema,
  unit: z.string().nullable().optional(),
  checked: z.boolean().default(false),
  created_at: z.string().optional(),
})

export const groceryListResponseSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  title: z.string(),
  // Handles lists with null/undefined items and defaults them safely to []
  items: z
    .array(groceryListItemResponseSchema)
    .nullable()
    .optional()
    .transform((items) => items ?? []),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
})

// 4. Inferred TypeScript Types
export type GroceryItemInput = z.infer<typeof groceryItemSchema>
export type GroceryListInput = z.infer<typeof groceryListSchema>

export type GroceryListItem = z.infer<typeof groceryListItemResponseSchema>
export type GroceryList = z.infer<typeof groceryListResponseSchema>
