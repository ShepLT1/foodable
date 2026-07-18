import { useCurrentUser } from '../hooks/useCurrentUser'

export function ProfilePage() {
  const { data: user, isPending, error } = useCurrentUser()

  if (isPending) return <p>Loading...</p>
  if (error instanceof Error) return <p>Error: {error.message}</p>
  if (!user) return <p>No user found.</p>

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold">Profile</h2>

      {/* TODO: profile form sections */}
    </section>
  )
}
