// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const issueService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "projectId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching issues:", error?.response?.data?.message);
      } else {
        console.error("Error fetching issues:", error.message);
      }
      throw error;
    }
  },

  filterIssues(issues, filters) {
    let filtered = [...issues];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(issue => 
        (issue.title && issue.title.toLowerCase().includes(searchLower)) ||
        (issue.description && issue.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filters
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(issue => filters.statuses.includes(issue.status));
    }

    // Apply priority filters
    if (filters.priorities && filters.priorities.length > 0) {
      filtered = filtered.filter(issue => filters.priorities.includes(issue.priority));
    }

    // Apply assignee filter
    if (filters.assignee) {
      filtered = filtered.filter(issue => issue.assignee === filters.assignee);
    }

    // Apply date range filter
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      filtered = filtered.filter(issue => {
        const issueDate = new Date(issue.createdAt);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date(0);
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date();
        
        return issueDate >= startDate && issueDate <= endDate;
      });
    }

    // Apply quick filters
    if (filters.quickFilter) {
      switch (filters.quickFilter) {
        case "myIssues":
          // In a real app, this would filter by current user
          break;
        case "openIssues":
          filtered = filtered.filter(issue => issue.status === "Open");
          break;
        case "highPriority":
          filtered = filtered.filter(issue => issue.priority === "High");
          break;
        case "recentlyUpdated":
          filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
      }
    }

    return filtered;
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "projectId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await apperClient.getRecordById('issue', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching issue:", error.message);
      }
      throw error;
    }
  },

  async create(issueData) {
    try {
      const params = {
        records: [{
          Name: issueData.title || '',
          title: issueData.title || '',
          description: issueData.description || '',
          status: issueData.status || 'Open',
          priority: issueData.priority || 'Medium',
          assignee: issueData.assignee || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: issueData.projectId ? parseInt(issueData.projectId) : null,
          Tags: issueData.tags || ''
        }]
      };

      const response = await apperClient.createRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} issue records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating issue:", error?.response?.data?.message);
      } else {
        console.error("Error creating issue:", error.message);
      }
      throw error;
    }
  },

  async update(id, issueData) {
    try {
      const updateFields = {};
      
      // Only include updateable fields
      if (issueData.title !== undefined) updateFields.title = issueData.title;
      if (issueData.description !== undefined) updateFields.description = issueData.description;
      if (issueData.status !== undefined) updateFields.status = issueData.status;
      if (issueData.priority !== undefined) updateFields.priority = issueData.priority;
      if (issueData.assignee !== undefined) updateFields.assignee = issueData.assignee;
      if (issueData.projectId !== undefined) updateFields.projectId = issueData.projectId ? parseInt(issueData.projectId) : null;
      if (issueData.tags !== undefined) updateFields.Tags = issueData.tags;
      
      // Always update the updatedAt field
      updateFields.updatedAt = new Date().toISOString();
      
      // Update Name to match title for consistency
      if (issueData.title !== undefined) updateFields.Name = issueData.title;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} issue records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating issue:", error?.response?.data?.message);
      } else {
        console.error("Error updating issue:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} issue records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting issue:", error?.response?.data?.message);
      } else {
        console.error("Error deleting issue:", error.message);
      }
      throw error;
    }
  }
};

export default issueService;