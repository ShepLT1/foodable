import { useState, useEffect, useRef } from 'react'
import { Save, X } from 'lucide-react'

import type { CreateListItemRequest } from '../../api/lists'

interface NewGroceryListItemRowProps {
  onSave: (data: CreateListItemRequest) => Promise<void>
  onCancel: () => void
}

export function NewGroceryListItemRow({
  onSave,
  onCancel,
}: NewGroceryListItemRowProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  async function handleSave() {
    if (saving) return

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Item name is required.')
      return
    }

    const parsedQty = Number(quantity)
    if (Number.isNaN(parsedQty) || parsedQty <= 0) {
      setError('Quantity must be greater than 0.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave({
        name: trimmedName,
        quantity: parsedQty,
        unit: unit.trim() || null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50/30 p-4 shadow-2xs space-y-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          ref={nameInputRef}
          type="text"
          value={name}
          placeholder="Item name (e.g., Organic Milk)"
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSave()
            if (e.key === 'Escape') onCancel()
          }}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />

        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.125"
            min="0.1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Qty"
            className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          <input
            type="text"
            value={unit}
            placeholder="Unit (e.g. carton)"
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSave()
              if (e.key === 'Escape') onCancel()
            }}
            className="w-28 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save size={14} />
            Save
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  )
}
