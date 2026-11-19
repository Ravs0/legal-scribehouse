import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Dawn Tactile button. Sizes: sm 32 / md 40 / lg 48, pill-shaped.
 * default = dawn-orange filled (dark ink text), secondary = dark device pill, outline = raised card pill,
 * ghost = text button in primary-ink, glass = translucent on scenes.
 */
const buttonVariants = cva(
  [
    "btn-lift hit relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "btn-filled bg-primary text-primary-foreground",
        secondary: "btn-device bg-device text-device-foreground",
        outline: "btn-raised bg-card text-foreground",
        ghost: "bg-transparent text-primary-ink hover:bg-primary/10",
        glass: "glass-chip text-white",
        destructive: "bg-destructive text-destructive-foreground",
        link: "h-auto rounded-sm px-0 text-primary-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 type-label-md [&_svg]:size-3.5",
        default: "h-10 gap-2 px-[18px] type-label-lg [&_svg]:size-4",
        lg: "h-12 gap-2 px-6 type-title-md [&_svg]:size-[18px]",
        icon: "h-10 w-10 text-foreground [&_svg]:size-[18px]",
        "icon-sm": "h-8 w-8 text-foreground [&_svg]:size-4",
        "icon-lg": "h-12 w-12 text-foreground [&_svg]:size-5",
      },
      /** Kept for API compatibility; icons sit inside the standard padding. */
      icon: { none: "", leading: "", trailing: "" },
    },
    compoundVariants: [
      { variant: "ghost", size: ["sm", "default", "lg"], className: "px-3" },
      { variant: "ghost", size: ["icon", "icon-sm", "icon-lg"], className: "text-foreground hover:bg-foreground/[0.06]" },
    ],
    defaultVariants: { variant: "default", size: "default", icon: "none" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, icon, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
