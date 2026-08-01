import { useQuery } from '@tanstack/react-query'
import { getUser } from '../api/users'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })
}
