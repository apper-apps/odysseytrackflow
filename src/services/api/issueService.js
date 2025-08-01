import mockIssues from "@/services/mockData/issues.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const issueService = {
  async getAll() {
    await delay(300);
    return [...mockIssues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  filterIssues(issues, filters) {
    let filtered = [...issues];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower)
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
          // For now, we'll just return the filtered results
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
    await delay(200);
    const issue = mockIssues.find(issue => issue.Id === parseInt(id));
    if (!issue) {
      throw new Error("Issue not found");
    }
    return { ...issue };
  },

  async create(issueData) {
    await delay(400);
    
    const maxId = Math.max(...mockIssues.map(issue => issue.Id), 0);
    const newIssue = {
      Id: maxId + 1,
      title: issueData.title,
      description: issueData.description,
      status: "Open",
      priority: issueData.priority,
      assignee: issueData.assignee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockIssues.unshift(newIssue);
    return { ...newIssue };
  },

  async update(id, issueData) {
    await delay(350);
    
    const index = mockIssues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    
    mockIssues[index] = {
      ...mockIssues[index],
      ...issueData,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...mockIssues[index] };
  },

  async delete(id) {
    await delay(250);
    
    const index = mockIssues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    
const deletedIssue = mockIssues.splice(index, 1)[0];
    return { ...deletedIssue };
  },

  // Get issues by project ID
  getIssuesByProjectId(projectId) {
    if (typeof projectId !== 'number') {
      return [];
    }
    return mockIssues.filter(issue => issue.projectId === projectId);
  }
};

export default issueService;