import { supabase } from './lib/supabase'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSession } from './hooks/useSession'
import { AuthForm } from './components/AuthForm'
import { NavBar } from './components/NavBar'
import { UserPage } from './pages/UserPage'

function App() {
  const { session, loading } = useSession()

  // 1. Wait out initial session check
  if (loading) return null

  // 2. If user is not logged in, show the Auth Form
  if (!session) {
    return <AuthForm />
  }

  // 3. If user is logged in, show the application with the new Router layout
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50 text-left">
        <NavBar />

        {/* Dynamic SPA Page Views */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<UserPage />} />
            <Route
              path="/recipes"
              element={
                <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Your Recipes
                  </h2>
                  <p className="mt-2 text-gray-600">
                    AI Meal plans and shared recipes will list out here.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Sign Out Action Footer */}
        <div className="p-8 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={() => supabase.auth.signOut()}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
