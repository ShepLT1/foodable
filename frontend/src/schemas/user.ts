import { z } from 'zod'

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be 50 characters or fewer')

export const bioSchema = z
  .string()
  .trim()
  .max(250, 'Bio must be under 250 characters')
  .optional()

export const avatarUrlSchema = z
  .string()
  .trim()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''))

export const userProfileSchema = z.object({
  displayName: displayNameSchema,
  bio: bioSchema,
  avatarUrl: avatarUrlSchema,
  dietaryPreferences: z.array(z.string().trim()).default([]),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>