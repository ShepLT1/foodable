import { useParams } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipes'

import { useState } from 'react'

export function RecipeDetailPage() {
  const { id } = useParams()
  const { data: recipe, isLoading, error } = useRecipe(id ?? '')
  const [showNutritionDetails, setShowNutritionDetails] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-gray-600">Recipe not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900">{recipe.title}</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {recipe.meal_type && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 capitalize">
            {recipe.meal_type}
          </span>
        )}
        {recipe.cuisine_type && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 capitalize">
            {recipe.cuisine_type}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">Serves {recipe.servings}</p>

      {recipe.description && (
        <p className="mt-3 text-gray-600">{recipe.description}</p>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900">
          Nutrition (per serving)
        </h3>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
          <span>{recipe.nutrition.calories} cal</span>
          <span>{recipe.nutrition.protein_g}g protein</span>
          <span>{recipe.nutrition.carbs_g}g carbs</span>
          <span>{recipe.nutrition.fat_g}g fat</span>
        </div>

        <button
          type="button"
          onClick={() => setShowNutritionDetails((prev) => !prev)}
          className="mt-2 cursor-pointer text-sm text-blue-600 hover:underline"
        >
          {showNutritionDetails ? 'Hide details' : 'Show details'}
        </button>

        {showNutritionDetails && (
          <p className="mt-2 text-sm text-gray-600">
            {recipe.nutrition.explanation}
          </p>
        )}
      </div>
      {recipe.tools_needed.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900">Tools Needed</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tools_needed.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Ingredients</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="text-gray-700">
                {ingredient.quantity}
                {ingredient.unit ? ` ${ingredient.unit}` : ''} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-xl font-semibold text-gray-900">Steps</h3>
          <ol className="mt-3 space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="text-gray-700">
                <span className="font-medium">{i + 1}.</span> {step.instruction}
                {step.estimated_duration_minutes && (
                  <span className="ml-1 text-sm text-gray-500">
                    (~{step.estimated_duration_minutes} min)
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
