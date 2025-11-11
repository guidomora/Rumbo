"use client"

import React, { createContext, useContext, useMemo, useState } from "react"

type ToastType = "success" | "error" | "info"

interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, type: ToastType = "info", durationMs = 2000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const t: ToastItem = { id, type, message }
    setToasts((s) => [t, ...s])
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id))
    }, durationMs)
  }

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed z-50 right-4 top-6 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded-lg shadow-lg text-white border border-transparent animate-fade-in ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// small fade-in animation via tailwind utilities (requires tailwind configured)
