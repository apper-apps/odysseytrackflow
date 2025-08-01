import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import issueService from "@/services/api/issueService";
import ApperIcon from "@/components/ApperIcon";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import IssueTable from "@/components/organisms/IssueTable";
import CreateIssueModal from "@/components/organisms/CreateIssueModal";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Issues = () => {
const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeQuickFilter, setActiveQuickFilter] = useState("");

const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setAllIssues(data);
      setFilteredIssues(data);
    } catch (err) {
      setError("Failed to load issues. Please try again.");
      console.error("Error loading issues:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = issueService.filterIssues(allIssues, {
      search: searchQuery,
      statuses: statusFilters,
      priorities: priorityFilters,
      assignee: assigneeFilter,
      dateRange: dateRange,
      quickFilter: activeQuickFilter
    });
    setFilteredIssues(filtered);
  };

  const handleQuickFilter = (filterType) => {
    if (activeQuickFilter === filterType) {
      // Clear the filter if clicking the same one
      setActiveQuickFilter("");
      setStatusFilters([]);
      setPriorityFilters([]);
      setAssigneeFilter("");
    } else {
      setActiveQuickFilter(filterType);
      
      // Clear other filters and set specific ones based on quick filter
      setStatusFilters([]);
      setPriorityFilters([]);
      setAssigneeFilter("");
      
      switch (filterType) {
        case "myIssues":
          // In a real app, this would use current user
          setAssigneeFilter("");
          break;
        case "openIssues":
          setStatusFilters(["Open"]);
          break;
        case "highPriority":
          setPriorityFilters(["High"]);
          break;
        case "recentlyUpdated":
          // Sort by updatedAt will be handled in the filter function
          break;
      }
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setPriorityFilters([]);
    setAssigneeFilter("");
    setDateRange({ start: "", end: "" });
    setActiveQuickFilter("");
  };

  const getUniqueAssignees = () => {
    const assignees = [...new Set(allIssues.map(issue => issue.assignee))];
    return assignees.sort();
  };

useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilters, priorityFilters, assigneeFilter, dateRange, activeQuickFilter, allIssues]);

const handleCreateIssue = async (issueData) => {
    try {
      const newIssue = await issueService.create(issueData);
      if (newIssue) {
        setAllIssues(prev => [newIssue, ...prev]);
        toast.success("Issue created successfully!");
      }
    } catch (err) {
      toast.error("Failed to create issue");
      console.error("Error creating issue:", err);
      throw err;
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    
    const sortedIssues = [...filteredIssues].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (direction === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });
    
    setFilteredIssues(sortedIssues);
  };

  const handleRetry = () => {
    loadIssues();
  };

// Handle issue updates (for IssueDetailModal)
  const handleIssueUpdate = async (issueId, updateData) => {
    try {
      const updatedIssue = await issueService.update(issueId, updateData);
      if (updatedIssue) {
        setAllIssues(prev => prev.map(issue => 
          issue.Id === issueId ? updatedIssue : issue
        ));
        toast.success("Issue updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update issue");
      console.error("Error updating issue:", err);
    }
  };

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilters={statusFilters}
        onStatusFiltersChange={setStatusFilters}
        priorityFilters={priorityFilters}
        onPriorityFiltersChange={setPriorityFilters}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        activeQuickFilter={activeQuickFilter}
        onQuickFilter={handleQuickFilter}
        onClearFilters={clearAllFilters}
        availableAssignees={getUniqueAssignees()}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isFilterSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
              <p className="text-gray-600 mt-1">
                Track and manage bugs, features, and tasks
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="FileText" className="w-4 h-4" />
                <span>{filteredIssues.length} of {allIssues.length} {allIssues.length === 1 ? "issue" : "issues"}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <Loading />
          ) : error ? (
            <Error message={error} onRetry={loadIssues} />
          ) : filteredIssues.length === 0 ? (
            <Empty
              title={allIssues.length === 0 ? "No issues found" : "No matching issues"}
              description={allIssues.length === 0 
                ? "Get started by creating your first issue to track bugs, features, and tasks."
: "Try adjusting your filters to find what you're looking for."
              }
              actionLabel={allIssues.length === 0 ? "Create Issue" : "Clear Filters"}
              onAction={allIssues.length === 0 ? () => setIsCreateModalOpen(true) : clearAllFilters}
            />
          ) : (
            <IssueTable
              issues={filteredIssues}
              onIssueClick={handleIssueClick}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>
      </div>

      {/* Floating Action Button Container */}
      <div className="fixed bottom-6 right-6 z-fab">
        <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
      </div>
      
      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIssue}
      />

<IssueDetailModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdate={handleIssueUpdate}
      />
    </div>
  );
};

export default Issues;