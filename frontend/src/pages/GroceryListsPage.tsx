import { GroceryListRow } from "../components/grocery-lists/GroceryListRow";
import {
  useCreateGroceryList,
  useGroceryLists,
} from "../hooks/useGroceryLists";

export function GroceryListsPage() {
  const { data: groceryLists = [], isPending, error } = useGroceryLists();

  const createGroceryList = useCreateGroceryList();

  const handleCreateList = () => {
    createGroceryList.mutate({
      title: "New Grocery List",
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Grocery Lists</h1>

        <button
          onClick={handleCreateList}
          disabled={createGroceryList.isPending}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New Grocery List
        </button>
      </div>

      {isPending && <p className="text-gray-500">Loading grocery lists...</p>}

      {error && <p className="text-red-600">Unable to load grocery lists.</p>}

      {!isPending && !error && (
        <>
          {groceryLists.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-gray-500">
              No grocery lists yet.
            </div>
          ) : (
            <div className="space-y-3">
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
  );
}
