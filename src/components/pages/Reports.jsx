import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <ApperIcon name="BarChart3" className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports</h1>
        
        <div className="card p-8">
          <ApperIcon name="TrendingUp" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h2>
          <p className="text-gray-600 leading-relaxed">
            Advanced analytics and reporting features are in development. 
            Soon you'll be able to generate insights on issue resolution times, 
            team performance metrics, project progress, and custom reports to 
            help optimize your workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;