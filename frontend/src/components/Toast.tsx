import { CheckCircle } from 'lucide-react'

type ToastProps = {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
