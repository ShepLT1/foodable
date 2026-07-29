import { useState } from 'react'
import { MealPlanCard } from '../components/MealPlanCard'
import { MealPlanDialog } from '../components/MealPlanDialog'
import { useMealPlans } from '../hooks/useMealPlans'

export function MealPlansPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: mealPlans = [], isLoading, error } = useMealPlans()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-gray-600">Loading meal plans...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-600">Unable to load meal plans.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>

          <p className="mt-2 text-gray-500">
            Organize recipes into weekly meal plans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 cursor-pointer"
        >
          New Meal Plan
        </button>
      </div>

      {mealPlans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No meal plans yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first meal plan to start organizing recipes.
          </p>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Create Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {mealPlans.map((mealPlan) => (
            <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
          ))}
        </div>
      )}

      <MealPlanDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
