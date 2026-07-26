import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { TagInput } from '../components/TagInput'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { ComboboxSelect } from '../components/ComboboxSelect'
import { useGenerateRecipe } from '../hooks/useRecipes'
import { MEAL_TYPES, CUISINE_TYPES } from '../constants'

type MealType = (typeof MEAL_TYPES)[number]
<<<<<<< HEAD
const CUISINE_TYPES = [
  'American',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Mediterranean',
  'Mexican',
  'Thai',
]
=======
>>>>>>> 9700c79 (Move MEAL_TYPES/CUISINE_TYPES to shared constants)

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

        <ComboboxSelect
          label="Cuisine Type"
          options={CUISINE_TYPES}
          value={cuisineType}
          onChange={setCuisineType}
          placeholder="Search or type a cuisine"
          allowCustom
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || ingredients.length === 0}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Recipe'
          )}
        </button>
      </div>
    </div>
  )
}
