import { useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Check, ChevronDown, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  useAddMealToMealPlan,
  useCreateMealPlan,
  useMealPlans,
} from '../hooks/useMealPlans'

import { Toast } from './Toast'

type RecipeMealPlanMenuProps = {
  recipeId: string
}

export function RecipeMealPlanMenu({ recipeId }: RecipeMealPlanMenuProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { data: mealPlans = [] } = useMealPlans()

  const createMealPlan = useCreateMealPlan()
  const addMealToMealPlan = useAddMealToMealPlan()

  const isPending = createMealPlan.isPending || addMealToMealPlan.isPending

  const recentMealPlans = mealPlans.slice(0, 8)

  useEffect(() => {
    if (!toastMessage) return

    const timer = setTimeout(() => {
      setToastMessage(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toastMessage])

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton
        disabled={isPending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <Plus size={16} />
        Add to Meal Plan
        <ChevronDown size={16} />
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className="z-50 mt-2 w-72 origin-top-left rounded-xl border border-gray-200 bg-white p-2 shadow-lg outline-none transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button
            type="button"
            disabled={isPending}
            className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900 data-focus:bg-gray-100"
            onClick={() =>
              createMealPlan.mutate(
                {
                  initial_recipe_id: recipeId,
                },
                {
                  onSuccess: (mealPlan) => {
                    setToastMessage(`Created "${mealPlan.title}"`)
                  },
                },
              )
            }
          >
            ✨ Create New Meal Plan
          </button>
        </MenuItem>

        {recentMealPlans.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-gray-500">No meal plans yet.</p>

            <p className="mt-1 text-xs text-gray-400">
              Create your first one above.
            </p>
          </div>
        ) : (
          <>
            <div className="my-2 border-t border-gray-200" />

            {recentMealPlans.map((mealPlan) => {
              const recipeCount = mealPlan.meals.filter(
                (meal) => meal.recipe_id === recipeId,
              ).length

              return (
                <MenuItem key={mealPlan.id}>
                  <button
                    type="button"
                    disabled={isPending}
                    className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left data-focus:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      addMealToMealPlan.mutate(
                        {
                          mealPlanId: mealPlan.id,
                          data: {
                            recipe_id: recipeId,
                          },
                        },
                        {
                          onSuccess: () => {
                            setToastMessage(`Added to "${mealPlan.title}"`)
                          },
                        },
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {mealPlan.title}
                      </span>

                      {recipeCount > 0 && (
                        <span
                          title={`${recipeCount} ${
                            recipeCount === 1 ? 'meal' : 'meals'
                          } use this recipe`}
                          className="flex items-center gap-1 text-green-600"
                        >
                          <Check size={16} />
                          <span className="text-xs font-medium">
                            ({recipeCount})
                          </span>
                        </span>
                      )}
                    </div>
                  </button>
                </MenuItem>
              )
            })}

            <div className="my-2 border-t border-gray-200" />

            <MenuItem>
              <Link
                to="/meal-plans"
                className="block rounded-lg px-3 py-2 text-sm text-blue-600 data-focus:bg-blue-50"
              >
                View All Meal Plans →
              </Link>
            </MenuItem>
          </>
        )}
      </MenuItems>
      {toastMessage && <Toast message={toastMessage} />}
    </Menu>
  )
}
