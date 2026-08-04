import { Toggle } from './Toggle'
import { useUpdateRecipe } from '../hooks/useRecipes'
import type { Recipe } from '../api/recipes'

type RecipePublishToggleProps = {
  recipe: Recipe
  label?: string
}

export function RecipePublishToggle({
  recipe,
  label = 'Public',
}: RecipePublishToggleProps) {
  const updateRecipe = useUpdateRecipe()

  return (
    <Toggle
      checked={recipe.is_public}
      onChange={(isPublic) =>
        updateRecipe.mutate({
          recipeId: recipe.id,
          data: { is_public: isPublic },
        })
      }
      label={label}
    />
  )
}
