import { useState } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

type ComboboxSelectProps = {
  label: string
  options: readonly string[]
  value: string | null
  onChange: (next: string | null) => void
  placeholder?: string
  allowCustom?: boolean
}

// single combobox input/select hybrid based on @headlessui/react's combobox:
// https://headlessui.com/react/combobox
export function ComboboxSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  allowCustom,
}: ComboboxSelectProps) {
  const [query, setQuery] = useState('')

  const trimmed = query.trim()
  const filtered =
    trimmed === ''
      ? options
      : options.filter((o) => o.toLowerCase().includes(trimmed.toLowerCase()))

  const showCustom =
    allowCustom &&
    trimmed !== '' &&
    !options.some((o) => o.toLowerCase() === trimmed.toLowerCase())

  return (
    <Combobox
      immediate
      value={value}
      onChange={onChange}
      onClose={() => setQuery('')}
    >
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {label}
        <div className="relative">
          <ComboboxInput
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-base font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder={placeholder}
            displayValue={(v: string | null) => v ?? ''}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600">
            <ChevronDown size={18} />
          </ComboboxButton>
        </div>
      </label>

      <ComboboxOptions
        anchor="bottom start"
        className="w-[var(--input-width)] rounded-lg border border-gray-200 bg-white p-1 shadow-lg empty:invisible"
      >
        {filtered.map((option) => (
          <ComboboxOption
            key={option}
            value={option}
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-gray-700 data-[focus]:bg-blue-50"
          >
            {option}
          </ComboboxOption>
        ))}

        {showCustom && (
          <ComboboxOption
            value={trimmed}
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-gray-700 data-[focus]:bg-blue-50"
          >
            {`Use "${trimmed}"`}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
