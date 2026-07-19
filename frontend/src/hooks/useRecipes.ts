import { useMutation } from '@tanstack/react-query'
import { generateRecipe } from '../api/recipes'

export function useGenerateRecipe() {
  return useMutation({
    mutationFn: generateRecipe,
  })
}