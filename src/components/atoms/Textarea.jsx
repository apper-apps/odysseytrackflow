import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 border rounded-lg transition-all duration-200 resize-none",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "placeholder:text-gray-400",
        error 
          ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500" 
          : "border-gray-300 bg-white text-gray-900",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;