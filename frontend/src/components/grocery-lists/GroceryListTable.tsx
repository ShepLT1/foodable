import { useState } from 'react'

import type {
  CreateListItemRequest,
  GroceryListItem,
  UpdateListItemRequest,
} from '../../api/lists'

import { Plus } from 'lucide-react'

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

  return (
    <div className="mx-auto w-fit">
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={() => setAddingItem(true)}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>
      {/* Desktop table header */}
      <div className="hidden grid-cols-[10rem_7rem_7rem_7rem_7rem] items-center gap-4 border-b border-slate-300 pb-2 text-sm font-semibold text-slate-600 md:grid">
        <div>Item Name</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Unit</div>
        <div className="text-center">Purchased</div>
        <div className="text-center">Action</div>
      </div>

      {items.map((item) => (
        <GroceryListItemRow
          key={item.id}
          item={item}
          onUpdate={onUpdateItem}
          onDelete={onDeleteItem}
        />
      ))}

      {addingItem && (
        <NewGroceryListItemRow
          onCancel={() => setAddingItem(false)}
          onSave={async (data) => {
            await onAddItem(data)
            setAddingItem(false)
          }}
        />
      )}
    </div>
  )
}
