import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { GroceryList } from "../api/lists";
import {
  createList,
  createListItem,
  deleteList,
  deleteListItem,
  getList,
  getLists,
  updateList,
  updateListItem,
} from "../api/lists";

export const groceryListKeys = {
  all: ["grocery-lists"] as const,
  detail: (listId: string) => ["grocery-lists", listId] as const,
};

function updateListInCache(
  lists: GroceryList[] | undefined,
  updatedList: GroceryList,
) {
  return lists?.map((list) =>
    list.id === updatedList.id ? updatedList : list,
  );
}

function removeListFromCache(lists: GroceryList[] | undefined, listId: string) {
  return lists?.filter((list) => list.id !== listId);
}

function updateGroceryListCaches(
  queryClient: QueryClient,
  updatedList: GroceryList,
) {
  queryClient.setQueryData(groceryListKeys.detail(updatedList.id), updatedList);

  queryClient.setQueryData<GroceryList[]>(groceryListKeys.all, (lists) =>
    updateListInCache(lists, updatedList),
  );
}

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

      queryClient.setQueryData(groceryListKeys.detail(newList.id), newList);
    },
  });
}

export function useUpdateGroceryList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateList,

    onSuccess: (updatedList) => {
      updateGroceryListCaches(queryClient, updatedList);
    },
  });
}

export function useDeleteGroceryList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,

    onSuccess: ({ id }) => {
      queryClient.setQueryData<GroceryList[]>(groceryListKeys.all, (lists) =>
        removeListFromCache(lists, id),
      );

      queryClient.removeQueries({
        queryKey: groceryListKeys.detail(id),
      });
    },
  });
}

export function useCreateGroceryListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListItem,

    onSuccess: (updatedList) => {
      updateGroceryListCaches(queryClient, updatedList);
    },
  });
}

export function useUpdateGroceryListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateListItem,

    onSuccess: (updatedList) => {
      updateGroceryListCaches(queryClient, updatedList);
    },
  });
}

export function useDeleteGroceryListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListItem,

    onSuccess: (updatedList) => {
      updateGroceryListCaches(queryClient, updatedList);
    },
  });
}