import { Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { useDeleteMeal, useUpdateMeal } from '../hooks/useMealPlans'
import type { MealPlanMeal, MealType } from '../api/mealPlans'

type MealCardProps = {
  mealPlanId: string
  meal: MealPlanMeal
}

export function MealCard({ mealPlanId, meal }: MealCardProps) {
  const updateMeal = useUpdateMeal()
  const deleteMeal = useDeleteMeal()
  const [servings, setServings] = useState(() => meal.servings)
  const [scheduledDate, setScheduledDate] = useState(
    () => meal.scheduled_date ?? '',
  )

  const servingsTimeoutRef = useRef<number | null>(null)
  const dateTimeoutRef = useRef<number | null>(null)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const queueServingUpdate = (nextServings: number) => {
    setServings(nextServings)

    if (servingsTimeoutRef.current !== null) {
      window.clearTimeout(servingsTimeoutRef.current)
    }

    servingsTimeoutRef.current = window.setTimeout(() => {
      updateMeal.mutate(
        {
          mealPlanId,
          mealId: meal.id,
          data: {
            servings: nextServings,
          },
        },
        {
          onError: () => {
            setServings(meal.servings)
          },
          onSettled: () => {
            servingsTimeoutRef.current = null
          },
        },
      )
    }, 300)
  }

  const queueDateUpdate = (nextDate: string) => {
    setScheduledDate(nextDate)

    if (dateTimeoutRef.current !== null) {
      window.clearTimeout(dateTimeoutRef.current)
    }

    dateTimeoutRef.current = window.setTimeout(() => {
      updateMeal.mutate(
        {
          mealPlanId,
          mealId: meal.id,
          data: {
            scheduled_date: nextDate === '' ? null : nextDate,
          },
        },
        {
          onError: () => {
            setScheduledDate(meal.scheduled_date ?? '')
          },
          onSettled: () => {
            dateTimeoutRef.current = null
          },
        },
      )
    }, 300)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <Link
          to={`/recipes/${meal.recipe_id}`}
          className="min-w-0 flex-1 text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
        >
          {meal.recipe_title}
        </Link>

        {/* Mobile row 1 / Desktop flow */}
        <div className="flex items-end justify-between gap-4 md:contents">
          {/* Meal type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Meal
            </label>

            <select
              value={meal.meal_type ?? ''}
              onChange={(e) =>
                updateMeal.mutate({
                  mealPlanId,
                  mealId: meal.id,
                  data: {
                    meal_type:
                      e.target.value === ''
                        ? null
                        : (e.target.value as MealType),
                  },
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 cursor-pointer"
            >
              <option value="">Unassigned</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Servings */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Servings
            </label>

            <div className="flex overflow-hidden rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => queueServingUpdate(Math.max(1, servings - 1))}
                disabled={updateMeal.isPending || servings <= 1}
                className="flex h-9 w-8 items-center justify-center border-r border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
              >
                −
              </button>

              <div className="flex h-9 w-8 items-center justify-center px-3 text-sm font-semibold text-gray-900">
                {servings}
              </div>

              <button
                type="button"
                onClick={() => queueServingUpdate(servings + 1)}
                disabled={updateMeal.isPending}
                className="flex h-9 w-8 items-center justify-center border-l border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Mobile row 2 / Desktop flow */}
        <div className="flex items-end justify-between gap-3 md:contents">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Date
            </label>

            <input
              type="date"
              value={scheduledDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => queueDateUpdate(e.target.value)}
              disabled={updateMeal.isPending}
              className="w-36 rounded-lg border border-gray-300 px-2 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="mb-0.5 shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <Dialog
        open={confirmDelete}
        onClose={setConfirmDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold">
              Remove meal?
            </DialogTitle>

            <p className="mt-2 text-gray-600">
              "{meal.recipe_title}" will be removed from this meal plan.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteMeal.mutate(
                    {
                      mealPlanId,
                      mealId: meal.id,
                    },
                    {
                      onSuccess: () => setConfirmDelete(false),
                    },
                  )
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-white cursor-pointer"
              >
                Remove
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
