import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { NAV_LINKS } from './navLinks'

// drawer based on the tailwind plus slide-over: https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/drawers
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="cursor-pointer text-gray-600 md:hidden"
      >
        <MenuIcon size={24} />
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50 md:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/40 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <DialogPanel
              transition
              className="flex w-64 transform flex-col bg-white shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-xl font-bold text-blue-600">
                  Foodable
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="cursor-pointer text-gray-500 hover:text-gray-900"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-4 py-2 font-medium text-gray-700">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-2 font-medium text-gray-500">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    setOpen(false)
                    supabase.auth.signOut()
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
