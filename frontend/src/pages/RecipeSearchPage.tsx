import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { useSearchRecipes } from '../hooks/useRecipes'
import { MEAL_TYPES, CUISINE_TYPES } from '../constants'

export function RecipeSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mealType, setMealType] = useState<string | null>(null)
  const [cuisineType, setCuisineType] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const {data, isLoading, isError } = useSearchRecipes ({
    q: query || undefined,
    meal_type: (mealType ?? undefined) as
    | 'breakfast'
    | 'lunch'
    | 'dinner'
    | 'snack'
    | 'undefined',
    cuisine_type: cuisineType ?? undefined,
    page,
  })

return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900">Browse Recipes</h2>

      <div className="mt-8">
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-600">Something went wrong. Please try again.</p>}

        {data && data.items.length === 0 && (
          <p className="text-gray-500">No recipes found. Try adjusting your search.</p>
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => navigate(`/recipes/${recipe.id}`, { state: { recipe } })}
                className="cursor-pointer rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                {recipe.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  {recipe.cuisine_type} · {recipe.meal_type}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
