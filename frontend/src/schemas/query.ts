import { z } from 'zod'

export const searchParamsSchema = z.object({
  query: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['title', 'created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type SearchParamsInput = z.infer<typeof searchParamsSchema>
