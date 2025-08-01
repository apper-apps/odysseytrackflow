import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import UserAvatar from "@/components/molecules/UserAvatar";

const IssueTable = ({ issues, onIssueClick, onSort, sortField, sortDirection }) => {
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary-600" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("id")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  ID
                  <SortIcon field="id" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  Title
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("priority")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("assignee")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  Assignee
                  <SortIcon field="assignee" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-primary-600 transition-colors"
                >
                  Created
                  <SortIcon field="createdAt" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr
                key={issue.Id}
                onClick={() => onIssueClick(issue)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900 group-hover:text-primary-600 transition-colors">
                    #{issue.Id}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <PriorityIndicator priority={issue.priority} />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {issue.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PriorityIndicator priority={issue.priority} showLabel />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserAvatar user={{ name: issue.assignee }} size="sm" />
                    <span className="text-sm text-gray-900">{issue.assignee}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {format(new Date(issue.createdAt), "MMM d, yyyy")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;