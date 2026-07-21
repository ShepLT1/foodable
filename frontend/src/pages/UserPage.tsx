import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Plus,
  ShoppingCart,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Utensils,
  PlusCircle,
  ListChecks,
  X,
  Trash2,
  Check,
  RotateCw,
  BookOpen,
  Apple,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { api, ApiError } from '../api/client'
import {
  groceryListResponseSchema,
  type GroceryList,
  type GroceryListItem,
} from '../schemas/grocery'

// --- Types ---
interface Ingredient {
  name: string
  quantity: number
  unit: string
}

interface Nutrition {
  calories?: number
  protein_g?: number
  protein?: number
  carbs_g?: number
  carbs?: number
  fat_g?: number
  fat?: number
}

interface Recipe {
  id: string
  title: string
  description?: string
  ingredients?: Ingredient[]
  steps?: string[]
  nutrition?: Nutrition
}

interface MealPlan {
  id: string
  user_id: string
  recipe_id: string | null
  custom_name: string | null
  date: string
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipe: Recipe | null
}

// Custom Quick Item Payload Shape
interface CustomItemData {
  name: string
  qty?: number
  unit?: string
  cal?: number
  p?: number
  c?: number
  f?: number
}

// Helpers to safely parse/format Custom Item Data inside custom_name
function parseCustomName(customName: string | null): CustomItemData | null {
  if (!customName) return null
  try {
    if (customName.startsWith('{') && customName.endsWith('}')) {
      const parsed = JSON.parse(customName)
      if (parsed && typeof parsed.name === 'string') {
        return parsed
      }
    }
  } catch {
    // fallback to plain text if not JSON
  }
  return { name: customName }
}

function formatCustomName(data: CustomItemData): string {
  if (
    data.qty === undefined &&
    !data.unit &&
    data.cal === undefined &&
    data.p === undefined &&
    data.c === undefined &&
    data.f === undefined
  ) {
    return data.name.trim()
  }

  const obj: Record<string, unknown> = { name: data.name.trim() }
  if (data.qty !== undefined && !isNaN(data.qty)) obj.qty = data.qty
  if (data.unit) obj.unit = data.unit.trim()
  if (data.cal !== undefined && !isNaN(data.cal)) obj.cal = data.cal
  if (data.p !== undefined && !isNaN(data.p)) obj.p = data.p
  if (data.c !== undefined && !isNaN(data.c)) obj.c = data.c
  if (data.f !== undefined && !isNaN(data.f)) obj.f = data.f

  const json = JSON.stringify(obj)
  return json.length <= 150 ? json : data.name.trim()
}

