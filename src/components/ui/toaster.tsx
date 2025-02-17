"use client"

import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(({ id, title, description }) => (
        <div
          key={id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs"
        >
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </div>
      ))}
    </div>
  )
}
