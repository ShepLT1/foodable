import { useCurrentUser } from '../hooks/useCurrentUser'
import { ProfileForm } from '../components/ProfileForm'

export function ProfilePage() {
  const { data: user, isPending, error } = useCurrentUser()

  if (isPending) return <p>Loading...</p>
  if (error instanceof Error) return <p>Error: {error.message}</p>
  if (!user) return <p>No user found.</p>

  return <ProfileForm user={user} />
}
