import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-slate-900/90 text-slate-200 ring-white/10",
        secondary:
          "border border-transparent bg-cyan-500/15 text-cyan-300 ring-cyan-500/20",
        destructive:
          "border border-transparent bg-red-500/15 text-red-300 ring-red-500/20",
        outline: "border border-white/10 text-slate-300",
        status_complete:
          "border border-transparent bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
        status_inprogress:
          "border border-transparent bg-cyan-500/15 text-cyan-300 ring-cyan-500/20",
        status_notstarted:
          "border border-transparent bg-slate-700/50 text-slate-300 ring-slate-600/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
