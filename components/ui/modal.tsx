"use client"

import React from "react"

interface ModalProps {
  open: boolean
  title?: string
  children?: React.ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md mx-4 bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="text-sm text-muted-foreground" onClick={onClose}>Cerrar</button>
          </div>
        </div>

        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
