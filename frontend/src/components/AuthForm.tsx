import { useState, type SyntheticEvent } from 'react'
import { supabase } from '../lib/supabase'

// Basic combined login / register form.
export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    setSubmitting(false)
    // On success the session updates via onAuthStateChange — no manual redirect needed.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 p-8 text-left shadow-md"
    >
      <h1 className="text-center text-2xl font-semibold">
        {mode === 'login' ? 'Sign In' : 'Register'}
      </h1>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-lg bg-blue-600 py-2.5 text-base font-semibold text-white disabled:cursor-default disabled:opacity-60"
      >
        {submitting ? '…' : mode === 'login' ? 'Sign In' : 'Register'}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login')
          setError(null)
        }}
        className="cursor-pointer text-sm text-blue-600"
      >
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Have an account? Sign In'}
      </button>
    </form>
  )
}
