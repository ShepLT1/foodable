import type { MealPlanMeal } from '../api/mealPlans'

import { MealCard } from './MealCard'

type MealListProps = {
  mealPlanId: string
  meals: MealPlanMeal[]
}

export function MealList({ mealPlanId, meals }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
        <p className="text-gray-500">
          This meal plan doesn't contain any meals yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <MealCard key={meal.id} mealPlanId={mealPlanId} meal={meal} />
      ))}
    </div>
  )
}
