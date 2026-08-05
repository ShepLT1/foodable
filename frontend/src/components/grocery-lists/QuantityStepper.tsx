import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { formatQuantity, parseQuantity } from '../../utils/quantity'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max,
  step = 0.125,
  disabled = false,
  className = '',
}: QuantityStepperProps) {
  const [text, setText] = useState(formatQuantity(value))
  const [editing, setEditing] = useState(false)

  function clamp(value: number) {
    let next = value

    if (next < min) next = min
    if (max !== undefined && next > max) next = max

    return next
  }

  function roundToStep(value: number) {
    return Math.round(value / step) * step
  }

  function changeQuantity(delta: number) {
    const next = clamp(roundToStep(value + delta))

    onChange(next)
  }

  function commit() {
    const parsed = parseQuantity(text)

    if (parsed === null) {
      setText(formatQuantity(value))
      setEditing(false)
      return
    }

    const next = clamp(roundToStep(parsed))

    onChange(next)
    setEditing(false)
  }

  return (
    <div
      className={`flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => changeQuantity(-step)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center border-r border-slate-300 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Minus size={14} />
      </button>

      <input
        type="text"
        value={editing ? text : formatQuantity(value)}
        disabled={disabled}
        onFocus={() => {
          setEditing(true)
          setText(formatQuantity(value))
        }}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          commit()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit()
            e.currentTarget.blur()
          }

          if (e.key === 'Escape') {
            setEditing(false)
            setText(formatQuantity(value))
            e.currentTarget.blur()
          }
        }}
        className="w-12 border-0 bg-transparent px-2 text-center text-sm font-medium focus:outline-none disabled:cursor-not-allowed"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => changeQuantity(step)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center border-l border-slate-300 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
