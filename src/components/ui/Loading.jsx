import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
        
        {/* Table header skeleton */}
        <div className="card p-0 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          
          {/* Table rows skeleton */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 last:border-b-0">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;