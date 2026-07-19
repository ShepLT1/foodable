import { api } from './client'

export interface UserPublic {
  id: string
  email: string
  display_name: string
}

export function getCurrentUser() {
  return api<UserPublic>('/users/me')
}
