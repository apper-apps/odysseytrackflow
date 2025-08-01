import mockIssues from "@/services/mockData/issues.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const issueService = {
  async getAll() {
    await delay(300);
    return [...mockIssues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
};

export default issueService;