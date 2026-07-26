import { api } from './client'

export type UserPublic = {
  id: string
  email: string
  display_name: string
  created_at: string
}

// owner's own view of their profile — matches GET /users/me (UserMe)
export type UserMe = {
  id: string
  email: string
  display_name: string
  created_at: string
  dietary_restrictions: string[]
  allergies: string[]
  preferences: string[]
  onboarded_at: string | null
}

// partial update — only provided fields are changed (PATCH /users/me)
export type ProfileUpdate = {
  display_name?: string
  dietary_restrictions?: string[]
  allergies?: string[]
  preferences?: string[]
}

export function getCurrentUser() {
  return api<UserMe>('/users/me')
}

export function updateCurrentUser(payload: ProfileUpdate) {
  return api<UserMe>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
