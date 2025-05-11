
    import * as React from "react"
    import { cn } from "@/lib/utils"

    const Input = React.forwardRef(({ className, type, ...props }, ref) => {
      return (
        (<input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-neumorphic border-none bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
            // Neumorphic inset shadow
            "shadow-neumorphic-concave focus-visible:shadow-neumorphic-concave-focus", 
            className
          )}
          ref={ref}
          {...props} />)
      );
    })
    Input.displayName = "Input"

    export { Input }
  