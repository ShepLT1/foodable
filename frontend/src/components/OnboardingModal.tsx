import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useUpdateCurrentUser } from '../hooks/useUpdateCurrentUser'
import { DIETARY_OPTIONS } from '../constants'
import { Modal } from './Modal'
import { ChipSelect } from './ChipSelect'
import { TagInput } from './TagInput'

const TITLES = [
  'Welcome to Foodable!',
  "Let's get you set up",
  'Any dietary preferences?',
  'Anything we should avoid?',
  'Any foods you love?',
  "Let's cook!",
]

const BLURBS = [
  '',
  "This is how you'll show up to other users on Foodable.",
  "We'll tailor recipes to your dietary needs.",
  "We'll avoid these in recipes.",
  "Tell us the foods, seasonings, and cuisines you love - we'll try to incorporate these more often into recipes.",
  "That's everything we need.",
]

const LAST_STEP = TITLES.length - 1

export function OnboardingModal() {
  const { data: user } = useCurrentUser()
  const update = useUpdateCurrentUser()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  // seed the form once from the loaded profile
  if (user && !ready) {
    setDisplayName(user.display_name)
    setDietaryRestrictions(user.dietary_restrictions)
    setAllergies(user.allergies)
    setPreferences(user.preferences)
    setReady(true)
  }

  const open = !!user && user.onboarded_at == null

  // saving stamps onboarded_at, closing the gate so this modal unmounts
  async function finish() {
    await update.mutateAsync({
      display_name: displayName.trim(),
      dietary_restrictions: dietaryRestrictions,
      allergies,
      preferences,
    })
    navigate('/recipes/new')
  }

  return (
    <Modal open={open} title={TITLES[step]}>
      <p className="-mt-2 text-sm text-gray-500">{BLURBS[step]}</p>

      {step === 0 && (
        <>
          <p className="text-gray-600">
            Let's get your profile setup! It'll only take a minute
          </p>
          <p className="mt-2 text-gray-600">
            (You can change these setting at any time from your profile page.)
          </p>
        </>
      )}

      {step === 1 && (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={100}
            placeholder="e.g. Jane Doe"
            className="rounded-lg border border-gray-300 px-3 py-2 text-base font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>
      )}

      {step === 2 && (
        <ChipSelect
          label="Dietary restrictions"
          options={DIETARY_OPTIONS}
          value={dietaryRestrictions}
          onChange={setDietaryRestrictions}
        />
      )}

      {step === 3 && (
        <TagInput
          label="Allergies"
          placeholder="e.g. peanuts"
          value={allergies}
          onChange={setAllergies}
        />
      )}

      {step === 4 && (
        <TagInput
          label="Preferences"
          placeholder="e.g. spicy food"
          value={preferences}
          onChange={setPreferences}
        />
      )}

      {step === 5 && (
        <p className="text-gray-600">
          {"Now you're ready to "}
          <button
            type="button"
            onClick={finish}
            disabled={update.isPending}
            className="cursor-pointer text-blue-600 hover:underline disabled:opacity-60"
          >
            create a recipe
          </button>
          {'!'}
        </p>
      )}

      {update.error instanceof Error && (
        <p role="alert" className="text-sm text-red-700">
          {update.error.message}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Step {step + 1} of {TITLES.length}
        </span>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
          )}

          {step < LAST_STEP && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && displayName.trim().length === 0}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-default disabled:opacity-60"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
