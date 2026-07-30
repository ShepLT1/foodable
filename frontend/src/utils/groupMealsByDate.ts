import type { MealPlanMeal } from '../api/mealPlans'

export type MealGroup = {
  title: string
  date: string | null
  meals: MealPlanMeal[]
}

const mealTypeOrder: Record<string, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  dessert: 3,
  snack: 4,
}

function formatHeading(date: string) {
  const [year, month, day] = date.split('-').map(Number)

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function groupMealsByDate(meals: MealPlanMeal[]): MealGroup[] {
  const grouped = new Map<string | null, MealPlanMeal[]>()

  for (const meal of meals) {
    const key = meal.scheduled_date

    const existing = grouped.get(key)

    if (existing) {
      existing.push(meal)
    } else {
      grouped.set(key, [meal])
    }
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => {
      if (a === null) return 1
      if (b === null) return -1

      return a.localeCompare(b)
    })
    .map(([date, meals]) => ({
      date,
      title: date ? formatHeading(date) : 'No Date',
      meals: meals.sort((a, b) => {
        const orderA =
          mealTypeOrder[a.meal_type ?? ''] ?? Number.MAX_SAFE_INTEGER

        const orderB =
          mealTypeOrder[b.meal_type ?? ''] ?? Number.MAX_SAFE_INTEGER

        return orderA - orderB
      }),
    }))
}
