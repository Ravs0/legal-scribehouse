import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Tonal M3 badge: 24px, pill, role colour on a 16%-alpha container. */
const badgeVariants = cva(
  "type-label-sm inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/[0.16] text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        tertiary: "bg-tertiary/[0.16] text-tertiary",
        success: "bg-success/[0.16] text-success",
        warning: "bg-warning/[0.16] text-warning",
        destructive: "bg-destructive/[0.16] text-destructive",
        outline: "border border-outline-variant text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
