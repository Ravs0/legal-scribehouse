import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Tonal M3 badge: 24px, pill, role colour on a 16%-alpha container. */
const badgeVariants = cva(
  "type-label-sm inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-2 transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary/[0.14] text-primary-ink",
        secondary: "bg-secondary text-secondary-foreground",
        tertiary: "bg-tertiary/[0.16] text-tertiary",
        success: "bg-success/[0.16] text-success",
        warning: "bg-warning/[0.16] text-[color-mix(in_srgb,hsl(var(--warning))_68%,hsl(var(--foreground)))]",
        destructive: "bg-destructive/[0.16] text-[color-mix(in_srgb,hsl(var(--destructive))_80%,hsl(var(--foreground)))]",
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
