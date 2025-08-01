import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import issueService from "@/services/api/issueService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import UserAvatar from "@/components/molecules/UserAvatar";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" }
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" }
];

const ASSIGNEE_OPTIONS = [
  { value: "john.doe", label: "John Doe" },
  { value: "jane.smith", label: "Jane Smith" },
  { value: "mike.johnson", label: "Mike Johnson" },
  { value: "sarah.wilson", label: "Sarah Wilson" },
  { value: "", label: "Unassigned" }
];

function IssueDetailModal({ issue, isOpen, onClose }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when issue changes
  useEffect(() => {
    if (issue) {
      setFormData({
        Id: issue.Id,
        title: issue.title || "",
        description: issue.description || "",
        status: issue.status || "Open",
        priority: issue.priority || "Medium",
        assignee: issue.assignee || "",
        reporter: issue.reporter || "Unknown",
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt
      });
      setHasChanges(false);
      setErrors({});
    }
  }, [issue]);

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      if (hasChanges && validateForm()) {
        handleSave(false); // Silent save
      }
    }, 2000);

    setAutoSaveTimeout(timeout);
  }, [hasChanges, autoSaveTimeout]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    
    if (field !== "description") {
      triggerAutoSave();
    }
  };

  // Handle description changes with auto-save
  const handleDescriptionChange = (value) => {
    handleFieldChange("description", value);
    triggerAutoSave();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async (showToast = true) => {
    if (!validateForm()) {
      if (showToast) {
        toast.error("Please fix validation errors");
      }
      return;
    }

    setIsSaving(true);
    try {
      const updatedIssue = await issueService.update(formData.Id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      setHasChanges(false);
      if (showToast) {
        toast.success("Issue updated successfully");
      }
    } catch (error) {
      console.error("Error saving issue:", error);
      if (showToast) {
        toast.error("Failed to save issue");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await issueService.delete(formData.Id);
      toast.success("Issue deleted successfully");
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Failed to delete issue");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [isOpen, onClose, autoSaveTimeout]);

  if (!issue) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{formData.Id}
                    </span>
                    {isSaving && (
                      <span className="text-xs text-blue-600 flex items-center">
                        <ApperIcon name="Loader2" size={12} className="animate-spin mr-1" />
                        Saving...
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      value={formData.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className={`text-lg font-semibold border-none p-0 focus:ring-0 ${
                        errors.title ? "text-red-600" : ""
                      }`}
                      placeholder="Issue title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Select
                    value={formData.status}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="min-w-[140px]"
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)]">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        rows={8}
                        className={`w-full resize-none ${
                          errors.description ? "border-red-300 focus:ring-red-500" : ""
                        }`}
                        placeholder="Describe the issue in detail..."
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Priority and Assignee */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <Select
                          value={formData.priority}
                          onChange={(e) => handleFieldChange("priority", e.target.value)}
                          className="w-full"
                        >
                          {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assignee
                        </label>
                        <Select
                          value={formData.assignee}
                          onChange={(e) => handleFieldChange("assignee", e.target.value)}
                          className="w-full"
                        >
                          {ASSIGNEE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - Metadata */}
                <div className="w-full lg:w-80 bg-gray-50 p-6 border-l border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <StatusBadge status={formData.status} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Priority</span>
                          <PriorityIndicator priority={formData.priority} showLabel />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Assignee</span>
                          <div className="flex items-center space-x-2">
                            <UserAvatar 
                              user={formData.assignee || "Unassigned"} 
                              size="sm" 
                            />
                            <span className="text-sm text-gray-900">
                              {ASSIGNEE_OPTIONS.find(a => a.value === formData.assignee)?.label || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Created</div>
                          <div className="text-sm text-gray-900">
                            {formData.createdAt ? format(new Date(formData.createdAt), "MMM d, yyyy 'at' h:mm a") : "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            by {formData.reporter}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                          <div className="text-sm text-gray-900">
                            {formData.updatedAt ? format(new Date(formData.updatedAt), "MMM d, yyyy 'at' h:mm a") : "Never"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  Delete Issue
                </Button>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => handleSave(true)}
                    disabled={isSaving || !hasChanges}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    {isSaving ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-60"
                  onClick={() => setShowDeleteConfirm(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-60 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Delete Issue
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to delete "{formData.title}"? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <ApperIcon name="Trash2" size={16} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

export default IssueDetailModal;