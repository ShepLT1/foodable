import { Link } from 'react-router-dom'

import type { MealPlan } from '../api/mealPlans'

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
  return (
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

        <span className="text-sm text-gray-400">→</span>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Updated {formatUpdatedAt(mealPlan.updated_at)}
      </p>
    </Link>
  )
}
