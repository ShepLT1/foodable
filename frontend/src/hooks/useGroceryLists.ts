import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { GroceryList } from "../api/lists";
import { createList, deleteList, getList, getLists } from "../api/lists";

export const groceryListKeys = {
  all: ["grocery-lists"] as const,
  detail: (listId: string) => ["grocery-lists", listId] as const,
};

export function useGroceryLists() {
  return useQuery({
    queryKey: groceryListKeys.all,
    queryFn: getLists,
  });
}

export function useGroceryList(listId: string) {
  return useQuery({
    queryKey: groceryListKeys.detail(listId),
    queryFn: () => getList(listId),
    enabled: !!listId,
  });
}

export function useCreateGroceryList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,

    onSuccess: (newList) => {
      queryClient.setQueryData<GroceryList[]>(groceryListKeys.all, (lists) =>
        lists ? [...lists, newList] : lists,
      );
    },
  });
}

export function useDeleteGroceryList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,

    onSuccess: ({ id }) => {
      queryClient.setQueryData<GroceryList[]>(groceryListKeys.all, (lists) =>
        lists?.filter((list) => list.id !== id),
      );
    },
  });
}
