import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Modal } from './Modal'

const LAST_STEP = 3

const TITLES = [
  'Welcome to Foodable',
  'Dietary preferences',
  'Allergies & tastes',
  "You're all set!",
]

export function OnboardingModal() {
  const { data: user } = useCurrentUser()
  const [step, setStep] = useState(0)

  const open = !!user && user.onboarded_at == null

  return (
    <Modal open={open} title={TITLES[step]}>
      {/* TODO: step 0 — display name */}
      {/* TODO: step 1 — dietary ChipSelect */}
      {/* TODO: step 2 — allergies + preferences TagInputs */}
      {/* TODO: step 3 — completion screen + save + navigate to recipe gen */}
      <p className="text-sm text-gray-500">Step {step + 1} content</p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">Step {step + 1} of 4</span>

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

          {step < LAST_STEP ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Generate a recipe
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
