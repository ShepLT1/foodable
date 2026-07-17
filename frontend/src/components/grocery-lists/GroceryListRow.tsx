import type { GroceryList } from "../../api/lists";
import { useDeleteGroceryList } from "../../hooks/useGroceryLists";

interface GroceryListRowProps {
  groceryList: GroceryList;
}

export function GroceryListRow({ groceryList }: GroceryListRowProps) {
  const deleteGroceryList = useDeleteGroceryList();

  const handleDelete = () => {
    deleteGroceryList.mutate(groceryList.id);
  };

  return (
    <div className="flex items-center justify-between max-w-xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <h2 className="text-lg font-semibold">{groceryList.title}</h2>

        <p className="mt-1 text-sm text-gray-500">
          Created {new Date(groceryList.created_at).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleteGroceryList.isPending}
        className="cursor-pointer rounded-md border border-red-600 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
