import { useState } from 'react'

type SingleChipSelectProps = {
  label: string
  sublabel?: string
  options: string[]
  value: string | null
  onChange: (next: string | null) => void
  allowCustom?: boolean
}

export function SingleChipSelect({
  label,
  sublabel,
  options,
  value,
  onChange,
  allowCustom,
}: SingleChipSelectProps) {
  const [customDraft, setCustomDraft] = useState('')

  // Surface selected value that isn't a preset option to be not be hidden
  const allOptions =
    value && !options.includes(value) ? [...options, value] : options

  function toggle(option: string) {
    onChange(value === option ? null : option)
  }

  function submitCustom() {
    const trimmed = customDraft.trim()
    if (trimmed) {
      onChange(trimmed)
      setCustomDraft('')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      <div className="flex flex-wrap gap-1.5">
        {allOptions.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={selected}
              className={
                selected
                  ? 'cursor-pointer rounded-full bg-blue-600 px-3 py-1 text-sm text-white'
                  : 'cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200'
              }
            >
              {option}
            </button>
          )
        })}
      </div>
      {allowCustom && (
        <input
          type="text"
          value={customDraft}
          onChange={(e) => setCustomDraft(e.target.value)}
          onBlur={submitCustom}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitCustom()
            }
          }}
          placeholder="Or type your own"
          className="mt-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      )}
    </div>
  )
}
