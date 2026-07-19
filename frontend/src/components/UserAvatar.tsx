type UserAvatarProps = {
  name?: string
  size?: 'sm' | 'lg'
}

const SIZES = {
  sm: 'h-9 w-9 text-sm',
  lg: 'h-16 w-16 text-2xl',
}

// Presentational letter-avatar. Renders the first character of the given name.
export function UserAvatar({ name, size = 'sm' }: UserAvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white ${SIZES[size]}`}
    >
      {initial}
    </div>
  )
}
