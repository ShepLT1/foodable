import { useParams } from 'react-router-dom'

import { MealList } from '../components/MealList'
import { MealPlanHeader } from '../components/MealPlanHeader'
import { useMealPlan } from '../hooks/useMealPlans'
import { groupMealsByDate } from '../utils/groupMealsByDate'

export function MealPlanPage() {
  const { id } = useParams()

  const { data: mealPlan, isLoading, error } = useMealPlan(id ?? '')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-gray-600">Loading meal plan...</p>
      </div>
    )
  }

  if (error || !mealPlan) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-600">Meal plan not found.</p>
      </div>
    )
  }

  const groups = groupMealsByDate(mealPlan.meals)

  if (mealPlan.meals.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <MealPlanHeader mealPlan={mealPlan} />

        <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-lg font-medium text-gray-900">No meals yet</p>

          <p className="mt-2 text-gray-600">
            Add recipes from their recipe pages to start building this meal
            plan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <MealPlanHeader mealPlan={mealPlan} />

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.date ?? 'unscheduled'}>
            <div className="mb-5 flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {group.title}
              </h2>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <MealList mealPlanId={mealPlan.id} meals={group.meals} />
          </section>
        ))}
      </div>
    </div>
  )
}
