import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  followUser,
  getFollowers,
  getFollowing,
  getFollowStats,
  unfollowUser,
} from '../api/users'

export function useFollowStats(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'follow-stats'],
    queryFn: () => getFollowStats(userId),
    enabled: !!userId,
  })
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'followers'],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  })
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'following'],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}