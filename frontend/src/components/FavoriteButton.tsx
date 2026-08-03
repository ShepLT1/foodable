import { Heart } from 'lucide-react'
import { useToggleFavorite } from '../hooks/useRecipes'

type FavoriteButtonProps = {
  recipeId: string
  isFavorited: boolean
}

export function FavoriteButton({ recipeId, isFavorited }: FavoriteButtonProps) {
  const toggle = useToggleFavorite()

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
      onClick={(e) => {
        // card/detail may wrap this in a link — don't navigate
        e.preventDefault()
        e.stopPropagation()
        toggle.mutate({ recipeId, isFavorited: !isFavorited })
      }}
      className="cursor-pointer rounded-full p-1 text-slate-400 transition hover:bg-slate-100"
    >
      <Heart
        size={18}
        className={isFavorited ? 'fill-red-500 text-red-500' : ''}
      />
    </button>
  )
}
