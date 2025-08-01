import React from "react";
import { cn } from "@/utils/cn";

const UserAvatar = ({ user, size = "md", className }) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  if (!user) {
    return (
      <div className={cn(
        "rounded-full bg-gray-200 flex items-center justify-center text-gray-500",
        sizes[size],
        className
      )}>
        ?
      </div>
    );
  }
const initials = (user.name || "")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium",
        sizes[size],
        className
      )}
      title={user.name}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;