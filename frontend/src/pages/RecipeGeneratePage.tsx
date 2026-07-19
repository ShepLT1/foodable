import { useState } from 'react'
import { TagInput } from '../components/TagInput'
import { SingleChipSelect } from '../components/SingleChipSelect'

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
  const [cuisineType, setCuisineType] = useState('')

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
      </div>
    </div>
  )
}
