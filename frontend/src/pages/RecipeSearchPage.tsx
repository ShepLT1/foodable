import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { useSearchRecipes } from '../hooks/useRecipes'
import { MEAL_TYPES, CUISINE_TYPES } from '../constants'
import { ComboboxSelect } from '../components/ComboboxSelect'

export function RecipeSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mealType, setMealType] = useState<string | null>(null)
  const [cuisineType, setCuisineType] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useSearchRecipes({
    q: query || undefined,
    meal_type: (mealType ?? undefined) as
      'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | undefined,
    cuisine_type: cuisineType ?? undefined,
    page,
  })

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Browse Recipes</h2>
        <button
          type="button"
          onClick={() => navigate('/recipes/new')}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Generate Recipe
        </button>
      </div>

      <div className="mt-6 flex max-w-md flex-col gap-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
        />
      </div>

      <div className="mt-8">
        {isLoading && <p className="text-gray-500">Loading...</p>}

        {isError && (
          <p className="text-red-600">
            Something went wrong. Please try again.
          </p>
        )}

        {data && data.items.length === 0 && (
          <p className="text-gray-500">
            No recipes found. Try adjusting your search.
          </p>
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() =>
                  navigate(`/recipes/${recipe.id}`, { state: { recipe } })
                }
                className="cursor-pointer rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                {recipe.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  {recipe.cuisine_type} · {recipe.meal_type}
                </p>
                {recipe.creator_display_name && (
                  <p className="mt-1 text-xs text gray-400">
                    by {recipe.creator_display_name}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {data && data.total > data.limit && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {Math.ceil(data.total / data.limit)}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * data.limit >= data.total}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
