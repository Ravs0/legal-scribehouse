import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "type-body-md recessed flex h-11 w-full rounded-lg border border-border bg-card px-3.5 text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-input focus-visible:border-ring focus-visible:outline-none aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
