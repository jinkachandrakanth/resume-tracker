"use client"

import * as React from "react"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toast } = useToast()

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 
        ${toast
          ? (toast.variant === 'destructive'
            ? 'bg-red-500 text-white opacity-100'
            : 'bg-green-500 text-white opacity-100')
          : 'opacity-0 pointer-events-none'}`}
    >
      {toast?.title && <div className="font-bold">{toast.title}</div>}
      {toast?.description && <div className="text-sm">{toast.description}</div>}
    </div>
  )
}
