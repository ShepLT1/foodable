import { Link } from 'react-router-dom'
import { Utensils, User } from 'lucide-react'
import type { Recipe } from '../api/recipes'
import { useSession } from '../hooks/useSession'

type RecipeCardProps = {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { session } = useSession()

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      state={{ recipe }}
      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-blue-300 hover:shadow-sm"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          {recipe.meal_type ? (
            <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {recipe.meal_type}
            </span>
          ) : (
            <span />
          )}
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-400">
              {Math.round(recipe.nutrition.calories)} kcal
            </span>
            <span className="text-[11px] text-slate-400">
              Serves {recipe.servings}
            </span>
          </div>
        </div>

        <h3 className="truncate font-bold text-slate-700">{recipe.title}</h3>

        {recipe.description && (
          <p className="line-clamp-2 text-xs text-slate-400">
            {recipe.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] text-slate-400">
        {recipe.cuisine_type ? (
          <span className="flex items-center gap-1 capitalize">
            <Utensils className="h-3 w-3" /> {recipe.cuisine_type}
          </span>
        ) : (
          <span />
        )}
        {recipe.creator?.display_name && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {recipe.creator.id === session?.user.id
              ? 'You'
              : recipe.creator.display_name}
          </span>
        )}
      </div>
    </Link>
  )
}