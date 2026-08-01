import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Trash2, ShoppingBag } from 'lucide-react'

import type { GroceryList } from '../../api/lists'
import { useDeleteGroceryList } from '../../hooks/useGroceryLists'

interface GroceryListRowProps {
  groceryList: GroceryList
}

export function GroceryListRow({ groceryList }: GroceryListRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteGroceryList = useDeleteGroceryList()

  const completedCount = groceryList.items.filter((item) => item.checked).length
  const totalCount = groceryList.items.length

  return (
    <div>
      <Link
        to={`/lists/${groceryList.id}`}
        className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-gray-900">
              {groceryList.title}
            </h2>

            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <ShoppingBag size={14} />
                {completedCount}/{totalCount} items completed
              </span>
              <span>•</span>
              <span>
                Created {new Date(groceryList.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setConfirmDelete(true)
            }}
            className="cursor-pointer rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${groceryList.title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </Link>

      <Dialog
        open={confirmDelete}
        onClose={setConfirmDelete}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete grocery list?
            </DialogTitle>

            <p className="mt-2 text-sm text-gray-600">
              "{groceryList.title}" and all of its items will be permanently
              removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteGroceryList.isPending}
                onClick={() =>
                  deleteGroceryList.mutate(groceryList.id, {
                    onSuccess: () => setConfirmDelete(false),
                  })
                }
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteGroceryList.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
