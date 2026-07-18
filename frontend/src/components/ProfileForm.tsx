import { useState, type SyntheticEvent } from 'react'
import type { UserMe } from '../api/users'
import { useUpdateCurrentUser } from '../hooks/useUpdateCurrentUser'
import { TagInput } from './TagInput'
import { ChipSelect } from './ChipSelect'

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
  'Low-Carb',
]

export function ProfileForm({ user }: { user: UserMe }) {
  const update = useUpdateCurrentUser()

  const [displayName, setDisplayName] = useState(user.display_name)
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    user.dietary_restrictions,
  )
  const [allergies, setAllergies] = useState(user.allergies)
  const [preferences, setPreferences] = useState(user.preferences)

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    update.mutate({
      display_name: displayName.trim(),
      dietary_restrictions: dietaryRestrictions,
      allergies,
      preferences,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-semibold">Profile</h2>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Display Name
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="rounded-lg border border-gray-300 px-3 py-2 text-base font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </label>

      <div>
        <p className="text-sm font-medium text-gray-700">Email</p>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <ChipSelect
        label="Dietary Restrictions"
        options={DIETARY_OPTIONS}
        value={dietaryRestrictions}
        onChange={setDietaryRestrictions}
      />
      <TagInput label="Allergies" value={allergies} onChange={setAllergies} />
      <TagInput
        label="Preferences"
        value={preferences}
        onChange={setPreferences}
      />

      {update.error instanceof Error && (
        <p role="alert" className="text-sm text-red-700">
          {update.error.message}
        </p>
      )}

      {update.isSuccess && <p className="text-sm text-green-700">Saved.</p>}

      <button
        type="submit"
        disabled={update.isPending}
        className="cursor-pointer rounded-lg bg-blue-600 py-2.5 text-base font-semibold text-white disabled:cursor-default disabled:opacity-60"
      >
        {update.isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
