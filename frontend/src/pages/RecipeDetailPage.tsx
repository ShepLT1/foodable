import { useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useRecipe } from '../hooks/useRecipes'
import { useSession } from '../hooks/useSession'
import {
  useFollowStats,
  useFollowUser,
  useUnfollowUser,
} from '../hooks/useFollows'
import { RecipeMealPlanMenu } from '../components/RecipeMealPlanMenu'
import { FavoriteButton } from '../components/FavoriteButton'
import { RecipePublishToggle } from '../components/RecipePublishToggle'
import { UserAvatar } from '../components/UserAvatar'
import { Banner } from '../components/Banner'

export function RecipeDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { session } = useSession()
  const { data: recipe, isLoading, error } = useRecipe(id ?? '')
  const [showNutritionDetails, setShowNutritionDetails] = useState(false)

  const safeSubstitute = Boolean(
    (location.state as { safeSubstitute?: boolean } | null)?.safeSubstitute,
  )
  const creatorId = recipe?.creator?.id ?? ''
  const isOwner = session?.user.id === creatorId

  const { data: stats } = useFollowStats(creatorId)
  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()

  const isPending = followMutation.isPending || unfollowMutation.isPending

  function toggleFollow() {
    if (stats?.is_following) {
      unfollowMutation.mutate(creatorId)
    } else {
      followMutation.mutate(creatorId)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
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

      <Banner
        show={safeSubstitute}
        message="Heads up — we swapped one of your ingredients for something we could actually cook with!"
      />

      <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
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

        {/* Creator & Follow Section */}
        {recipe.creator && (
          <div className="mt-6 flex items-center justify-between border-y border-slate-100 py-3">
            <Link
              to={`/users/${recipe.creator.id}`}
              className="group flex items-center gap-3"
            >
              <UserAvatar name={recipe.creator.display_name ?? ''} size="sm" />
              <div>
                <span className="block text-xs text-slate-400">Recipe by</span>
                <span className="text-sm font-semibold text-slate-800 transition group-hover:text-blue-600">
                  {isOwner ? 'You' : recipe.creator.display_name}
                </span>
              </div>
            </Link>

            {!isOwner && (
              <button
                type="button"
                disabled={isPending}
                onClick={toggleFollow}
                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  stats?.is_following
                    ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {stats?.is_following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
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
