import { useState, type KeyboardEvent } from 'react'

type TagInputProps = {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

/**
 * Input which allows user to type to enter values, then press enter/tab to save
 * those values to a compiled list
 *
 */
export function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: TagInputProps) {
  const [draft, setDraft] = useState('')

  function add() {
    const tag = draft.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 px-2 py-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="cursor-pointer text-blue-500 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={add}
          placeholder={placeholder}
          className="min-w-24 flex-1 border-none bg-transparent py-0.5 text-base font-normal focus:outline-none"
        />
      </div>
    </label>
  )
}
