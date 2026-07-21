import { z } from 'zod'
import { api } from './client'
import {
  groceryListResponseSchema,
  type GroceryList,
  type GroceryListItem,
} from '../schemas/grocery'

// Single source of truth: re-export types so components import them seamlessly
export type { GroceryList, GroceryListItem }

export interface CreateListRequest {
  title: string
}

export interface UpdateListRequest {
  title: string
}

interface UpdateListParams {
  listId: string
  data: UpdateListRequest
}

export interface CreateListItemRequest {
  name: string
  quantity: number
  unit?: string | null
}

interface CreateListItemParams {
  listId: string
  data: CreateListItemRequest
}

export interface UpdateListItemRequest {
  name?: string
  quantity?: number
  unit?: string | null
  checked?: boolean
}

interface UpdateListItemParams {
  listId: string
  itemId: string
  data: UpdateListItemRequest
}

export interface DeleteListResponse {
  id: string
}

interface DeleteListItemParams {
  listId: string
  itemId: string
}

// Grocery List API request handlers
export async function getLists(): Promise<GroceryList[]> {
  const data = await api<unknown>('/lists')
  return z.array(groceryListResponseSchema).parse(data)
}

export async function getList(listId: string): Promise<GroceryList> {
  const data = await api<unknown>(`/lists/${listId}`)
  return groceryListResponseSchema.parse(data)
}

export async function createList(
  data: CreateListRequest,
): Promise<GroceryList> {
  const res = await api<unknown>('/lists', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return groceryListResponseSchema.parse(res)
}

export async function updateList({
  listId,
  data,
}: UpdateListParams): Promise<GroceryList> {
  const res = await api<unknown>(`/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return groceryListResponseSchema.parse(res)
}

export async function deleteList(listId: string): Promise<DeleteListResponse> {
  return api<DeleteListResponse>(`/lists/${listId}`, {
    method: 'DELETE',
  })
}

// Grocery List Item API request handlers
export async function createListItem({
  listId,
  data,
}: CreateListItemParams): Promise<GroceryList> {
  const res = await api<unknown>(`/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return groceryListResponseSchema.parse(res)
}

export async function updateListItem({
  listId,
  itemId,
  data,
}: UpdateListItemParams): Promise<GroceryList> {
  const res = await api<unknown>(`/lists/${listId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return groceryListResponseSchema.parse(res)
}

export async function deleteListItem({
  listId,
  itemId,
}: DeleteListItemParams): Promise<GroceryList> {
  const res = await api<unknown>(`/lists/${listId}/items/${itemId}`, {
    method: 'DELETE',
  })
  return groceryListResponseSchema.parse(res)
}
