import { Link } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { HeaderUserMenu } from './HeaderUserMenu'

export function NavBar() {
  const { data: user } = useCurrentUser()

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
          <Link to="/lists" className="hover:text-blue-600">
            Grocery Lists
          </Link>
        </nav>
      </div>

      <HeaderUserMenu name={user?.display_name} email={user?.email} />
    </header>
  )
}
