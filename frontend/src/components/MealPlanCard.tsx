import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Trash2 } from 'lucide-react'

import type { MealPlan } from '../api/mealPlans'
import { useDeleteMealPlan } from '../hooks/useMealPlans'

type MealPlanCardProps = {
  mealPlan: MealPlan
}

function formatUpdatedAt(updatedAt: string) {
  return new Date(updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteMealPlan = useDeleteMealPlan()

  return (
    <div>
      <Link
        to={`/meal-plans/${mealPlan.id}`}
        className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mealPlan.title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {mealPlan.meals.length}{' '}
              {mealPlan.meals.length === 1 ? 'meal' : 'meals'}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setConfirmDelete(true)
            }}
            className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Updated {formatUpdatedAt(mealPlan.updated_at)}
        </p>
      </Link>
      <Dialog
        open={confirmDelete}
        onClose={setConfirmDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold">
              Delete meal plan?
            </DialogTitle>

            <p className="mt-2 text-gray-600">
              "{mealPlan.title}" will be permanently deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteMealPlan.isPending}
                onClick={() =>
                  deleteMealPlan.mutate(mealPlan.id, {
                    onSuccess: () => setConfirmDelete(false),
                  })
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
              >
                {deleteMealPlan.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
