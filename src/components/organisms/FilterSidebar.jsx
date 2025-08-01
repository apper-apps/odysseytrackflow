import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High"];

const QUICK_FILTERS = [
  { id: "myIssues", label: "My Issues", icon: "User" },
  { id: "openIssues", label: "Open Issues", icon: "Circle" },
  { id: "highPriority", label: "High Priority", icon: "AlertTriangle" },
  { id: "recentlyUpdated", label: "Recently Updated", icon: "Clock" }
];

export default function FilterSidebar({
  isOpen,
  onToggle,
  searchQuery,
  onSearchChange,
  statusFilters,
  onStatusFiltersChange,
  priorityFilters,
  onPriorityFiltersChange,
  assigneeFilter,
  onAssigneeFilterChange,
  dateRange,
  onDateRangeChange,
  activeQuickFilter,
  onQuickFilter,
  onClearFilters,
  availableAssignees
}) {
  const handleStatusToggle = (status) => {
    if (statusFilters.includes(status)) {
      onStatusFiltersChange(statusFilters.filter(s => s !== status));
    } else {
      onStatusFiltersChange([...statusFilters, status]);
    }
  };

  const handlePriorityToggle = (priority) => {
    if (priorityFilters.includes(priority)) {
      onPriorityFiltersChange(priorityFilters.filter(p => p !== priority));
    } else {
      onPriorityFiltersChange([...priorityFilters, priority]);
    }
  };

  const hasActiveFilters = searchQuery || statusFilters.length > 0 || priorityFilters.length > 0 || 
    assigneeFilter || dateRange.start || dateRange.end || activeQuickFilter;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
              <button
                onClick={onToggle}
                className="p-1 text-gray-400 hover:text-gray-600 rounded lg:hidden"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Issues
              </label>
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search titles and descriptions..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Filters
              </label>
              <div className="space-y-2">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => onQuickFilter(filter.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                      activeQuickFilter === filter.id
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    )}
                  >
                    <ApperIcon name={filter.icon} className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status
              </label>
              <div className="space-y-2">
                {STATUSES.map((status) => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority
              </label>
              <div className="space-y-2">
                {PRIORITIES.map((priority) => (
                  <label key={priority} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priorityFilters.includes(priority)}
                      onChange={() => handlePriorityToggle(priority)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assignee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <Select
                value={assigneeFilter}
                onChange={(e) => onAssigneeFilterChange(e.target.value)}
                className="w-full"
              >
                <option value="">All Assignees</option>
                {availableAssignees.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                    max={dateRange.end || undefined}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                    min={dateRange.start || undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}