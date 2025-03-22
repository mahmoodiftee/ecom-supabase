"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function toast({ title, description, duration = 3000 }) {
  // Create a custom event to trigger the toast
  const event = new CustomEvent("toast", {
    detail: { title, description, duration },
  })

  // Dispatch the event
  document.dispatchEvent(event)
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (event) => {
      const { title, description, duration } = event.detail
      const id = Date.now()

      setToasts((prev) => [...prev, { id, title, description }])

      // Remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    }

    document.addEventListener("toast", handleToast)

    return () => {
      document.removeEventListener("toast", handleToast)
    }
  }, [])

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-background border rounded-lg shadow-lg p-4 flex gap-3"
          >
            <div className="flex-1">
              {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
              {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

