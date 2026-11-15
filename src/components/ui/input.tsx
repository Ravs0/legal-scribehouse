import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "type-body-md flex h-14 w-full carved rounded-md border border-input bg-card/50 px-4 text-foreground transition-colors duration-short3 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-foreground focus-visible:border-2 focus-visible:border-primary focus-visible:px-[15px] focus-visible:shadow-none focus-visible:outline-none aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:px-[15px] disabled:cursor-not-allowed disabled:opacity-50",
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
