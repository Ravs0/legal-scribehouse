import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "type-body-md recessed flex min-h-28 w-full rounded-lg border border-border bg-card px-3.5 py-3 text-foreground transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-input focus-visible:border-ring focus-visible:outline-none aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
