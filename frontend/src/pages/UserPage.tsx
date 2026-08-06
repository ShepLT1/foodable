import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Plus,
  ShoppingCart,
  Users,
  User,
  ArrowRight,
  BookOpen,
  Clock,
  Utensils,
} from 'lucide-react'

import { useCurrentUser } from '../hooks/useCurrentUser'
import { useGroceryLists } from '../hooks/useGroceryLists'
import { useFollowers, useFollowing, useFollowStats } from '../hooks/useFollow'
import { UserAvatar } from '../components/UserAvatar'
import { FollowListDialog } from '../components/FollowListDialog'

export const UserPage: React.FC = () => {
  const { data: user, isPending: userLoading } = useCurrentUser()
  const { data: lists = [], isPending: listsLoading } = useGroceryLists()

  const { data: stats } = useFollowStats(user?.id ?? '')
  const { data: followers = [], isLoading: followersLoading } = useFollowers(
    user?.id ?? '',
  )
  const { data: following = [], isLoading: followingLoading } = useFollowing(
    user?.id ?? '',
  )

  const [activeDialog, setActiveDialog] = useState<
    'followers' | 'following' | null
  >(null)

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : ''

  if (userLoading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans text-slate-800">
      {/* 1. Profile & Preferences Header Card */}
      <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user?.display_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{user?.display_name ? `, ${user.display_name}` : ''}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              {user?.email} {memberSince && `• Member since ${memberSince}`}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {user?.dietary_restrictions?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                >
                  {tag}
                </span>
              ))}
              {user?.allergies?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700"
                >
                  Avoids {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-center"
        >
          <User className="h-4 w-4" />
          Edit Profile
        </Link>
      </section>

      {/* 2. Quick Actions */}
      <section className="flex flex-wrap gap-4">
        <Link
          to="/recipes"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Sparkles className="h-5 w-5" />
          Generate AI Recipe
        </Link>
        <Link
          to="/lists"
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Plus className="h-5 w-5 text-slate-500" />
          New Grocery List
        </Link>
      </section>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column */}
        <section className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Recent AI Recipes
              </h2>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                Coming Soon
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Preview Layout
            </span>
          </div>

          {/* Static Mock Preview Cards */}
          <div className="grid grid-cols-1 gap-4 opacity-75 select-none sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Dinner
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    420 kcal
                  </span>
                </div>
                <h3 className="truncate font-bold text-slate-700">
                  Veggie Stir Fry
                </h3>
                <p className="line-clamp-2 text-xs text-slate-400">
                  Quick weeknight stir fry with fresh broccoli and savory soy
                  sauce.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Utensils className="h-3 w-3" /> Asian
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Preview
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Dinner
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    650 kcal
                  </span>
                </div>
                <h3 className="truncate font-bold text-slate-700">
                  Chicken & Chickpea Curry
                </h3>
                <p className="line-clamp-2 text-xs text-slate-400">
                  A hearty, spiced curry with tender chicken and chickpeas
                  simmered in coconut milk.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Utensils className="h-3 w-3" /> Indian
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Preview
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-center">
            <p className="text-xs font-medium text-blue-800">
              ✨ Once the recipes API is integrated, your generated meals will
              automatically appear here!
            </p>
          </div>
        </section>

        {/* Right Column: Live Grocery Lists & Social Stats */}
        <div className="space-y-6">
          {/* Grocery Lists Widget (LIVE DATA) */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                Grocery Lists
              </h2>
              <Link
                to="/lists"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {listsLoading ? (
              <p className="text-xs text-slate-500">Loading lists...</p>
            ) : lists.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400">
                <p className="text-xs">No active grocery lists.</p>
                <Link
                  to="/lists"
                  className="mt-2 inline-block text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Create one now →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {lists.slice(0, 4).map((list) => {
                  const completedCount = list.items.filter(
                    (i) => i.checked,
                  ).length
                  return (
                    <Link
                      key={list.id}
                      to={`/lists/${list.id}`}
                      className="block rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {list.title}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {completedCount}/{list.items.length} items
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* Social Stats Widget (LIVE DATA) */}
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Users className="h-5 w-5 text-purple-600" />
                Community
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <button
                type="button"
                onClick={() => setActiveDialog('followers')}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <span className="block text-xs font-medium text-slate-500">
                  Followers
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {stats?.follower_count ?? 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDialog('following')}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <span className="block text-xs font-medium text-slate-500">
                  Following
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {stats?.following_count ?? 0}
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

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

export default UserPage