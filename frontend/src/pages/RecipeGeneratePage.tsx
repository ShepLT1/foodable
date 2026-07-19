import { useState } from 'react'
import { TagInput } from '../components/TagInput'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { useGenerateRecipe } from '../hooks/useRecipes'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack']
const CUISINE_TYPES = [
  'Italian',
  'Mexican',
  'Thai',
  'Chinese',
  'Indian',
  'Mediterranean',
  'American',
  'French',
]

export function RecipeGeneratePage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [mealType, setMealType] = useState<string | null>(null)
  const [cuisineType, setCuisineType] = useState<string | null>(null)

  const { mutate, isPending, error, data } = useGenerateRecipe()

  function handleSubmit() {
    mutate({
      ingredients,
      meal_type: (mealType ?? undefined) as
        'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | undefined,
      cuisine_type: cuisineType ?? undefined,
    })
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900">Generate a Recipe</h2>

      <div className="mt-6 max-w-md">
        <TagInput
          label="Ingredients"
          value={ingredients}
          onChange={setIngredients}
          placeholder="Type an Ingredient and press Enter"
        />

        <SingleChipSelect
          label="Meal Type"
          options={MEAL_TYPES}
          value={mealType}
          onChange={setMealType}
        />

        <SingleChipSelect
          label="Cuisine Type"
          options={CUISINE_TYPES}
          value={cuisineType}
          onChange={setCuisineType}
          allowCustom
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || ingredients.length === 0}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Generating...' : 'Generate Recipe'}
        </button>
      </div>
    </div>
  )
}
