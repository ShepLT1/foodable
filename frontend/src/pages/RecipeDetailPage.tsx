import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useRecipe } from '../hooks/useRecipes'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { RecipeMealPlanMenu } from '../components/RecipeMealPlanMenu'
import { FavoriteButton } from '../components/FavoriteButton'
import { RecipePublishToggle } from '../components/RecipePublishToggle'

export function RecipeDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: recipe, isLoading, error } = useRecipe(id ?? '')
  const { data: currentUser } = useCurrentUser()
  const [showNutritionDetails, setShowNutritionDetails] = useState(false)

  const isOwner = !!currentUser && recipe?.creator?.id === currentUser.id

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
    <div className="mx-auto w-full max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900">{recipe.title}</h2>
          <div className="flex shrink-0 items-center gap-4">
            {isOwner && <RecipePublishToggle recipe={recipe} />}
            <FavoriteButton
              recipeId={recipe.id}
              isFavorited={recipe.is_favorited}
            />
          </div>
        </div>

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

        <div className="mt-6">
          <RecipeMealPlanMenu recipeId={recipe.id} />
        </div>

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
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Tools Needed
            </h3>
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
        <div className="mt-8 grid gap-8 border-t border-gray-200 pt-8 sm:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Ingredients</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="text-gray-700">
                  {ingredient.quantity}
                  {ingredient.unit ? ` ${ingredient.unit}` : ''}{' '}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900">Steps</h3>
            <ol className="mt-3 space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="text-gray-700">
                  <span className="font-medium">{i + 1}.</span>{' '}
                  {step.instruction}
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
    </div>
  )
}
