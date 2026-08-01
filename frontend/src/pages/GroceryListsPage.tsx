import { useNavigate } from 'react-router-dom'
import { Plus, ShoppingCart } from 'lucide-react'
import { GroceryListRow } from '../components/grocery-lists/GroceryListRow'
import { useCreateGroceryList, useGroceryLists } from '../hooks/useGroceryLists'

export function GroceryListsPage() {
  const { data: groceryLists = [], isPending, error } = useGroceryLists()
  const navigate = useNavigate()

  const createGroceryList = useCreateGroceryList()

  async function handleCreateList() {
    const newList = await createGroceryList.mutateAsync({
      title: 'New Grocery List',
    })

    navigate(`/lists/${newList.id}`)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grocery Lists</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your shopping items or generate lists automatically from meal
            plans.
          </p>
        </div>

        <button
          onClick={handleCreateList}
          disabled={createGroceryList.isPending}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          New Grocery List
        </button>
      </div>

      {isPending && (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading grocery lists...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          Unable to load grocery lists.
        </div>
      )}

      {!isPending && !error && (
        <>
          {groceryLists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShoppingCart size={24} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                No grocery lists yet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new list or generate one directly from your meal plans.
              </p>
              <button
                type="button"
                onClick={handleCreateList}
                disabled={createGroceryList.isPending}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus size={18} />
                Create Grocery List
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {groceryLists.map((groceryList) => (
                <GroceryListRow
                  key={groceryList.id}
                  groceryList={groceryList}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
