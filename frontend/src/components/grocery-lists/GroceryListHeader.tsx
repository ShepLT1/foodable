import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EditableTitle } from '../EditableTitle'

interface GroceryListHeaderProps {
  title: string
  onRename: (title: string) => Promise<void>
}

export function GroceryListHeader({ title, onRename }: GroceryListHeaderProps) {
  return (
    <header className="space-y-4">
      <Link
        to="/lists"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Grocery Lists
      </Link>

      <EditableTitle title={title} onSave={onRename} />
    </header>
  )
}
