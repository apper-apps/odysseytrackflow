import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No issues found", 
  description = "Get started by creating your first issue to track bugs, features, and tasks.",
  actionLabel = "Create Issue",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <ApperIcon name="FileX" className="w-10 h-10 text-primary-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;