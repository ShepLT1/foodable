import { useState, useEffect } from 'react'
import { Checkbox } from '@headlessui/react'
import { Check, Trash2 } from 'lucide-react'

import type { GroceryListItem, UpdateListItemRequest } from '../../api/lists'
import { QuantityStepper } from './QuantityStepper'
interface GroceryListItemRowProps {
  item: GroceryListItem
  onUpdate: (itemId: string, data: UpdateListItemRequest) => Promise<void>
  onDelete: (itemId: string) => Promise<void>
}

export function GroceryListItemRow({
  item,
  onUpdate,
  onDelete,
}: GroceryListItemRowProps) {
  const [quantity, setQuantity] = useState(Number(item.quantity))
  const [unit, setUnit] = useState(item.unit ?? '')

  async function saveUnit() {
    const trimmed = unit.trim()
    if (trimmed === (item.unit ?? '')) return
    await onUpdate(item.id, { unit: trimmed || null })
  }

  function cancelUnit() {
    setUnit(item.unit ?? '')
  }

  useEffect(() => {
    if (quantity === Number(item.quantity)) return

    const timeout = setTimeout(() => {
      void onUpdate(item.id, { quantity })
    }, 500)

    return () => clearTimeout(timeout)
  }, [quantity, item.id, item.quantity, onUpdate])

  return (
    <div
      className={`group rounded-xl border p-3.5 transition ${
        item.checked
          ? 'border-slate-200 bg-slate-50/70 text-slate-400'
          : 'border-slate-200 bg-white text-slate-800 shadow-2xs hover:border-slate-300'
      }`}
    >
      {/* Desktop View */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <Checkbox
            checked={item.checked}
            onChange={(checked) => void onUpdate(item.id, { checked })}
            className="group/cb flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white transition data-checked:border-emerald-600 data-checked:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <Check className="hidden h-3.5 w-3.5 text-white group-data-checked/cb:block" />
          </Checkbox>

          <span
            className={`truncate text-sm font-medium ${
              item.checked ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {item.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <input
            type="text"
            value={unit}
            placeholder="Unit"
            onChange={(e) => setUnit(e.target.value)}
            onBlur={saveUnit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void saveUnit()
              if (e.key === 'Escape') cancelUnit()
            }}
            className="w-24 rounded-lg border border-slate-200 px-2.5 py-1 text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={() => void onDelete(item.id)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 focus:opacity-100"
            title="Delete item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Checkbox
              checked={item.checked}
              onChange={(checked) => void onUpdate(item.id, { checked })}
              className="group/cb flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white transition data-checked:border-emerald-600 data-checked:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <Check className="hidden h-3.5 w-3.5 text-white group-data-checked/cb:block" />
            </Checkbox>

            <span
              className={`truncate text-sm font-medium ${
                item.checked ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {item.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void onDelete(item.id)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <input
            type="text"
            value={unit}
            placeholder="Unit"
            onChange={(e) => setUnit(e.target.value)}
            onBlur={saveUnit}
            className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium"
          />
        </div>
      </div>
    </div>
  )
}
