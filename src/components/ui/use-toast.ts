"use client"

import { useState, useEffect } from 'react'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export type Toast = {
  id: string
  title?: string
  description?: string
  duration?: number
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type State = {
  toasts: Toast[]
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  const toast = (props: Omit<Toast, "id">) => {
    const id = generateId()
    
    setState((state) => ({
      ...state,
      toasts: [
        ...state.toasts,
        { ...props, id },
      ].slice(0, TOAST_LIMIT),
    }))

    return {
      id,
      dismiss: () => setState((state) => ({
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
    }
  }

  useEffect(() => {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

    state.toasts.forEach((toast) => {
      if (!timeouts.has(toast.id) && toast.duration !== Infinity) {
        timeouts.set(
          toast.id,
          setTimeout(() => {
            setState((state) => ({
              ...state,
              toasts: state.toasts.filter((t) => t.id !== toast.id),
            }))
            timeouts.delete(toast.id)
          }, toast.duration || 5000)
        )
      }
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.toasts])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }))
    },
  }
}
