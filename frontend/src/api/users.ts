import { api } from './client'

// Public view of another user
export type UserPublic = {
  id: string
  display_name: string
  created_at: string
}

// Owner's view of their own profile
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

export type ProfileUpdate = {
  display_name?: string
  dietary_restrictions?: string[]
  allergies?: string[]
  preferences?: string[]
}

// Social / Follower types
export type FollowUserSummary = {
  id: string
  display_name: string
  created_at: string
}

export type FollowStatsResponse = {
  follower_count: number
  following_count: number
  is_following: boolean
}

export type FollowActionResponse = {
  success: boolean
  message: string
}

// User API Handlers
export function getCurrentUser() {
  return api<UserMe>('/users/me')
}

export function getUser(userId: string) {
  return api<UserPublic>(`/users/${userId}`)
}

export function updateCurrentUser(payload: ProfileUpdate) {
  return api<UserMe>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

// Social API Handlers
export function getFollowStats(userId: string) {
  return api<FollowStatsResponse>(`/users/${userId}/stats`)
}

export function getFollowers(userId: string) {
  return api<FollowUserSummary[]>(`/users/${userId}/followers`)
}

export function getFollowing(userId: string) {
  return api<FollowUserSummary[]>(`/users/${userId}/following`)
}

export function followUser(userId: string) {
  return api<FollowActionResponse>(`/users/${userId}/follow`, {
    method: 'POST',
  })
}

export function unfollowUser(userId: string) {
  return api<FollowActionResponse>(`/users/${userId}/follow`, {
    method: 'DELETE',
  })
}
