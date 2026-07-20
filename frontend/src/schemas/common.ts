import { z } from 'zod'

// Shared UUID validation (for database IDs)
export const idSchema = z.string().uuid('Invalid ID format')

// Standard ISO date-string validation (e.g., "2026-07-20")
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

// Reusable trimmed non-empty string generator helper
export const requiredTrimmedString = (minMsg: string, maxLen = 255) =>
  z
    .string()
    .trim()
    .min(1, minMsg)
    .max(maxLen, `Must be ${maxLen} characters or fewer`)
