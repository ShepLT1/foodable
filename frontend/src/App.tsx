import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSession } from './hooks/useSession'
import { AuthForm } from './components/AuthForm'
import { NavBar } from './components/NavBar'
import { UserPage } from './pages/UserPage'
import { ProfilePage } from './pages/ProfilePage'
import { GroceryListsPage } from './pages/GroceryListsPage'
import { GroceryListPage } from './pages/GroceryListPage'
import { RecipeGeneratePage } from './pages/RecipeGeneratePage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { OnboardingModal } from './components/OnboardingModal'

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
      <div className="flex min-h-screen flex-col text-left bg-slate-50">
        <OnboardingModal />
        <NavBar />

        {/* Dynamic SPA Page Views */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<UserPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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
            <Route path="/recipes/new" element={<RecipeGeneratePage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/lists" element={<GroceryListsPage />} />
            <Route path="/lists/:listId" element={<GroceryListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
