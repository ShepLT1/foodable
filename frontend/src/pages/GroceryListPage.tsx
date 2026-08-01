import { useParams } from 'react-router-dom'

import type { CreateListItemRequest, UpdateListItemRequest } from '../api/lists'
import { GroceryListHeader } from '../components/grocery-lists/GroceryListHeader'
import { GroceryListTable } from '../components/grocery-lists/GroceryListTable'
import {
  useCreateGroceryListItem,
  useDeleteGroceryListItem,
  useGroceryList,
  useUpdateGroceryList,
  useUpdateGroceryListItem,
} from '../hooks/useGroceryLists'

export function GroceryListPage() {
  const { listId } = useParams<{ listId: string }>()
  const { data: groceryList, isLoading, isError } = useGroceryList(listId ?? '')

  const updateListMutation = useUpdateGroceryList()
  const createItemMutation = useCreateGroceryListItem()
  const updateItemMutation = useUpdateGroceryListItem()
  const deleteItemMutation = useDeleteGroceryListItem()

  if (!listId) {
    return (
      <div className="p-8 text-center text-slate-500">
        Invalid grocery list.
      </div>
    )
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Loading grocery list...
        </div>
      </main>
    )
  }

  if (isError || !groceryList) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          Grocery list not found.
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <GroceryListHeader
        title={groceryList.title}
        onRename={async (title) => {
          await updateListMutation.mutateAsync({
            listId,
            data: { title },
          })
        }}
      />

      <GroceryListTable
        items={groceryList.items}
        onAddItem={async (data: CreateListItemRequest) => {
          await createItemMutation.mutateAsync({ listId, data })
        }}
        onUpdateItem={async (itemId: string, data: UpdateListItemRequest) => {
          await updateItemMutation.mutateAsync({ listId, itemId, data })
        }}
        onDeleteItem={async (itemId: string) => {
          await deleteItemMutation.mutateAsync({ listId, itemId })
        }}
      />
    </main>
  )
}
