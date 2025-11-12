import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

// Wrapper export to match shadcn-ui style imports
export const Dialog = DialogPrimitive.Root

export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, className = "", ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        ref={ref}
        {...props}
        className={
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-card p-6 shadow-lg border border-border " +
          className
        }
      >
        <div className="relative">
          <div className="absolute right-2 top-2">
            <DialogPrimitive.Close asChild>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div>{children}</div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
DialogContent.displayName = "DialogContent"

export const DialogClose = DialogPrimitive.Close

export default Dialog
