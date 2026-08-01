import { useMutation, useQuery } from '@tanstack/react-query'
import {
  generateRecipe,
  getRecipe,
  searchRecipes,
  getRecipesByUser,
} from '../api/recipes'
import type { RecipeSearchParams } from '../api/recipes'

export function useGenerateRecipe() {
  return useMutation({
    mutationFn: generateRecipe,
  })
}

export function useRecipe(recipeId: string) {
  return useQuery({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(recipeId),
    enabled: !!recipeId,
  })
}

export function useSearchRecipes(params: RecipeSearchParams, enabled = true) {
  return useQuery({
    queryKey: ['recipes', 'search', params],
    queryFn: () => searchRecipes(params),
    enabled,
  })
}
export function useRecipesByUser(
  userId: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {},
) {
  return useQuery({
    queryKey: ['recipes', 'by-user', userId, limit, offset],
    queryFn: () => getRecipesByUser(userId, { limit, offset }),
    enabled: !!userId,
  })
}
