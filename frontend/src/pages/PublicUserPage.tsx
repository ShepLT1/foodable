import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '../hooks/useUser'
import { useRecipesByUser } from '../hooks/useRecipes'
import {
  useFollowers,
  useFollowing,
  useFollowStats,
  useFollowUser,
  useUnfollowUser,
} from '../hooks/useFollow'
import { useSession } from '../hooks/useSession'
import { UserAvatar } from '../components/UserAvatar'
import { RecipeCard } from '../components/RecipeCard'
import { FollowListDialog } from '../components/FollowListDialog'

const PAGE_SIZE = 12

function PublicUserPageView({ userId }: { userId: string }) {
  const { session } = useSession()
  const [page, setPage] = useState(1)

  const { data: user, isPending: userLoading, error: userError } = useUser(userId)
  const { data: stats } = useFollowStats(userId)
  const { data: followers = [], isLoading: followersLoading } = useFollowers(userId)
  const { data: following = [], isLoading: followingLoading } = useFollowing(userId)

  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()

  const [activeDialog, setActiveDialog] = useState<'followers' | 'following' | null>(null)

  const { data: recipesPage, isPending: recipesLoading } = useRecipesByUser(
    userId,
    { limit: PAGE_SIZE, page },
  )

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : ''

  const isSelf = session?.user.id === userId
  const isPending = followMutation.isPending || unfollowMutation.isPending

  function toggleFollow() {
    if (stats?.is_following) {
      unfollowMutation.mutate(userId)
    } else {
      followMutation.mutate(userId)
    }
  }

  if (userLoading) {
    return <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">Loading profile...</div>
  }

  if (userError || !user) {
    return <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">User not found.</div>
  }

  const total = recipesPage?.total ?? 0
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const recipes = recipesPage?.items ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans text-slate-800">
      <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.display_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.display_name}</h1>
            {memberSince && <p className="text-xs text-slate-500">Member since {memberSince}</p>}

            <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
              <button
                type="button"
                onClick={() => setActiveDialog('followers')}
                className="cursor-pointer hover:text-purple-600 hover:underline"
              >
                <span className="font-bold text-slate-900">{stats?.follower_count ?? 0}</span> Followers
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveDialog('following')}
                className="cursor-pointer hover:text-purple-600 hover:underline"
              >
                <span className="font-bold text-slate-900">{stats?.following_count ?? 0}</span> Following
              </button>
            </div>
          </div>
        </div>

        {!isSelf && (
          <button
            type="button"
            disabled={isPending}
            onClick={toggleFollow}
            className={`cursor-pointer self-start sm:self-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
              stats?.is_following
                ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {stats?.is_following ? 'Following' : 'Follow'}
          </button>
        )}
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
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FollowListDialog
        open={activeDialog === 'followers'}
        onClose={() => setActiveDialog(null)}
        title="Followers"
        users={followers}
        isLoading={followersLoading}
      />

      <FollowListDialog
        open={activeDialog === 'following'}
        onClose={() => setActiveDialog(null)}
        title="Following"
        users={following}
        isLoading={followingLoading}
      />
    </div>
  )
}

export function PublicUserPage() {
  const { id = '' } = useParams()
  return <PublicUserPageView key={id} userId={id} />
}