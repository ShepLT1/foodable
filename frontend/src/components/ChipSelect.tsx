type ChipSelectProps = {
  label: string
  sublabel?: string
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}

export function ChipSelect({
  label,
  sublabel,
  options,
  value,
  onChange,
}: ChipSelectProps) {
  // surface any selected values that aren't in the preset options, so nothing hides
  const allOptions = [...options, ...value.filter((v) => !options.includes(v))]

  function toggle(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      <div className="flex flex-wrap gap-1.5">
        {allOptions.map((option) => {
          const selected = value.includes(option)
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
    </div>
  )
}
