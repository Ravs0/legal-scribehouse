import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "type-body-md flex min-h-32 w-full carved rounded-md border border-input bg-card/50 p-4 text-foreground transition-colors duration-short3 placeholder:text-muted-foreground hover:border-foreground focus-visible:border-2 focus-visible:border-primary focus-visible:p-[15px] focus-visible:shadow-none focus-visible:outline-none aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:p-[15px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
