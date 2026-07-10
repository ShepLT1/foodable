import { supabase } from './lib/supabase'
import { useSession } from './hooks/useSession'
import { AuthForm } from './components/AuthForm'
import { UserPage } from './pages/UserPage'

function App() {
  const { session, loading } = useSession()

  if (loading) return null // initial session check

  if (!session) {
    return (
      <main>
        <AuthForm />
      </main>
    )
  }

  return (
    <main className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Foodable</h1>

      <UserPage />

      <button
        onClick={() => supabase.auth.signOut()}
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        Sign Out
      </button>
    </main>
  );
}

export default App
