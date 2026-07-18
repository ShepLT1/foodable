import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import type { GroceryListItem, UpdateListItemRequest } from '../../api/lists'

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
  const [quantity, setQuantity] = useState(Number(item.quantity).toString())
  const [unit, setUnit] = useState(item.unit ?? '')

  async function saveQuantity() {
    const trimmed = quantity.trim()

    if (trimmed === '') {
      setQuantity(Number(item.quantity).toString())
      return
    }

    const value = Number(trimmed)

    if (!Number.isFinite(value)) {
      setQuantity(Number(item.quantity).toString())
      return
    }

    if (value === item.quantity) {
      return
    }

    await onUpdate(item.id, {
      quantity: value,
    })
  }

  async function saveUnit() {
    const trimmed = unit.trim()

    if (trimmed === item.unit) {
      return
    }

    await onUpdate(item.id, {
      unit: trimmed,
    })
  }

  function cancelQuantity() {
    setQuantity(Number(item.quantity).toString())
  }

  function cancelUnit() {
    setUnit(item.unit ?? '')
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden grid-cols-[10rem_7rem_7rem_7rem_7rem] items-center gap-4 border-b border-slate-200 py-3 md:grid">
        <div className="truncate">{item.name}</div>
        <div className="flex justify-center">
          <input
            type="number"
            step="0.125"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={saveQuantity}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void saveQuantity()
              }

              if (e.key === 'Escape') {
                cancelQuantity()
              }
            }}
            className="w-20 rounded border border-slate-300 px-2 py-1"
          />
        </div>
        <div className="flex justify-center">
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onBlur={saveUnit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void saveUnit()
              }

              if (e.key === 'Escape') {
                cancelUnit()
              }
            }}
            className="w-30 rounded border border-slate-300 px-2 py-1"
          />
        </div>
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) =>
              void onUpdate(item.id, {
                checked: e.target.checked,
              })
            }
            className="h-5 w-5 cursor-pointer"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void onDelete(item.id)}
            className="cursor-pointer rounded p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="rounded-lg border border-slate-200 p-4 md:hidden">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-1">
            <h2 className="font-medium truncate">{item.name}</h2>
          </div>

          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) =>
              void onUpdate(item.id, {
                checked: e.target.checked,
              })
            }
            className="mt-1 h-5 w-5 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.125"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onBlur={saveQuantity}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void saveQuantity()
                }

                if (e.key === 'Escape') {
                  cancelQuantity()
                }
              }}
              className="w-20 rounded border border-slate-300 px-2 py-1"
            />

            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onBlur={saveUnit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void saveUnit()
                }

                if (e.key === 'Escape') {
                  cancelUnit()
                }
              }}
              className="w-20 flex-1 rounded border border-slate-300 px-2 py-1"
            />
          </div>

          <button
            type="button"
            onClick={() => void onDelete(item.id)}
            className="cursor-pointer flex justify-center rounded h-5 w-5 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
