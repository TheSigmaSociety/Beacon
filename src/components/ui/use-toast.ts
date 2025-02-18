"use client"

import { useState, useEffect } from 'react'

interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const timeouts = toasts.map((toast) => {
      if (toast.duration) {
        return setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
      }
    });

    return () => {
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
    };
  }, [toasts]);

  return { toasts, addToast, removeToast };
}
