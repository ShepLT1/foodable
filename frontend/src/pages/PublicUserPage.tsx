import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '../hooks/useUser'
import { useRecipesByUser } from '../hooks/useRecipes'
import { UserAvatar } from '../components/UserAvatar'
import { RecipeCard } from '../components/RecipeCard'

const PAGE_SIZE = 12

// Page state resets naturally: PublicUserPage keys this by userId, so a new
// profile remounts fresh instead of resetting page in an effect.
function PublicUserPageView({ userId }: { userId: string }) {
  const [page, setPage] = useState(0)

  const {
    data: user,
    isPending: userLoading,
    error: userError,
  } = useUser(userId)
  const { data: recipesPage, isPending: recipesLoading } = useRecipesByUser(
    userId,
    {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
  )

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : ''

  if (userLoading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">
        Loading profile...
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">
        User not found.
      </div>
    )
  }

  const total = recipesPage?.total ?? 0
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const recipes = recipesPage?.items ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans text-slate-800">
      <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <UserAvatar name={user.display_name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.display_name}
          </h1>
          {memberSince && (
            <p className="text-sm text-slate-500">Member since {memberSince}</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">Public Recipes</h2>
          <span className="text-xs font-medium text-slate-400">
            {total} {total === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>

        {recipesLoading ? (
          <p className="text-sm text-slate-500">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
            <p className="text-sm">This user has no public recipes yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {page + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={page >= pageCount - 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

// keyed wrapper, so whenever id changes the component state reloads
export function PublicUserPage() {
  const { id = '' } = useParams()
  return <PublicUserPageView key={id} userId={id} />
}
