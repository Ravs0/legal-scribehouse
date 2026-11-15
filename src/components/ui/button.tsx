import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { spawnRipple } from "@/hooks/useRipple";

/**
 * Material 3 button. Sizes: sm 36 / md 44 / lg 52 (all pill-shaped).
 * Variants: filled (default), tonal (secondary), outlined (outline), text (ghost), glass, destructive, link.
 */
const buttonVariants = cva(
  [
    "state-layer relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full",
    "transition-[box-shadow,background-color,border-color,color,transform] duration-short3 ease-standard",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-foreground/[0.12] disabled:text-foreground/[0.38] disabled:shadow-none disabled:border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "btn-3d btn-filled bg-primary text-primary-foreground",
        secondary: "btn-3d btn-tonal bg-primary-container text-primary-on-container",
        outline: "btn-3d btn-outline3d border border-input bg-background/40 text-primary focus-visible:border-primary",
        ghost: "press bg-transparent text-primary",
        glass: "glass-subtle btn-3d btn-glass text-foreground",
        destructive: "btn-3d bg-destructive text-destructive-foreground",
        link: "h-auto rounded-sm px-0 text-primary underline-offset-4 hover:underline before:hidden",
      },
      size: {
        sm: "h-9 gap-1.5 px-4 type-label-md [&_svg]:size-4",
        default: "h-11 gap-2 px-6 type-label-lg [&_svg]:size-[18px]",
        lg: "h-[52px] gap-2.5 px-8 type-title-sm [&_svg]:size-5",
        icon: "h-10 w-10 text-foreground [&_svg]:size-5",
        "icon-sm": "h-9 w-9 text-foreground [&_svg]:size-[18px]",
        "icon-lg": "h-12 w-12 text-foreground [&_svg]:size-6",
      },
      /** Which side carries an icon; that side gets the tighter Material padding. */
      icon: { none: "", leading: "", trailing: "" },
    },
    compoundVariants: [
      { size: "sm", icon: "leading", className: "pl-3" },
      { size: "sm", icon: "trailing", className: "pr-3" },
      { size: "default", icon: "leading", className: "pl-4" },
      { size: "default", icon: "trailing", className: "pr-4" },
      { size: "lg", icon: "leading", className: "pl-6" },
      { size: "lg", icon: "trailing", className: "pr-6" },
      { variant: "ghost", size: ["sm", "default", "lg"], className: "px-3" },
      { variant: "ghost", size: ["icon", "icon-sm", "icon-lg"], className: "text-foreground" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      icon: "none",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, asChild = false, onPointerDown, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, icon, className }))}
        ref={ref}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(e);
          if (e.button === 0 && variant !== "link") spawnRipple(e.currentTarget, e.clientX, e.clientY);
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
