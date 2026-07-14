import { useState, type SyntheticEvent } from 'react'
import { supabase } from '../lib/supabase'
import { z } from 'zod' // 👈 Import Zod validation library

// 1. Define the validation schema
const authSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

// 2. Clear out malicious HTML/Script tags before processing string vectors
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // 3. Apply text sanitization routines
    const cleanEmail = sanitizeInput(email)
    const cleanPassword = sanitizeInput(password)

    // 4. Safe-parse the clean data against our schema rules
    const validationResult = authSchema.safeParse({ email: cleanEmail, password: cleanPassword })

    if (!validationResult.success) {
      // Catch the first Zod rule violation and flag it on screen
      const firstErrorMessage = validationResult.error.errors[0].message
      setError(firstErrorMessage)
      return // 👈 Halts submission early before calling out to any API network layers
    }

    setSubmitting(true)

    // 5. Submit valid, clean inputs down to Supabase engine
    const { error: supabaseError } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
        : await supabase.auth.signUp({ email: cleanEmail, password: cleanPassword })

    if (supabaseError) setError(supabaseError.message)
    setSubmitting(false)
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
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign In'}
      </button>
    </form>
  )
}