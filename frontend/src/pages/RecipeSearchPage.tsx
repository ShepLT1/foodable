import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SingleChipSelect } from '../components/SingleChipSelect'
import { ComboboxSelect } from '../components/ComboboxSelect'
import { RecipeCard } from '../components/RecipeCard'
import { Field, Label, Switch } from '@headlessui/react'

import { useSearchRecipes, useMyRecipes } from '../hooks/useRecipes'
import { MEAL_TYPES, CUISINE_TYPES, type MealType } from '../constants'

type Tab = 'community' | 'me'

export function RecipeSearchPage() {
  const [tab, setTab] = useState<Tab>('community')
  const [query, setQuery] = useState('')
  const [mealType, setMealType] = useState<string | null>(null)
  const [cuisineType, setCuisineType] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [excludeOwn, setExcludeOwn] = useState(false)

  const isCommunity = tab === 'community'

  const communityResult = useSearchRecipes(
    {
      q: query || undefined,
      meal_type: (mealType ?? undefined) as MealType | undefined,
      cuisine_type: cuisineType ?? undefined,
      exclude_own: excludeOwn || undefined,
      page,
    },
    isCommunity,
  )

  const myRecipesResult = useMyRecipes({ page }, !isCommunity)

  const { data, isLoading, isError } = isCommunity
    ? communityResult
    : myRecipesResult

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Browse Recipes</h2>
        <Link
          to="/recipes/new"
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Generate Recipe
        </Link>
      </div>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab('community')}
          className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-semibold transition ${
            tab === 'community'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Community
        </button>
        <button
          type="button"
          onClick={() => setTab('me')}
          className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-semibold transition ${
            tab === 'me'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Recipes
        </button>
      </div>
      {isCommunity && (
        <div className="mt-6 flex max-w-md flex-col gap-5">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search recipes..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <SingleChipSelect
            label="Meal Type"
            options={MEAL_TYPES}
            value={mealType}
            onChange={(value) => {
              setMealType(value)
              setPage(1)
            }}
          />

          <ComboboxSelect
            label="Cuisine Type"
            options={CUISINE_TYPES}
            value={cuisineType}
            onChange={(value) => {
              setCuisineType(value)
              setPage(1)
            }}
            placeholder="Search or type a cuisine"
          />

          <Field className="flex items-center gap-3">
            <Switch
              checked={excludeOwn}
              onChange={(checked: boolean) => {
                setExcludeOwn(checked)
                setPage(1)
              }}
              className={`${
                excludeOwn ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition`}
            >
              <span
                className={`${
                  excludeOwn ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <Label className="text-sm text-gray-700 cursor-pointer">
              Exclude my own recipes
            </Label>
          </Field>
        </div>
      )}

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
              <RecipeCard key={recipe.id} recipe={recipe} />
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
