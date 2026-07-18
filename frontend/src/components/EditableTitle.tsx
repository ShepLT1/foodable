import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";

interface EditableTitleProps {
  title: string;
  onSave: (title: string) => Promise<void>;
}

export function EditableTitle({ title, onSave }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing() {
    setDraftTitle(title);
    setIsEditing(true);
  }

  async function save() {
    const trimmedTitle = draftTitle.trim();

    setIsEditing(false);

    if (trimmedTitle.length === 0) {
      setDraftTitle(title);
      return;
    }

    if (trimmedTitle === title) {
      return;
    }

    await onSave(trimmedTitle);
  }

  function cancel() {
    setDraftTitle(title);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            save();
          }

          if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-3xl font-bold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-3xl font-bold">{title}</h1>

      <button
        type="button"
        onClick={startEditing}
        aria-label="Edit grocery list title"
        className="cursor-pointer rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Pencil size={18} />
      </button>
    </div>
  );
}
