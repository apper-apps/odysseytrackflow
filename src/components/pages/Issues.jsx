import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IssueTable from "@/components/organisms/IssueTable";
import CreateIssueModal from "@/components/organisms/CreateIssueModal";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import issueService from "@/services/api/issueService";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError("Failed to load issues. Please try again.");
      console.error("Error loading issues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleCreateIssue = async (issueData) => {
    try {
      const newIssue = await issueService.create(issueData);
      setIssues(prev => [newIssue, ...prev]);
      toast.success("Issue created successfully!");
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
    
    const sortedIssues = [...issues].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle different data types
      if (field === "createdAt" || field === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (field === "Id") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setIssues(sortedIssues);
  };

  const handleRetry = () => {
    loadIssues();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600 mt-1">
            Track and manage bugs, features, and tasks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="FileText" className="w-4 h-4" />
            <span>{issues.length} {issues.length === 1 ? "issue" : "issues"}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {issues.length === 0 ? (
        <Empty
          title="No issues found"
          description="Get started by creating your first issue to track bugs, features, and tasks."
          actionLabel="Create Issue"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <IssueTable
          issues={issues}
          onIssueClick={handleIssueClick}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />

      {/* Modals */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIssue}
      />

      <IssueDetailModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default Issues;