export const UserPage: React.FC = () => {
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-CA'), [])

  // --- Main States ---
  const [displayName, setDisplayName] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [allowPastEditing, setAllowPastEditing] = useState<boolean>(false)
  const [meals, setMeals] = useState<MealPlan[]>([])
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([])

  // --- Grocery List States ---
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([])
  const [selectedListId, setSelectedListId] = useState<string>('')
  const [selectedListItems, setSelectedListItems] = useState<GroceryListItem[]>(
    [],
  )
  const [newListTitle, setNewListTitle] = useState<string>('')
  const [isCreatingNewList, setIsCreatingNewList] = useState<boolean>(false)

  // --- Export Tracking State ---
  const [exportedMealIds, setExportedMealIds] = useState<Set<string>>(new Set())

  // --- Modal States ---
  const [activeModalSlot, setActiveModalSlot] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | null
  >(null)
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [itemType, setItemType] = useState<'recipe' | 'custom'>('custom')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [mealNameInput, setMealNameInput] = useState<string>('')

  // Optional Nutrition & Quantity Inputs
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(false)
  const [customQty, setCustomQty] = useState<string>('')
  const [customUnit, setCustomUnit] = useState<string>('')
  const [customCal, setCustomCal] = useState<string>('')
  const [customProtein, setCustomProtein] = useState<string>('')
  const [customCarbs, setCustomCarbs] = useState<string>('')
  const [customFat, setCustomFat] = useState<string>('')

  const [savingMeal, setSavingMeal] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Date Change Handler
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    setAllowPastEditing(false)
    setMessage(null)
  }

  // Exported Meals Storage Helper
  const loadExportedMeals = (listId: string) => {
    if (!listId) {
      setExportedMealIds(new Set())
      return
    }
    const saved = localStorage.getItem(`exported_meals_${listId}`)
    if (saved) {
      try {
        setExportedMealIds(new Set(JSON.parse(saved)))
      } catch {
        setExportedMealIds(new Set())
      }
    } else {
      setExportedMealIds(new Set())
    }
  }

  const handleSelectGroceryList = (id: string) => {
    setSelectedListId(id)
    loadExportedMeals(id)
  }

  const markMealsAsExported = (mealIds: string[]) => {
    if (!selectedListId) return
    setExportedMealIds((prev) => {
      const updated = new Set([...prev, ...mealIds])
      localStorage.setItem(
        `exported_meals_${selectedListId}`,
        JSON.stringify(Array.from(updated)),
      )
      return updated
    })
  }

  const { queryStartDate, queryEndDate } = useMemo(() => {
    const current = new Date(selectedDate + 'T00:00:00')
    const start = new Date(current)
    start.setDate(start.getDate() - 15)
    const end = new Date(current)
    end.setDate(end.getDate() + 15)

    return {
      queryStartDate: start.toISOString().slice(0, 10),
      queryEndDate: end.toISOString().slice(0, 10),
    }
  }, [selectedDate])

  // --- Fetch Dashboard Data ---
  const fetchDashboardData = useCallback(async () => {
    try {
      const userData = await api<{ display_name: string }>('/users/me')
      setDisplayName(userData.display_name || 'Foodable User')

      const mealData = await api<MealPlan[]>(
        `/meal-plans?startDate=${queryStartDate}&endDate=${queryEndDate}`,
      )
      setMeals(Array.isArray(mealData) ? mealData : [])

      try {
        const recipesData = await api<Recipe[]>('/recipes')
        if (Array.isArray(recipesData)) {
          setAvailableRecipes(recipesData)
          if (recipesData.length > 0) {
            setSelectedRecipeId((prev) => prev || recipesData[0].id)
          }
        }
      } catch {
        // ignore if recipes endpoint unavailable
      }

      const listData = await api<GroceryList[]>('/lists')
      if (Array.isArray(listData) && listData.length > 0) {
        setGroceryLists(listData)
        setSelectedListId((prev) => {
          const targetId = prev || listData[0].id
          loadExportedMeals(targetId)
          return targetId
        })
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    }
  }, [queryStartDate, queryEndDate])

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData()
    }
    void loadData()
  }, [fetchDashboardData])

  // --- Fetch Grocery Preview ---
  useEffect(() => {
    if (!selectedListId || isCreatingNewList) {
      return
    }

    let isMounted = true
    const fetchListDetails = async () => {
      try {
        const rawData = await api<unknown>(`/lists/${selectedListId}`)
        if (!isMounted) return
        const parsed = groceryListResponseSchema.parse(rawData)
        setSelectedListItems(parsed.items)
      } catch (err) {
        console.error('Error fetching list preview items:', err)
      }
    }

    void fetchListDetails()

    return () => {
      isMounted = false
    }
  }, [selectedListId, isCreatingNewList])

  // Derived Preview Items
  const activeListItems =
    !selectedListId || isCreatingNewList ? [] : selectedListItems

  // --- Date Helpers ---
  const changeDate = (offsetDays: number) => {
    const current = new Date(selectedDate + 'T00:00:00')
    current.setDate(current.getDate() + offsetDays)
    const yyyy = current.getFullYear()
    const mm = String(current.getMonth() + 1).padStart(2, '0')
    const dd = String(current.getDate()).padStart(2, '0')
    handleDateChange(`${yyyy}-${mm}-${dd}`)
  }

  const isPastDay = selectedDate < todayStr
  const isToday = selectedDate === todayStr
  const isEditingLocked = isPastDay && !allowPastEditing

  // --- Meal Filtering ---
  const selectedDayMeals = useMemo(() => {
    return meals.filter((meal) => {
      if (!meal.date) return false
      return meal.date.slice(0, 10) === selectedDate.slice(0, 10)
    })
  }, [meals, selectedDate])

  const unexportedDayMeals = useMemo(() => {
    return selectedDayMeals.filter((m) => !exportedMealIds.has(m.id))
  }, [selectedDayMeals, exportedMealIds])

  const allMealsExported =
    selectedDayMeals.length > 0 && unexportedDayMeals.length === 0

  // Check items lacking nutrition data
  const itemsWithoutNutritionCount = useMemo(() => {
    return selectedDayMeals.filter((m) => {
      if (m.recipe?.nutrition) return false
      const parsed = parseCustomName(m.custom_name)
      return parsed?.cal === undefined
    }).length
  }, [selectedDayMeals])

  // Macros Calculation (Includes both Recipe Nutrition AND Custom Item Nutrition)
  const dayTotals = useMemo(() => {
    return selectedDayMeals.reduce(
      (acc, meal) => {
        const nut = meal.recipe?.nutrition
        const parsedCustom = parseCustomName(meal.custom_name)

        if (nut) {
          acc.calories += Number(nut.calories) || 0
          acc.protein += Number(nut.protein_g ?? nut.protein) || 0
          acc.carbs += Number(nut.carbs_g ?? nut.carbs) || 0
          acc.fat += Number(nut.fat_g ?? nut.fat) || 0
        } else if (parsedCustom) {
          acc.calories += Number(parsedCustom.cal) || 0
          acc.protein += Number(parsedCustom.p) || 0
          acc.carbs += Number(parsedCustom.c) || 0
          acc.fat += Number(parsedCustom.f) || 0
        }
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }, [selectedDayMeals])

  const targetMealsForExport = useMemo(() => {
    return unexportedDayMeals.length > 0 ? unexportedDayMeals : selectedDayMeals
  }, [unexportedDayMeals, selectedDayMeals])

  // Consolidates both Recipe Ingredients AND Custom Items (with quantities/units)
  const consolidatedExportIngredients = useMemo(() => {
    const map = new Map<string, Ingredient>()

    targetMealsForExport.forEach((meal) => {
      const ings = meal.recipe?.ingredients
      if (Array.isArray(ings) && ings.length > 0) {
        ings.forEach((ing) => {
          if (!ing || !ing.name) return

          const key = `${ing.name.trim().toLowerCase()}_${(ing.unit || '').trim().toLowerCase()}`
          const qty = Number(ing.quantity) || 1

          if (map.has(key)) {
            const existing = map.get(key)!
            existing.quantity += qty
          } else {
            map.set(key, {
              name: ing.name.trim(),
              quantity: qty,
              unit: ing.unit || 'item',
            })
          }
        })
      } else if (meal.custom_name) {
        const parsed = parseCustomName(meal.custom_name)
        if (parsed && parsed.name) {
          const name = parsed.name.trim()
          const unit = parsed.unit ? parsed.unit.trim() : 'item'
          const qty = parsed.qty ? Number(parsed.qty) : 1
          const key = `${name.toLowerCase()}_${unit.toLowerCase()}`

          if (map.has(key)) {
            const existing = map.get(key)!
            existing.quantity += qty
          } else {
            map.set(key, {
              name,
              quantity: qty,
              unit,
            })
          }
        }
      }
    })

    return Array.from(map.values())
  }, [targetMealsForExport])

  // --- Modal Reset Helper ---
  const resetModalInputs = () => {
    setMealNameInput('')
    setCustomQty('')
    setCustomUnit('')
    setCustomCal('')
    setCustomProtein('')
    setCustomCarbs('')
    setCustomFat('')
    setShowOptionalDetails(false)
  }

  // --- Modal Openers ---
  const handleOpenAddModal = (
    slot: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  ) => {
    setEditingMealId(null)
    resetModalInputs()
    setItemType('custom')
    setActiveModalSlot(slot)
  }

  const handleOpenEditModal = (meal: MealPlan) => {
    setEditingMealId(meal.id)
    resetModalInputs()

    if (meal.recipe_id) {
      setItemType('recipe')
      setSelectedRecipeId(meal.recipe_id)
    } else {
      setItemType('custom')
      const parsed = parseCustomName(meal.custom_name)
      if (parsed) {
        setMealNameInput(parsed.name || '')
        setCustomQty(parsed.qty !== undefined ? String(parsed.qty) : '')
        setCustomUnit(parsed.unit || '')
        setCustomCal(parsed.cal !== undefined ? String(parsed.cal) : '')
        setCustomProtein(parsed.p !== undefined ? String(parsed.p) : '')
        setCustomCarbs(parsed.c !== undefined ? String(parsed.c) : '')
        setCustomFat(parsed.f !== undefined ? String(parsed.f) : '')

        if (
          parsed.qty !== undefined ||
          parsed.unit ||
          parsed.cal !== undefined ||
          parsed.p !== undefined ||
          parsed.c !== undefined ||
          parsed.f !== undefined
        ) {
          setShowOptionalDetails(true)
        }
      } else {
        setMealNameInput(meal.custom_name || '')
      }
    }
    setActiveModalSlot(meal.slot)
  }

  // --- Save / Update Meal Item ---
  const handleSaveMealItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeModalSlot) return

    setSavingMeal(true)
    setMessage(null)

    try {
      const isEditing = Boolean(editingMealId)
      const endpoint = isEditing
        ? `/meal-plans/${editingMealId}`
        : '/meal-plans'
      const method = isEditing ? 'PATCH' : 'POST'

      const payload: Record<string, unknown> = {
        date: selectedDate,
        slot: activeModalSlot,
      }

      if (itemType === 'recipe') {
        payload.recipe_id = selectedRecipeId
        payload.custom_name = null
      } else {
        const customData: CustomItemData = {
          name: mealNameInput.trim(),
        }

        if (customQty.trim()) customData.qty = Number(customQty)
        if (customUnit.trim()) customData.unit = customUnit.trim()
        if (customCal.trim()) customData.cal = Number(customCal)
        if (customProtein.trim()) customData.p = Number(customProtein)
        if (customCarbs.trim()) customData.c = Number(customCarbs)
        if (customFat.trim()) customData.f = Number(customFat)

        payload.custom_name = formatCustomName(customData)
        payload.recipe_id = null
      }

      await api(endpoint, {
        method,
        body: JSON.stringify(payload),
      })

      await fetchDashboardData()
      setActiveModalSlot(null)
      setEditingMealId(null)
      resetModalInputs()
      setMessage({
        type: 'success',
        text: `Saved "${itemType === 'custom' ? mealNameInput : 'recipe'}" for ${activeModalSlot}!`,
      })
    } catch (err) {
      console.error('Error saving meal item:', err)
      const detail =
        err instanceof ApiError ? err.detail : 'Failed to save item.'
      setMessage({ type: 'error', text: detail })
    } finally {
      setSavingMeal(false)
    }
  }

  // --- Delete Item Handler ---
  const handleDeleteMealItem = async (mealId: string) => {
    setSavingMeal(true)

    try {
      await api(`/meal-plans/${mealId}`, { method: 'DELETE' })
      await fetchDashboardData()
      setActiveModalSlot(null)
      setEditingMealId(null)
      resetModalInputs()
      setMessage({ type: 'success', text: 'Item removed from meal.' })
    } catch (err) {
      console.error('Error deleting item:', err)
      setMessage({ type: 'error', text: 'Failed to delete item.' })
    } finally {
      setSavingMeal(false)
    }
  }

  // --- Smart Export Action ---
  const handleExportIngredients = async () => {
    if (consolidatedExportIngredients.length === 0) {
      setMessage({
        type: 'error',
        text: 'No items found on this date to export.',
      })
      return
    }

    setExporting(true)
    setMessage(null)

    try {
      let targetId = selectedListId
      let targetTitle =
        groceryLists.find((l) => l.id === selectedListId)?.title ||
        'Grocery List'

      if (isCreatingNewList) {
        if (!newListTitle.trim()) {
          setMessage({
            type: 'error',
            text: 'Please enter a name for the new list.',
          })
          setExporting(false)
          return
        }

        const newList = await api<GroceryList>('/lists', {
          method: 'POST',
          body: JSON.stringify({ title: newListTitle.trim() }),
        })

        targetId = newList.id
        targetTitle = newList.title

        setGroceryLists((prev) => [...prev, newList])
        setSelectedListId(newList.id)
        setIsCreatingNewList(false)
        setNewListTitle('')
      }

      let addedCount = 0
      let mergedCount = 0

      for (const item of consolidatedExportIngredients) {
        const existingItem = activeListItems.find(
          (existing) =>
            existing.name.trim().toLowerCase() === item.name.toLowerCase() &&
            (existing.unit || '').trim().toLowerCase() ===
              item.unit.toLowerCase(),
        )

        if (existingItem && !isCreatingNewList) {
          const newQty = (Number(existingItem.quantity) || 0) + item.quantity
          await api(`/lists/${targetId}/items/${existingItem.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: newQty }),
          })
          mergedCount++
        } else {
          await api(`/lists/${targetId}/items`, {
            method: 'POST',
            body: JSON.stringify({
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
            }),
          })
          addedCount++
        }
      }

      markMealsAsExported(targetMealsForExport.map((m) => m.id))

      const refreshData = await api<unknown>(`/lists/${targetId}`)
      const parsed = groceryListResponseSchema.parse(refreshData)
      setSelectedListItems(parsed.items)

      const summaryText =
        mergedCount > 0
          ? `Added ${addedCount} item(s) and merged quantities for ${mergedCount} item(s) in "${targetTitle}"!`
          : `Exported ${addedCount} item(s) directly to "${targetTitle}"!`

      setMessage({ type: 'success', text: summaryText })
    } catch (err) {
      console.error('Export error:', err)
      setMessage({ type: 'error', text: 'Failed to export ingredients.' })
    } finally {
      setExporting(false)
    }
  }

  const slots = ['breakfast', 'lunch', 'dinner', 'snack'] as const

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{displayName ? `, ${displayName}` : ''}! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Plan your weekly meals, track daily macros, and generate your
              shop.
            </p>
          </div>
        </div>

        {/* Date Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    handleDateChange(e.target.value)
                  }
                }}
                className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isToday && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Today
              </span>
            )}

            {isPastDay && (
              <button
                onClick={() => setAllowPastEditing(!allowPastEditing)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  allowPastEditing
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                {allowPastEditing ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Editing
                    Unlocked
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Archived
                    (Click to Unlock)
                  </>
                )}
              </button>
            )}

            {!isToday && (
              <button
                onClick={() => handleDateChange(todayStr)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Jump to Today
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            {message.text}
          </div>
        )}

        {/* Nutrition Summary Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              Daily Nutrition Breakdown ({selectedDate})
            </h2>
            {itemsWithoutNutritionCount > 0 && (
              <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Info className="w-3 h-3" />
                {itemsWithoutNutritionCount} item(s) missing nutrition stats
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="text-xs opacity-80 block">Calories</span>
              <span className="text-2xl font-bold">
                {dayTotals.calories} kcal
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="text-xs opacity-80 block">Protein</span>
              <span className="text-2xl font-bold">{dayTotals.protein}g</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="text-xs opacity-80 block">Carbs</span>
              <span className="text-2xl font-bold">{dayTotals.carbs}g</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="text-xs opacity-80 block">Fat</span>
              <span className="text-2xl font-bold">{dayTotals.fat}g</span>
            </div>
          </div>
        </div>

        {/* Planned Meals Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Planned Meals ({selectedDayMeals.length} item
              {selectedDayMeals.length === 1 ? '' : 's'})
            </h2>
          </div>
        </div>

        {/* Multi-Item Meal Slot Cards */}
        <div className="space-y-4">
          {slots.map((slot) => {
            const slotMeals = selectedDayMeals.filter((m) => m.slot === slot)

            return (
              <div
                key={slot}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all space-y-3 ${
                  isEditingLocked
                    ? 'border-slate-100 bg-slate-50/50'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {slot} ({slotMeals.length})
                  </span>

                  <div className="flex items-center gap-2">
                    {isEditingLocked ? (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Read-only
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenAddModal(slot)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item / Drink
                      </button>
                    )}
                  </div>
                </div>

                {slotMeals.length > 0 ? (
                  <div className="divide-y divide-slate-100 space-y-3 pt-1">
                    {slotMeals.map((mealItem) => {
                      const isExported = exportedMealIds.has(mealItem.id)
                      const isQuickItem = !mealItem.recipe_id
                      const parsedCustom = parseCustomName(mealItem.custom_name)

                      const displayTitle =
                        mealItem.recipe?.title ||
                        parsedCustom?.name ||
                        mealItem.custom_name
                      const hasNutrition = Boolean(
                        mealItem.recipe?.nutrition ||
                        parsedCustom?.cal !== undefined,
                      )

                      const calVal =
                        mealItem.recipe?.nutrition?.calories ??
                        parsedCustom?.cal ??
                        0
                      const pVal =
                        mealItem.recipe?.nutrition?.protein_g ??
                        mealItem.recipe?.nutrition?.protein ??
                        parsedCustom?.p ??
                        0
                      const cVal =
                        mealItem.recipe?.nutrition?.carbs_g ??
                        mealItem.recipe?.nutrition?.carbs ??
                        parsedCustom?.c ??
                        0
                      const fVal =
                        mealItem.recipe?.nutrition?.fat_g ??
                        mealItem.recipe?.nutrition?.fat ??
                        parsedCustom?.f ??
                        0

                      return (
                        <div
                          key={mealItem.id}
                          className="pt-3 first:pt-0 flex items-start justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">
                                {displayTitle}
                              </h3>

                              {isQuickItem && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Apple className="w-3 h-3" /> Quick Item
                                </span>
                              )}

                              {isExported && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3" /> Exported
                                </span>
                              )}

                              {!isEditingLocked && (
                                <button
                                  onClick={() => handleOpenEditModal(mealItem)}
                                  className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                                  title="Edit item"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {mealItem.recipe?.description && (
                              <p className="text-xs text-slate-500 max-w-xl">
                                {mealItem.recipe.description}
                              </p>
                            )}

                            {/* Recipe Ingredients Tag List */}
                            {mealItem.recipe?.ingredients &&
                              mealItem.recipe.ingredients.length > 0 && (
                                <div className="pt-1 flex flex-wrap gap-1.5">
                                  {mealItem.recipe.ingredients.map(
                                    (ing, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-600 border border-slate-200"
                                      >
                                        {ing.quantity} {ing.unit} {ing.name}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}

                            {/* Custom Quick Item Quantity Pill */}
                            {isQuickItem && parsedCustom?.qty && (
                              <div className="pt-0.5">
                                <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
                                  {parsedCustom.qty}{' '}
                                  {parsedCustom.unit || 'item'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Nutrition Info or Graceful Fallback */}
                          {hasNutrition ? (
                            <div className="text-right text-xs text-slate-500 space-y-0.5 flex-shrink-0 ml-4">
                              <div className="font-semibold text-slate-700">
                                {calVal} kcal
                              </div>
                              <div>
                                P: {pVal}g | C: {cVal}g | F: {fVal}g
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0 ml-4">
                              No nutrition data
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic py-1">
                    No items added to {slot} yet.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Grocery Export Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Grocery List Export
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {allMealsExported ? (
                    <span className="text-emerald-600 font-semibold">
                      All meal items for {selectedDate} have been exported.
                    </span>
                  ) : unexportedDayMeals.length < selectedDayMeals.length ? (
                    <span>
                      Found{' '}
                      <span className="font-semibold text-emerald-600">
                        {unexportedDayMeals.length} newly added item(s)
                      </span>{' '}
                      ready to export.
                    </span>
                  ) : (
                    <span>
                      Found{' '}
                      <span className="font-semibold text-emerald-600">
                        {consolidatedExportIngredients.length}
                      </span>{' '}
                      item(s) ready for export on {selectedDate}.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isCreatingNewList ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="New list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewList(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedListId}
                    onChange={(e) => handleSelectGroceryList(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-emerald-500"
                  >
                    {groceryLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsCreatingNewList(true)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={handleExportIngredients}
                disabled={exporting || selectedDayMeals.length === 0}
                className={`px-5 py-2.5 rounded-xl text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  allMealsExported
                    ? 'bg-slate-700 hover:bg-slate-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300'
                }`}
              >
                {allMealsExported ? (
                  <RotateCw className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {exporting
                  ? 'Exporting...'
                  : allMealsExported
                    ? 'Re-export All to List'
                    : unexportedDayMeals.length < selectedDayMeals.length
                      ? `Export ${unexportedDayMeals.length} New Item(s)`
                      : `Export to List (${consolidatedExportIngredients.length})`}
              </button>
            </div>
          </div>

          {!isCreatingNewList && selectedListId && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 flex-shrink-0">
                <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                Current Items ({activeListItems.length}):
              </span>
              {activeListItems.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  This list is currently empty.
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                  {activeListItems.map((item) => (
                    <span
                      key={item.id}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                        item.checked
                          ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.quantity ?? 1} {item.unit} {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Meal Item (with Recipe or Custom Item + Nutrition Data) */}
        {activeModalSlot && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {editingMealId ? 'Edit' : 'Add'} {activeModalSlot} Item
                </h3>
                <button
                  onClick={() => {
                    setActiveModalSlot(null)
                    setEditingMealId(null)
                    resetModalInputs()
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setItemType('custom')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    itemType === 'custom'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Apple className="w-3.5 h-3.5 text-amber-600" />
                  Quick Item / Ingredient
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('recipe')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    itemType === 'recipe'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  Saved Recipe
                </button>
              </div>

              <form onSubmit={handleSaveMealItem} className="space-y-4">
                {itemType === 'recipe' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Choose Saved Recipe
                    </label>
                    {availableRecipes.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        No saved recipes found.
                      </p>
                    ) : (
                      <select
                        value={selectedRecipeId}
                        onChange={(e) => setSelectedRecipeId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {availableRecipes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Item / Dish / Drink Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Burger, Apple, Fresh Orange Juice"
                        value={mealNameInput}
                        onChange={(e) => setMealNameInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Optional Drawer for Quantity & Macros */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setShowOptionalDetails(!showOptionalDetails)
                        }
                        className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span>Quantity & Nutrition Stats (Optional)</span>
                        {showOptionalDetails ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {showOptionalDetails && (
                        <div className="p-3 border-t border-slate-200 bg-white space-y-3">
                          {/* Quantity & Unit */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                step="any"
                                placeholder="1"
                                value={customQty}
                                onChange={(e) => setCustomQty(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Unit
                              </label>
                              <input
                                type="text"
                                placeholder="medium, oz, whole"
                                value={customUnit}
                                onChange={(e) => setCustomUnit(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          {/* Calories & Macros */}
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Calories
                              </label>
                              <input
                                type="number"
                                placeholder="kcal"
                                value={customCal}
                                onChange={(e) => setCustomCal(e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Protein
                              </label>
                              <input
                                type="number"
                                placeholder="g"
                                value={customProtein}
                                onChange={(e) =>
                                  setCustomProtein(e.target.value)
                                }
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Carbs
                              </label>
                              <input
                                type="number"
                                placeholder="g"
                                value={customCarbs}
                                onChange={(e) => setCustomCarbs(e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Fat
                              </label>
                              <input
                                type="number"
                                placeholder="g"
                                value={customFat}
                                onChange={(e) => setCustomFat(e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {editingMealId ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteMealItem(editingMealId)}
                      disabled={savingMeal}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Item
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalSlot(null)
                        setEditingMealId(null)
                        resetModalInputs()
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        savingMeal ||
                        (itemType === 'custom' && !mealNameInput.trim()) ||
                        (itemType === 'recipe' && !selectedRecipeId)
                      }
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 transition-all cursor-pointer"
                    >
                      {savingMeal
                        ? 'Saving...'
                        : editingMealId
                          ? 'Update Item'
                          : 'Add Item'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage
