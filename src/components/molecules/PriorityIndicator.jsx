import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PriorityIndicator = ({ priority, showLabel = false }) => {
  const priorityConfig = {
    Low: { color: "text-green-600", bg: "bg-green-100", icon: "ArrowDown" },
    Medium: { color: "text-yellow-600", bg: "bg-yellow-100", icon: "Minus" },
    High: { color: "text-red-600", bg: "bg-red-100", icon: "ArrowUp" },
  };

  const config = priorityConfig[priority] || priorityConfig.Medium;

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-2 h-2 rounded-full", config.bg)}>
        <div className={cn("w-full h-full rounded-full", config.color.replace("text-", "bg-"))}></div>
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", config.color)}>
          {priority}
        </span>
      )}
    </div>
  );
};

export default PriorityIndicator;