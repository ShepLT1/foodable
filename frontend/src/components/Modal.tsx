import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  // omit onClose for a non-dismissible modal (Escape / backdrop do nothing)
  onClose?: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose ?? (() => {})}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex w-full max-w-lg flex-col gap-4 rounded-xl bg-white p-8 shadow-xl">
          {title && (
            <DialogTitle className="text-2xl font-semibold">
              {title}
            </DialogTitle>
          )}
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
