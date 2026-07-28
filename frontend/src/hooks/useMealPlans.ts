import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { MealPlan } from '../api/mealPlans'

import {
  addMealToMealPlan,
  createMealPlan,
  getMealPlans,
  getMealPlan,
  updateMealPlan,
  updateMeal,
  deleteMeal,
} from '../api/mealPlans'

export const mealPlanKeys = {
  all: ['meal-plans'] as const,
  detail: (mealPlanId: string) => ['meal-plans', mealPlanId] as const,
}

function updateMealPlanInCache(
  mealPlans: MealPlan[] | undefined,
  updatedMealPlan: MealPlan,
) {
  if (!mealPlans) {
    return [updatedMealPlan]
  }

  return [
    updatedMealPlan,
    ...mealPlans.filter((mealPlan) => mealPlan.id !== updatedMealPlan.id),
  ]
}

function updateMealPlanCaches(
  queryClient: QueryClient,
  updatedMealPlan: MealPlan,
) {
  queryClient.setQueryData<MealPlan[]>(mealPlanKeys.all, (mealPlans) =>
    updateMealPlanInCache(mealPlans, updatedMealPlan),
  )

  queryClient.setQueryData(
    mealPlanKeys.detail(updatedMealPlan.id),
    updatedMealPlan,
  )
}

export function useMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.all,
    queryFn: getMealPlans,
  })
}

export function useMealPlan(mealPlanId: string) {
  return useQuery({
    queryKey: mealPlanKeys.detail(mealPlanId),
    queryFn: () => getMealPlan(mealPlanId),
    enabled: !!mealPlanId,
  })
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMealPlan,

    onSuccess: (mealPlan) => {
      updateMealPlanCaches(queryClient, mealPlan)
    },
  })
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMealPlan,

    onSuccess: (updatedMealPlan) => {
      updateMealPlanCaches(queryClient, updatedMealPlan)
    },
  })
}

export function useAddMealToMealPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addMealToMealPlan,

    onSuccess: (updatedMealPlan) => {
      updateMealPlanCaches(queryClient, updatedMealPlan)
    },
  })
}

export function useUpdateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMeal,

    onSuccess: (updatedMealPlan) => {
      updateMealPlanCaches(queryClient, updatedMealPlan)
    },
  })
}

export function useDeleteMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMeal,

    onSuccess: (updatedMealPlan) => {
      updateMealPlanCaches(queryClient, updatedMealPlan)
    },
  })
}
