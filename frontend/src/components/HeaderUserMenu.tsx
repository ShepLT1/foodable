import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { UserAvatar } from './UserAvatar'

type HeaderUserMenuProps = {
  name?: string
  email?: string
}

// built on @headlessui/react's menu: https://headlessui.com/react/menu
export function HeaderUserMenu({ name, email }: HeaderUserMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <Menu>
      {({ open }) => (
        <div
          className="relative"
          onMouseEnter={() => {
            if (!open) buttonRef.current?.click()
          }}
          onMouseLeave={() => {
            if (open) buttonRef.current?.click()
          }}
        >
          <MenuButton
            ref={buttonRef}
            aria-label="Account menu"
            className="block cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-blue-200"
          >
            <UserAvatar name={name} />
          </MenuButton>

          <MenuItems
            transition
            // top-full + pt-2 bridges the gap so hover survives avatar -> panel
            className="absolute right-0 top-full z-50 w-56 origin-top-right pt-2 outline-none transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {name ?? 'Account'}
                </p>
                {email && (
                  <p className="truncate text-xs text-gray-500">{email}</p>
                )}
              </div>

              <MenuItem>
                <Link
                  to="/profile"
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                >
                  View Profile
                </Link>
              </MenuItem>

              <MenuItem>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100"
                >
                  Sign Out
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </div>
      )}
    </Menu>
  )
}
