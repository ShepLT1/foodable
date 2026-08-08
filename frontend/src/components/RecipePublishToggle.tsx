import { Toggle } from './Toggle'
import { useUpdateRecipe } from '../hooks/useRecipes'
import type { Recipe } from '../api/recipes'

type RecipePublishToggleProps = {
  recipe: Recipe
}

export function RecipePublishToggle({ recipe }: RecipePublishToggleProps) {
  const updateRecipe = useUpdateRecipe()

  return (
    // Switch onChange has no event to guard, so the wrapper stops the click
    // from reaching a card/detail link
    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Toggle
        checked={recipe.is_public}
        onChange={(isPublic) =>
          updateRecipe.mutate({
            recipeId: recipe.id,
            data: { is_public: isPublic },
          })
        }
        label={recipe.is_public ? 'Public' : 'Private'}
        labelClassName="text-[11px] font-bold tracking-wide text-slate-400"
      />
    </div>
  )
}
