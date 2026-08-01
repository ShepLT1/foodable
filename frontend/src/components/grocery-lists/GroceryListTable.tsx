import { useState } from 'react'
import { Plus, ShoppingBag } from 'lucide-react'

import type {
  CreateListItemRequest,
  GroceryListItem,
  UpdateListItemRequest,
} from '../../api/lists'

import { GroceryListItemRow } from './GroceryListItemRow'
import { NewGroceryListItemRow } from './NewGroceryListItemRow'

interface GroceryListTableProps {
  items: GroceryListItem[]
  onAddItem: (data: CreateListItemRequest) => Promise<void>
  onUpdateItem: (itemId: string, data: UpdateListItemRequest) => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
}

export function GroceryListTable({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: GroceryListTableProps) {
  const [addingItem, setAddingItem] = useState(false)

  const completedCount = items.filter((i) => i.checked).length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header Controls & Progress */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShoppingBag size={18} className="text-emerald-600" />
            List Progress
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {completedCount} of {items.length} items purchased (
            {Math.round(progress)}%)
          </p>
          <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddingItem(true)}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Item List or Empty State */}
      <div className="space-y-3">
        {addingItem && (
          <NewGroceryListItemRow
            onCancel={() => setAddingItem(false)}
            onSave={async (data) => {
              await onAddItem(data)
              setAddingItem(false)
            }}
          />
        )}

        {items.length === 0 && !addingItem ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
            <p className="text-sm">No items in this grocery list yet.</p>
            <button
              type="button"
              onClick={() => setAddingItem(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
            >
              <Plus size={14} /> Add your first item
            </button>
          </div>
        ) : (
          items.map((item) => (
            <GroceryListItemRow
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </div>
    </div>
  )
}
