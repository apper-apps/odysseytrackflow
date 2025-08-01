import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import UserAvatar from "@/components/molecules/UserAvatar";

const IssueDetailModal = ({ issue, isOpen, onClose }) => {
  if (!issue) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono text-gray-600">#{issue.Id}</span>
                <StatusBadge status={issue.status} />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Title */}
                <div className="flex items-start gap-3">
                  <PriorityIndicator priority={issue.priority} />
                  <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                    {issue.title}
                  </h1>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Priority</span>
                    <PriorityIndicator priority={issue.priority} showLabel />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Assignee</span>
                    <div className="flex items-center gap-2">
                      <UserAvatar user={{ name: issue.assignee }} size="sm" />
                      <span className="text-sm font-medium text-gray-900">{issue.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Created</span>
                    <span className="text-sm text-gray-900">
                      {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-900">
                          Issue created by <span className="font-medium">System</span>
                        </p>
                        <p className="text-xs text-blue-700">
                          {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            Issue updated
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(issue.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Last updated {format(new Date(issue.updatedAt || issue.createdAt), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm">
                  <ApperIcon name="Edit" className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="primary" size="sm">
                  <ApperIcon name="MessageSquare" className="w-4 h-4" />
                  Comment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailModal;