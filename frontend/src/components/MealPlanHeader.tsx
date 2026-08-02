import { useState } from 'react'
import { ArrowLeft, Pencil, Loader2, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import type { MealPlan } from '../api/mealPlans'
import { useUpdateMealPlan, useGenerateMealPlan } from '../hooks/useMealPlans'
import { useGenerateGroceryList } from '../hooks/useGroceryLists'

type MealPlanHeaderProps = {
  mealPlan: MealPlan
  onComplete: () => void
}

export function MealPlanHeader({ mealPlan, onComplete }: MealPlanHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')

  const updateMealPlan = useUpdateMealPlan()
  const generateMealPlan = useGenerateMealPlan()
  const generateList = useGenerateGroceryList()
  const navigate = useNavigate()

  function cancelEditing() {
    setTitle('')
    setEditing(false)
  }

  function saveTitle() {
    const trimmed = title.trim()

    if (!trimmed) {
      return
    }

    updateMealPlan.mutate(
      {
        mealPlanId: mealPlan.id,
        data: {
          title: trimmed,
        },
      },
      {
        onSuccess: () => {
          setEditing(false)
          setTitle('')
        },
      },
    )
  }

  return (
    <div className="mb-8">
      <Link
        to="/meal-plans"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Meal Plans
      </Link>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          {editing ? (
            <input
              autoFocus
              value={title}
              disabled={updateMealPlan.isPending}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  cancelEditing()
                }

                if (e.key === 'Enter') {
                  e.preventDefault()
                  saveTitle()
                }
              }}
              className="w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2 text-3xl font-bold text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {mealPlan.title}
              </h1>

              <button
                type="button"
                onClick={() => {
                  setTitle(mealPlan.title)
                  setEditing(true)
                }}
                className="cursor-pointer rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Rename meal plan"
                title="Rename meal plan"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}

          {editing && (
            <div className="flex mt-2 gap-3">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={updateMealPlan.isPending}
                className="cursor-pointer rounded-lg border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveTitle}
                disabled={updateMealPlan.isPending || title.trim().length === 0}
                className="cursor-pointer rounded-lg bg-blue-600 px-2 py-1 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMealPlan.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}

          <p className="mt-2 text-gray-500">
            {mealPlan.meals.length}{' '}
            {mealPlan.meals.length === 1 ? 'meal' : 'meals'}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:ml-6 md:flex-row">
          <button
            type="button"
            disabled={generateMealPlan.isPending}
            onClick={onComplete}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white bg-purple-700 hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generateMealPlan.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}

            {generateMealPlan.isPending
              ? 'Generating...'
              : 'Complete Plan via AI'}
          </button>

          <button
            type="button"
            disabled={generateList.isPending}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() =>
              generateList.mutate(
                {
                  meal_plan_id: mealPlan.id,
                },
                {
                  onSuccess: (list) => {
                    navigate(`/lists/${list.id}`)
                  },
                },
              )
            }
          >
            {generateList.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}

            {generateList.isPending
              ? 'Generating...'
              : 'Generate Grocery List via AI'}
          </button>
        </div>
      </div>
    </div>
  )
}
