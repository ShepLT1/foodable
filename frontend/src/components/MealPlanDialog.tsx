import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useCreateMealPlan } from '../hooks/useMealPlans'

type MealPlanDialogProps = {
  open: boolean
  onClose: () => void
}

export function MealPlanDialog({ open, onClose }: MealPlanDialogProps) {
  const [title, setTitle] = useState('')

  const navigate = useNavigate()

  const createMealPlan = useCreateMealPlan()

  function handleClose() {
    if (createMealPlan.isPending) return

    setTitle('')
    onClose()
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmed = title.trim()

    createMealPlan.mutate(
      trimmed
        ? {
            title: trimmed,
          }
        : {},
      {
        onSuccess: (mealPlan) => {
          setTitle('')
          onClose()
          navigate(`/meal-plans/${mealPlan.id}`)
        },
      },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Meal Plan
          </DialogTitle>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Title</span>

              <input
                autoFocus
                type="text"
                value={title}
                maxLength={100}
                placeholder="Leave blank for automatic title"
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={createMealPlan.isPending}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createMealPlan.isPending}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMealPlan.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
