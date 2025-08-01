import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98] shadow-md",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98] shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 hover:scale-[1.02] active:scale-[0.98] shadow-md",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;