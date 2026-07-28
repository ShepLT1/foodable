import { Link } from 'react-router-dom'
import type { Recipe } from '../api/recipes'

type RecipeCardProps = {
  recipe: Recipe
}

// TODO: fix once search UI is in
export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-blue-300 hover:shadow-sm"
    >
      <h3 className="truncate font-bold text-slate-800">{recipe.title}</h3>
    </Link>
  )
}
