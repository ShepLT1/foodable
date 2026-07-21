import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, ShoppingBag, Utensils, Calendar, Sparkles, Flame, ShoppingCart } from 'lucide-react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import {
  useGroceryLists,
  useCreateGroceryList,
  useCreateGroceryListItem,
} from '../hooks/useGroceryLists'
import { UserAvatar } from '../components/UserAvatar'
import { getMealPlans, type MealPlanItem } from '../api/mealplan'
export function UserPage() {
  const navigate = useNavigate()
  const { data: user, isPending: loadingUser } = useCurrentUser()
  const { data: lists = [], isPending: loadingLists } = useGroceryLists()
  const createList = useCreateGroceryList()
  const createListItem = useCreateGroceryListItem()

  // Local state for interactive widgets
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [quickItemName, setQuickItemName] = useState('')
  const [todayMeals, setTodayMeals] = useState<MealPlanItem[]>([])
  const [loadingMeals, setLoadingMeals] = useState(true)
  const [exporting, setExporting] = useState(false)

  // 1. Fetch TODAY'S live meal plans from the FastAPI database
  const fetchTodayMeals = useCallback(async () => {
    setLoadingMeals(true)
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      const data = await getMealPlans(todayStr, todayStr)
      setTodayMeals(data)
    } catch (err) {
      console.error('Failed to load live meals from database:', err)
    } finally {
      setLoadingMeals(false)
    }
  }, [])

  useEffect(() => {
    fetchTodayMeals()
  }, [fetchTodayMeals])

  // 2. 🧮 Dynamically calculate daily nutrition totals from today's linked recipes
  const liveNutrition = todayMeals.reduce(
    (acc, meal) => {
      const nut = (meal as any).recipe?.nutrition
      if (nut) {
        acc.calories += Number(nut.calories) || 0
        acc.protein += Number(nut.protein_g) || 0
        acc.carbs += Number(nut.carbs_g) || 0
        acc.fat += Number(nut.fat_g) || 0
      }
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // 3. Smart defaults and completion tracking for grocery lists
  const defaultList = lists.find((l) => l.items && l.items.length > 0) ?? lists[0]
  const activeList = lists.find((l) => l.id === selectedListId) ?? defaultList
  const totalItems = activeList?.items?.length ?? 0
  const completedItems = activeList?.items?.filter((i) => i.checked).length ?? 0

  // 4. Quick-Add handler for adding items directly from the dashboard
  async function handleQuickAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (!quickItemName.trim() || !activeList) return

    await createListItem.mutateAsync({
      listId: activeList.id,
      data: { name: quickItemName.trim(), quantity: 1 },
    })
    setQuickItemName('')
  }

  // 5. 🛒 Export today's recipe ingredients into a new live Grocery List
  const handleExportGroceryList = async () => {
    setExporting(true)
    try {
      const todayStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      // Create a dedicated shopping list in Postgres
      const newList = await createList.mutateAsync({
        title: `Meal Plan Shop (${todayStr})`,
      })

      // Extract all ingredients from today's scheduled meals
      const allIngredients: { name: string; quantity: number; unit?: string }[] = []
      todayMeals.forEach((meal) => {
        const ingredients = (meal as any).recipe?.ingredients
        if (ingredients && Array.isArray(ingredients)) {
          ingredients.forEach((ing: any) => {
            allIngredients.push({
              name: ing.name,
              quantity: Number(ing.quantity) || 1,
              unit: ing.unit || undefined,
            })
          })
        }
      })

      if (allIngredients.length === 0) {
        alert('No recipe ingredients found to export for today!')
        setExporting(false)
        return
      }

      // Add each item to the newly created list
      for (const item of allIngredients) {
        await createListItem.mutateAsync({
          listId: newList.id,
          data: item,
        })
      }

      // Jump straight to the newly created shopping list
      navigate(`/lists/${newList.id}`)
    } catch (err) {
      console.error('Failed to export grocery list:', err)
      alert('Could not create grocery list from today\'s meals.')
    } finally {
      setExporting(false)
    }
  }

  if (loadingUser || loadingLists || loadingMeals) {
    return (
      <div className="mx-auto max-w-5xl p-12 text-center text-slate-500 font-medium">
        Loading live dashboard data...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header & Profile Greeting */}
      <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user?.display_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.display_name || 'Foodie'}!
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Dietary Badges from Profile */}
        <div className="flex flex-wrap gap-2">
          {user?.dietary_restrictions?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
          {user?.allergies?.map((allergy) => (
            <span
              key={allergy}
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
            >
              ⚠️ No {allergy}
            </span>
          ))}
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => createList.mutate({ title: 'New Grocery List' })}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-4 font-medium text-blue-700 transition hover:bg-blue-100/50"
        >
          <Plus size={20} />
          <span>New Grocery List</span>
        </button>

        <Link
          to="/recipes"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 font-medium text-emerald-700 transition hover:bg-emerald-100/50"
        >
          <Sparkles size={20} />
          <span>Generate AI Recipe</span>
        </Link>

        <Link
          to="/profile"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-100/50 p-4 font-medium text-slate-700 transition hover:bg-slate-200/50"
        >
          <Utensils size={20} />
          <span>Edit Preferences</span>
        </Link>
      </section>

      {/* 🔥 LIVE Daily Nutrition Totals & Export Bar */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={22} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Today's Live Nutrition Totals</h2>
              <p className="text-xs text-gray-500">
                Calculated dynamically from {todayMeals.length} planned {todayMeals.length === 1 ? 'meal' : 'meals'}.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportGroceryList}
            disabled={exporting || todayMeals.length === 0}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            <ShoppingCart size={16} />
            <span>{exporting ? 'Building List...' : 'Export Today to Grocery List'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4 text-center">
            <p className="text-2xl font-black text-orange-600">{Math.round(liveNutrition.calories)}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-800">Calories</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-center">
            <p className="text-2xl font-black text-blue-600">{Math.round(liveNutrition.protein)}g</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Protein</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4 text-center">
            <p className="text-2xl font-black text-amber-600">{Math.round(liveNutrition.carbs)}g</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Carbs</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">{Math.round(liveNutrition.fat)}g</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Fat</p>
          </div>
        </div>
      </section>

      {/* Main Interactive Widgets Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Active Grocery List Widget */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Active Grocery List</h2>
              </div>
              <Link
                to="/lists"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All ({lists.length})
              </Link>
            </div>

            {activeList ? (
              <div className="space-y-4">
                {/* Header with List Dropdown Switcher */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  {lists.length > 1 ? (
                    <select
                      value={activeList.id}
                      onChange={(e) => setSelectedListId(e.target.value)}
                      className="max-w-[200px] cursor-pointer truncate rounded-md border-none bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.title} ({list.items?.length ?? 0})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Link
                      to={`/lists/${activeList.id}`}
                      className="truncate font-semibold text-slate-800 hover:text-blue-600"
                    >
                      {activeList.title}
                    </Link>
                  )}

                  <span className="text-xs font-medium text-gray-500">
                    {completedItems}/{totalItems} checked
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%`,
                    }}
                  />
                </div>

                {/* Item Preview */}
                {totalItems > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {activeList.items?.slice(0, 4).map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.checked ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                        <span className={item.checked ? 'line-through text-gray-400' : ''}>
                          {item.quantity} {item.unit ?? ''} {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-2 text-sm text-gray-400">
                    This list is currently empty. Add an item below!
                  </p>
                )}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                No grocery lists created yet.
              </p>
            )}
          </div>

          {/* Quick-Add Item Form */}
          {activeList && (
            <form onSubmit={handleQuickAddItem} className="mt-6 flex gap-2">
              <input
                type="text"
                placeholder="Quick add item (e.g. Milk)..."
                value={quickItemName}
                onChange={(e) => setQuickItemName(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={!quickItemName.trim() || createListItem.isPending}
                className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </form>
          )}
        </div>

        {/* 🥗 LIVE Today's Meal Plan Widget */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Today's Meal Plan</h2>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="space-y-3">
              {todayMeals.length > 0 ? (
                todayMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                    <span className="font-medium text-gray-500 capitalize">{meal.slot}</span>
                    <span className="font-semibold text-slate-800">
                      {(meal as any).recipe?.title || meal.custom_name || 'Planned Meal'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-gray-500 font-medium">No meals planned for today yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Plan your schedule to see macros and build shopping lists!</p>
                  <Link
                    to="/meal-planner"
                    className="mt-3 inline-block rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    + Plan Today's Meals
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}