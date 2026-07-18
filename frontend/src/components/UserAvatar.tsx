// Presentational letter-avatar. Renders the first character of the given name.
export function UserAvatar({ name }: { name?: string }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
      {initial}
    </div>
  )
}
