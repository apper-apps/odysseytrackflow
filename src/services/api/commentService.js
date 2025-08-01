// Mock comment data
const mockComments = [
  {
    Id: 1,
    issueId: 1,
    author: "John Doe",
    authorEmail: "john.doe@example.com",
    content: "I've started investigating this issue. It seems to be related to the authentication flow.",
    createdAt: "2024-01-15T09:30:00Z"
  },
  {
    Id: 2,
    issueId: 1,
    author: "Jane Smith",
    authorEmail: "jane.smith@example.com",
    content: "Thanks John. I've noticed similar issues in the production logs. Let me know if you need access to the error tracking dashboard.",
    createdAt: "2024-01-15T11:45:00Z"
  },
  {
    Id: 3,
    issueId: 2,
    author: "Mike Johnson",
    authorEmail: "mike.johnson@example.com",
    content: "The mobile layout looks good on iOS, but there are some spacing issues on Android devices. I'll create a fix for this.",
    createdAt: "2024-01-14T16:20:00Z"
  },
  {
    Id: 4,
    issueId: 1,
    author: "Sarah Wilson",
    authorEmail: "sarah.wilson@example.com",
    content: "I've deployed a potential fix to staging. Can someone test the authentication flow and confirm if the issue is resolved?",
    createdAt: "2024-01-16T08:15:00Z"
  }
];

let nextId = 5;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const commentService = {
  // Get all comments for a specific issue
  async getByIssueId(issueId) {
    await delay(300);
    const comments = mockComments
      .filter(comment => comment.issueId === parseInt(issueId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return [...comments];
  },

  // Create a new comment
  async create(commentData) {
    await delay(500);
    
    if (!commentData.issueId || !commentData.content?.trim()) {
      throw new Error('Issue ID and content are required');
    }

    const newComment = {
      Id: nextId++,
      issueId: parseInt(commentData.issueId),
      author: commentData.author || "Current User",
      authorEmail: commentData.authorEmail || "user@example.com",
      content: commentData.content.trim(),
      createdAt: new Date().toISOString()
    };

    mockComments.push(newComment);
    return { ...newComment };
  },

  // Update a comment
  async update(id, updateData) {
    await delay(400);
    
    const commentIndex = mockComments.findIndex(comment => comment.Id === parseInt(id));
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    if (!updateData.content?.trim()) {
      throw new Error('Content is required');
    }

    mockComments[commentIndex] = {
      ...mockComments[commentIndex],
      content: updateData.content.trim(),
      updatedAt: new Date().toISOString()
    };

    return { ...mockComments[commentIndex] };
  },

  // Delete a comment
  async delete(id) {
    await delay(300);
    
    const commentIndex = mockComments.findIndex(comment => comment.Id === parseInt(id));
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    mockComments.splice(commentIndex, 1);
    return { success: true };
  }
};

export default commentService;