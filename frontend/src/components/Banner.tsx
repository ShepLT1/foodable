import { Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useState } from 'react'

interface BannerProps {
  show: boolean
  message: string
}

export function Banner({ show, message }: BannerProps) {
  const [dismissed, setDismissed] = useState(false)

  return (
    <Transition
      show={show && !dismissed}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 -translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="mb-4 flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span>{message}</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ml-3 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Transition>
  )
}
