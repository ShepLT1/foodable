import { api } from "./client";

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  checked: boolean;
  created_at: string;
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

interface UpdateListParams {
  listId: string;
  data: UpdateListRequest;
}

export interface CreateListItemRequest {
  name: string;
  quantity: number;
  unit?: string | null;
}

interface CreateListItemParams {
  listId: string;
  data: CreateListItemRequest;
}

export interface UpdateListItemRequest {
  name?: string;
  quantity?: number;
  unit?: string | null;
  checked?: boolean;
}

interface UpdateListItemParams {
  listId: string;
  itemId: string;
  data: UpdateListItemRequest;
}

export interface DeleteListResponse {
  id: string;
}

interface DeleteListItemParams {
  listId: string;
  itemId: string;
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

export function updateList({ listId, data }: UpdateListParams) {
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
export function createListItem({ listId, data }: CreateListItemParams) {
  return api<GroceryList>(`/lists/${listId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateListItem({ listId, itemId, data }: UpdateListItemParams) {
  return api<GroceryList>(`/lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteListItem({ listId, itemId }: DeleteListItemParams) {
  return api<GroceryList>(`/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });
}
