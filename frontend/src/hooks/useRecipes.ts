import { useMutation, useQuery } from '@tanstack/react-query'
import {
  generateRecipe,
  getRecipe,
  searchRecipes,
  RecipeSearchParams,
} from '../api/recipes'

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

export function useSearchRecipes(params: RecipeSearchParams) {
  return useQuery({
    queryKey: ['recipes', 'search', params],
    queryFn: () => searchRecipes(params),
  })
}
