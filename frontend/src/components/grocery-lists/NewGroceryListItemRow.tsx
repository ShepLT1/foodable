import { useState, useEffect, useRef } from 'react'
import { Save, X } from 'lucide-react'

import type { CreateListItemRequest } from '../../api/lists'

interface NewGroceryListItemRowProps {
  onSave: (data: CreateListItemRequest) => Promise<void>
  onCancel: () => void
}

interface ValidationErrors {
  name?: string
  quantity?: string
}

export function NewGroceryListItemRow({
  onSave,
  onCancel,
}: NewGroceryListItemRowProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')

  const [saving, setSaving] = useState(false)

  const [errors, setErrors] = useState<ValidationErrors>({})

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  function validate(): boolean {
    const nextErrors: ValidationErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Ingredient name is required.'
    }

    const parsedQuantity = Number(quantity)

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      nextErrors.quantity = 'Quantity must be greater than 0.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSave() {
    if (saving) {
      return
    }

    if (!validate()) {
      return
    }

    setSaving(true)

    try {
      await onSave({
        name: name.trim(),
        quantity: Number(quantity),
        unit: unit.trim() || null,
      })
    } finally {
      setSaving(false)
    }
  }

  function handleNameChange(value: string) {
    setName(value)

    if (errors.name) {
      setErrors((previous) => ({
        ...previous,
        name: undefined,
      }))
    }
  }

  function handleQuantityChange(value: string) {
    setQuantity(value)

    if (errors.quantity) {
      setErrors((previous) => ({
        ...previous,
        quantity: undefined,
      }))
    }
  }

  {
    /* Desktop */
  }

  return (
    <>
      <div className="hidden grid-cols-[10rem_7rem_7rem_7rem_7rem] items-center gap-4 border-b border-slate-200 py-3 md:grid">
        <div>
          <input
            type="text"
            value={name}
            maxLength={200}
            placeholder="Item name"
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSave()
              }
            }}
            className={`w-full rounded border px-2 py-1 ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300'
            }`}
            ref={nameInputRef}
          />
        </div>

        <div className="flex justify-center">
          <div>
            <input
              type="number"
              min={0}
              step={0.125}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleSave()
                }
              }}
              className={`w-20 rounded border px-2 py-1 text-center ${
                errors.quantity
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <input
            type="text"
            maxLength={50}
            value={unit}
            placeholder="Unit"
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSave()
              }
            }}
            className="w-30 rounded border border-slate-300 px-2 py-1"
          />
        </div>

        <div />

        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-50"
            title="Save"
          >
            <Save size={18} />
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mobile */}

      <div className="rounded-lg border border-slate-200 p-4 md:hidden">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={name}
              maxLength={100}
              placeholder="Item name"
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleSave()
                }
              }}
              className={`w-42 rounded border px-2 py-1 ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300'
              }`}
              ref={nameInputRef}
            />

            <button
              type="button"
              disabled={saving}
              onClick={onCancel}
              className="rounded h-5 w-5 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              step={0.125}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleSave()
                }
              }}
              className={`w-20 rounded border px-2 py-1 text-center ${
                errors.quantity
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300'
              }`}
            />

            <input
              type="text"
              maxLength={50}
              value={unit}
              placeholder="Unit"
              onChange={(e) => setUnit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleSave()
                }
              }}
              className="w-20 rounded border border-slate-300 px-2 py-1"
            />
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="rounded h-5 w-5 text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            <Save size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
