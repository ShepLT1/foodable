import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-blue-600">Foodable</span>
        <nav className="flex gap-4 font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/recipes" className="hover:text-blue-600">
            Recipes
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => supabase.auth.signOut()}
          className="cursor-pointer rounded-lg bg-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
