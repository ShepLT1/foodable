import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  followUser,
  getFollowers,
  getFollowing,
  getFollowStats,
  unfollowUser,
} from '../api/users'

export const followKeys = {
  stats: (userId: string) => ['follows', 'stats', userId] as const,
  followers: (userId: string) => ['follows', 'followers', userId] as const,
  following: (userId: string) => ['follows', 'following', userId] as const,
}

export function useFollowStats(userId: string) {
  return useQuery({
    queryKey: followKeys.stats(userId),
    queryFn: () => getFollowStats(userId),
    enabled: !!userId,
  })
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  })
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: followKeys.stats(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: followKeys.stats(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) })
    },
  })
}
