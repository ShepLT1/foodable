import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Plus,
  ShoppingCart,
  Users,
  User,
  ArrowRight,
  Utensils,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { useCurrentUser } from '../hooks/useCurrentUser'
import { useGroceryLists } from '../hooks/useGroceryLists'
import { useFollowers, useFollowing, useFollowStats } from '../hooks/useFollows'
import { useMealPlans } from '../hooks/useMealPlans'
import { UserAvatar } from '../components/UserAvatar'
import { FollowListDialog } from '../components/FollowListDialog'

export const UserPage: React.FC = () => {
  const { data: user, isPending: userLoading } = useCurrentUser()
  const { data: lists = [], isPending: listsLoading } = useGroceryLists()
  const { data: mealPlans = [], isPending: mealPlansLoading } = useMealPlans()

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

  // 1. Calculate local 'Today' YYYY-MM-DD string securely
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const todayStr = new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0]

  // 2. Set up state for our currently viewed date
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr)

  // Helper to change the viewed date by X days
  function changeDateOffset(days: number) {
    setSelectedDateStr((prev) => {
      const d = new Date(prev)
      d.setUTCDate(d.getUTCDate() + days)
      return d.toISOString().split('T')[0]
    })
  }

  // 3. Helper to format the display title beautifully
  function getDisplayTitle() {
    if (selectedDateStr === todayStr) return 'Today'

    const tomorrow = new Date(todayStr)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    if (selectedDateStr === tomorrow.toISOString().split('T')[0])
      return 'Tomorrow'

    const yesterday = new Date(todayStr)
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    if (selectedDateStr === yesterday.toISOString().split('T')[0])
      return 'Yesterday'

    // Fallback format for dates further out (e.g. "Wed, Aug 12")
    const d = new Date(selectedDateStr)
    return d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

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

  // Flatten, inject parent meal plan data, and filter for our SELECTED date
  const activeMeals = mealPlans
    .flatMap((plan) =>
      plan.meals.map((meal) => ({
        ...meal,
        mealPlanId: plan.id,
        mealPlanTitle: plan.title,
      })),
    )
    .filter((meal) => meal.scheduled_date === selectedDateStr)

  // Accumulate ALL intake calculations per standard serving
  const totalCalories = activeMeals.reduce(
    (sum, meal) => sum + meal.recipe_nutrition.calories,
    0,
  )
  const totalProtein = activeMeals.reduce(
    (sum, meal) => sum + meal.recipe_nutrition.protein_g,
    0,
  )
  const totalCarbs = activeMeals.reduce(
    (sum, meal) => sum + meal.recipe_nutrition.carbs_g,
    0,
  )
  const totalFat = activeMeals.reduce(
    (sum, meal) => sum + meal.recipe_nutrition.fat_g,
    0,
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans text-slate-800">
      {/* 1. Profile & Preferences Header Card */}
      <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user?.display_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{user?.display_name ? `, ${user.display_name}` : ''}!
              👋
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
          <div className="flex flex-col border-b border-slate-100 pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <Utensils className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {getDisplayTitle()}'s Meals
                  </h2>
                </div>

                {/* Explicit Date Navigation Controls */}
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => changeDateOffset(-1)}
                    className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
                    aria-label="Previous day"
                    title="Go to previous day"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={selectedDateStr}
                      onChange={(e) => {
                        if (e.target.value) setSelectedDateStr(e.target.value)
                      }}
                      className="cursor-pointer bg-transparent px-2 py-1 text-sm font-semibold text-slate-700 outline-none hover:text-blue-600 focus:ring-0"
                      title="Select a specific date from calendar"
                      aria-label="Select date"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => changeDateOffset(1)}
                    className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
                    aria-label="Next day"
                    title="Go to next day"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <Link
                to="/meal-plans"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                Plan Future Meals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Highly Visible Nutrition Summary */}
            {activeMeals.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                  🔥 {Math.round(totalCalories)} kcal
                </span>
                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                  🥩 {Math.round(totalProtein)}g Protein
                </span>
                <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                  🌾 {Math.round(totalCarbs)}g Carbs
                </span>
                <span className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700">
                  🥑 {Math.round(totalFat)}g Fat
                </span>
              </div>
            )}
          </div>

          {mealPlansLoading ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading meals...
            </div>
          ) : activeMeals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 shadow-2xs">
              <p className="text-sm">
                No meals scheduled for {getDisplayTitle().toLowerCase()}.
              </p>
              <Link
                to="/meal-plans"
                className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Plan your meals →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-blue-300 hover:shadow-sm"
                >
                  <Link
                    to={`/recipes/${meal.recipe_id}`}
                    className="space-y-2 block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {meal.meal_type || 'Meal'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {Math.round(meal.recipe_nutrition.calories)} kcal
                      </span>
                    </div>
                    <h3 className="truncate font-bold text-slate-700 hover:text-blue-600 transition-colors">
                      {meal.recipe_title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-slate-400">
                      {meal.recipe_nutrition.explanation}
                    </p>
                  </Link>

                  <div className="mt-4 border-t border-slate-200/60 pt-3">
                    <Link
                      to={`/meal-plans/${meal.mealPlanId}`}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
                      title="View this meal plan"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="truncate flex-1">
                        From: {meal.mealPlanTitle}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Live Grocery Lists & Social Stats */}
        <div className="space-y-6">
          {/* Grocery Lists Widget */}
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

          {/* Social Stats Widget */}
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
