import { EditableTitle } from '../EditableTitle'

interface GroceryListHeaderProps {
  title: string
  onRename: (title: string) => Promise<void>
}

export function GroceryListHeader({ title, onRename }: GroceryListHeaderProps) {
  return (
    <header className="mb-8">
      <EditableTitle title={title} onSave={onRename} />
    </header>
  )
}
