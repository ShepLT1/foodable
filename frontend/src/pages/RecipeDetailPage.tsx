import { useLocation } from 'react-router-dom'
import type { Recipe } from '../api/recipes'

export function RecipeDetailPage() {
  const location = useLocation()
  const recipe = location.state?.recipe as Recipe | undefined

  if (!recipe) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-gray-600">No recipe data available.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900">{recipe.title}</h2>
    </div>
  )
}
