import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  favoriteRecipe,
  generateRecipe,
  getMyFavoriteRecipes,
  getMyRecipes,
  getRecipe,
  getRecipesByUser,
  searchRecipes,
  unfavoriteRecipe,
} from '../api/recipes'
import type {
  MyFavoriteRecipesParams,
  MyRecipesParams,
  PaginatedRecipes,
  Recipe,
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

export function useMyRecipes(params: MyRecipesParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['recipes', 'me', params],
    queryFn: () => getMyRecipes(params),
    enabled,
  })
}

export function useMyFavoriteRecipes(
  params: MyFavoriteRecipesParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ['recipes', 'favorites', params],
    queryFn: () => getMyFavoriteRecipes(params),
    enabled,
  })
}

// flip is_favorited wherever this recipe sits in the cache (single or paginated)
function applyFavorited(
  data: Recipe | PaginatedRecipes | undefined,
  recipeId: string,
  isFavorited: boolean,
) {
  if (!data) return data
  if ('items' in data) {
    return {
      ...data,
      items: data.items.map((r) =>
        r.id === recipeId ? { ...r, is_favorited: isFavorited } : r,
      ),
    }
  }
  return data.id === recipeId ? { ...data, is_favorited: isFavorited } : data
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      isFavorited,
    }: {
      recipeId: string
      isFavorited: boolean
    }) => (isFavorited ? favoriteRecipe(recipeId) : unfavoriteRecipe(recipeId)),

    onMutate: async ({ recipeId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] })
      const previous = queryClient.getQueriesData({ queryKey: ['recipes'] })
      queryClient.setQueriesData<Recipe | PaginatedRecipes>(
        { queryKey: ['recipes'] },
        (data) => applyFavorited(data, recipeId, isFavorited),
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
