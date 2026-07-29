import { useState } from 'react'
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import type { MealPlan } from '../api/mealPlans'
import { useUpdateMealPlan } from '../hooks/useMealPlans'
import { useGenerateGroceryList } from '../hooks/useGroceryLists'

type MealPlanHeaderProps = {
  mealPlan: MealPlan
}

export function MealPlanHeader({ mealPlan }: MealPlanHeaderProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')

  const updateMealPlan = useUpdateMealPlan()
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

      <div className="mt-4 flex items-start justify-between">
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

        <div className="ml-6 flex gap-3">
          {generateList.isPending && (
            <Loader2 size={32} className="animate-spin" />
          )}
          <button
            type="button"
            disabled={generateList.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50 cursor-pointer"
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
            {generateList.isPending ? 'Generating...' : 'Generate Grocery List'}
          </button>
        </div>
      </div>
    </div>
  )
}
