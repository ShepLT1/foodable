import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TagInput } from '../components/TagInput'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { useGenerateRecipe } from '../hooks/useRecipes'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'] as const
type MealType = (typeof MEAL_TYPES)[number]
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
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState<string[]>([])
  const [mealType, setMealType] = useState<string | null>(null)
  const [cuisineType, setCuisineType] = useState<string | null>(null)

  const { mutate, isPending } = useGenerateRecipe()

  function handleSubmit() {
    mutate(
      {
        ingredients,
        meal_type: (mealType ?? undefined) as MealType | undefined,
        cuisine_type: cuisineType ?? undefined,
      },
      {
        onSuccess: (recipe) => {
          navigate(`/recipes/${recipe.id}`, { state: { recipe } })
        },
        onError: () => {
          alert('Something went wrong, please try again')
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Generate a Recipe</h2>
      <p className="mt-1 text-sm text-gray-500">
        {"Add what you have on hand and we'll build a recipe around it."}
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <TagInput
          label="Ingredients"
          value={ingredients}
          onChange={setIngredients}
          placeholder="Type an ingredient and press Enter"
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
          className="mt-2 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Generating...' : 'Generate Recipe'}
        </button>
      </div>
    </div>
  )
}
