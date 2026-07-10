import { useCurrentUser } from "../hooks/useCurrentUser";

export function UserPage() {
  const { data: user, isPending, error } = useCurrentUser();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error instanceof Error) {
    return <p>Error: {error.message}</p>;
  }

  if (!user) {
    return <p>No user found.</p>;
  }

  return (
    <section className="w-full rounded-lg border p-4">
      <h2 className="mb-2 text-xl font-semibold">Current User</h2>

      <p>
        <strong>ID:</strong> {user.id}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Display Name:</strong> {user.display_name}
      </p>
    </section>
  );
}
