import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import type { FollowUserSummary } from '../api/users'

type FollowListDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  users: FollowUserSummary[]
  isLoading?: boolean
}

export function FollowListDialog({
  open,
  onClose,
  title,
  users,
  isLoading,
}: FollowListDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {title}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {isLoading ? (
            <p className="p-4 text-center text-sm text-slate-500">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-400">
              No users found.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-slate-50"
                >
                  <UserAvatar name={user.display_name} size="sm" />
                  <span className="text-sm font-semibold text-slate-800">
                    {user.display_name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
