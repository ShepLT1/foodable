import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { useGenerateMealPlan } from '../hooks/useMealPlans'

import type {
  GenerateMealPlanRequest,
  MealPlan,
  MealType,
} from '../api/mealPlans'

type CompleteMealPlanDialogProps = {
  mealPlan: MealPlan
  onClose: () => void
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function getDefaultStartDate(mealPlan: MealPlan): string {
  const firstScheduledMeal = mealPlan.meals.find(
    (meal) => meal.scheduled_date !== null,
  )

  if (!firstScheduledMeal || firstScheduledMeal.scheduled_date === null) {
    return formatDate(new Date())
  }

  return firstScheduledMeal.scheduled_date
}

export function CompleteMealPlanDialog({
  mealPlan,
  onClose,
}: CompleteMealPlanDialogProps) {
  const [startDate, setStartDate] = useState<string>(() =>
    getDefaultStartDate(mealPlan),
  )

  const [days, setDays] = useState(7)

  const [mealTypes, setMealTypes] = useState<MealType[]>([
    'breakfast',
    'lunch',
    'dinner',
  ])

  const [optimizations, setOptimizations] = useState<
    GenerateMealPlanRequest['optimizations']
  >({
    lower_cost: true,
    minimize_food_waste: true,
  })

  const generateMealPlan = useGenerateMealPlan()

  function toggleMealType(mealType: MealType) {
    setMealTypes((current) =>
      current.includes(mealType)
        ? current.filter((type) => type !== mealType)
        : [...current, mealType],
    )
  }

  function handleGenerate() {
    generateMealPlan.mutate(
      {
        mealPlanId: mealPlan.id,
        data: {
          start_date: startDate,
          days,
          meal_types: mealTypes,
          optimizations,
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !generateMealPlan.isPending) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [generateMealPlan.isPending, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!generateMealPlan.isPending) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Complete Meal Plan with AI
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            AI will fill any empty meal slots while leaving your existing
            scheduled meals unchanged.
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={generateMealPlan.isPending}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="days"
                  className="text-sm font-medium text-gray-700"
                >
                  Days to Generate
                </label>

                <span className="text-sm font-medium text-gray-900">
                  {days} {days === 1 ? 'day' : 'days'}
                </span>
              </div>

              <input
                id="days"
                type="range"
                min={1}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={generateMealPlan.isPending}
                className="w-full disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Meal Types
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ['breakfast', 'Breakfast'],
                    ['lunch', 'Lunch'],
                    ['dinner', 'Dinner'],
                    ['snack', 'Snack'],
                    ['dessert', 'Dessert'],
                  ] satisfies [MealType, string][]
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <input
                      type="checkbox"
                      checked={mealTypes.includes(value)}
                      onChange={() => toggleMealType(value)}
                      disabled={generateMealPlan.isPending}
                    />

                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Optimizations
              </p>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <input
                    type="checkbox"
                    checked={optimizations.lower_cost}
                    onChange={() =>
                      setOptimizations((current) => ({
                        ...current,
                        lower_cost: !current.lower_cost,
                      }))
                    }
                    disabled={generateMealPlan.isPending}
                  />

                  <span>Minimize grocery costs</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <input
                    type="checkbox"
                    checked={optimizations.minimize_food_waste}
                    onChange={() =>
                      setOptimizations((current) => ({
                        ...current,
                        minimize_food_waste: !current.minimize_food_waste,
                      }))
                    }
                    disabled={generateMealPlan.isPending}
                  />

                  <span>Reduce food waste</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={generateMealPlan.isPending}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={mealTypes.length === 0 || generateMealPlan.isPending}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generateMealPlan.isPending && (
              <Loader2 size={18} className="animate-spin" />
            )}

            {generateMealPlan.isPending ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  )
}
