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
  updateRecipe,
} from '../api/recipes'
import type {
  MyFavoriteRecipesParams,
  MyRecipesParams,
  RecipesByUserParams,
  PaginatedRecipes,
  Recipe,
  RecipeSearchParams,
  RecipeUpdate,
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
  params: RecipesByUserParams = {},
) {
  return useQuery({
    queryKey: ['recipes', 'by-user', userId, params],
    queryFn: () => getRecipesByUser(userId, params),
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

// patch this recipe wherever it sits in the cache (single or paginated)
function applyRecipePatch(
  data: Recipe | PaginatedRecipes | undefined,
  recipeId: string,
  patch: Partial<Recipe>,
) {
  if (!data) return data
  if ('items' in data) {
    return {
      ...data,
      items: data.items.map((r) =>
        r.id === recipeId ? { ...r, ...patch } : r,
      ),
    }
  }
  return data.id === recipeId ? { ...data, ...patch } : data
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
        (data) =>
          applyRecipePatch(data, recipeId, { is_favorited: isFavorited }),
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

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: string
      data: RecipeUpdate
    }) => updateRecipe(recipeId, data),

    onMutate: async ({ recipeId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['recipes'] })
      const previous = queryClient.getQueriesData({ queryKey: ['recipes'] })
      queryClient.setQueriesData<Recipe | PaginatedRecipes>(
        { queryKey: ['recipes'] },
        (cached) => applyRecipePatch(cached, recipeId, data),
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, cached]) => {
        queryClient.setQueryData(key, cached)
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
