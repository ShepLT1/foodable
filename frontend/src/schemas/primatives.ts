import { z } from 'zod'

// List Titles (used in GroceryListHeader, EditableTitle, etc.)
export const listTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title cannot be empty')
  .max(100, 'Title must be 100 characters or fewer')

// Ingredient & Item Names (used in GroceryListItemRow, NewGroceryListItemRow)
export const ingredientNameSchema = z
  .string()
  .trim()
  .min(1, 'Ingredient name is required')
  .max(150, 'Ingredient name is too long')

// Quantities & Units
export const quantitySchema = z
  .number({ message: 'Must be a number' })
  .positive('Quantity must be greater than 0')
  .max(9999, 'Quantity is too large')
  .nullable()
  .optional()

export const unitSchema = z
  .string()
  .trim()
  .max(30, 'Unit must be 30 characters or fewer')
  .optional()

// Tags & Categories
export const tagSchema = z
  .string()
  .trim()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag name is too long')