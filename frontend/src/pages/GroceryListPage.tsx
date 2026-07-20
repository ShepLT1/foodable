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
    return <div className="p-8">Invalid grocery list.</div>
  }

  const groceryListId = listId

  async function handleRename(title: string) {
    await updateListMutation.mutateAsync({
      listId: groceryListId,
      data: {
        title,
      },
    })
  }

  async function handleAddItem(data: CreateListItemRequest) {
    await createItemMutation.mutateAsync({
      listId: groceryListId,
      data,
    })
  }

  async function handleUpdateItem(itemId: string, data: UpdateListItemRequest) {
    await updateItemMutation.mutateAsync({
      listId: groceryListId,
      itemId,
      data,
    })
  }

  async function handleDeleteItem(itemId: string) {
    await deleteItemMutation.mutateAsync({
      listId: groceryListId,
      itemId,
    })
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading grocery list...
        </div>
      </main>
    )
  }

  if (isError || !groceryList) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
          Grocery list not found.
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <GroceryListHeader title={groceryList.title} onRename={handleRename} />

      <GroceryListTable
        items={groceryList.items}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    </main>
  )
}
