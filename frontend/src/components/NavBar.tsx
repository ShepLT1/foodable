import { Link } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { HeaderUserMenu } from './HeaderUserMenu'
import { MobileNav } from './MobileNav'
import { NAV_LINKS } from './navLinks'

export function NavBar() {
  const { data: user } = useCurrentUser()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-blue-600">Foodable</span>
        <nav className="hidden gap-4 font-medium text-gray-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-blue-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="hidden md:block">
        <HeaderUserMenu name={user?.display_name} email={user?.email} />
      </div>
      <MobileNav />
    </header>
  )
}
