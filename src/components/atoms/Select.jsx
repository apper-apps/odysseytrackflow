import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 border rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "bg-white text-gray-900",
        error 
          ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500" 
          : "border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;