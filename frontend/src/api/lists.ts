import { api } from "./client";

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  user_id: string;
  title: string;
  items: GroceryListItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateListRequest {
  title: string;
}

export interface UpdateListRequest {
  title: string;
}

export interface CreateListItemRequest {
  name: string;
  quantity: number;
  unit?: string | null;
}

export interface UpdateListItemRequest {
  name?: string;
  quantity?: number;
  unit?: string | null;
  checked?: boolean;
}

export interface DeleteListResponse {
  id: string;
}

// Grocery List API request handlers
export function getLists() {
  return api<GroceryList[]>("/lists");
}

export function createList(data: CreateListRequest) {
  return api<GroceryList>("/lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getList(listId: string) {
  return api<GroceryList>(`/lists/${listId}`);
}

export function updateList(listId: string, data: UpdateListRequest) {
  return api<GroceryList>(`/lists/${listId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteList(listId: string) {
  return api<DeleteListResponse>(`/lists/${listId}`, {
    method: "DELETE",
  });
}

// Grocery List Item API request handlers
export function createListItem(listId: string, data: CreateListItemRequest) {
  return api<GroceryList>(`/lists/${listId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateListItem(
  listId: string,
  itemId: string,
  data: UpdateListItemRequest,
) {
  return api<GroceryList>(`/lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteListItem(listId: string, itemId: string) {
  return api<GroceryList>(`/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });
}
