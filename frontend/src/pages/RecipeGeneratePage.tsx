import { useState } from 'react'
import { TagInput } from '../components/TagInput'

export function RecipeGeneratePage() {
  const [ingredients, setIngredients] = useState<string[]>([])

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
      </div>
    </div>
  )
}
