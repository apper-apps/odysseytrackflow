// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const commentService = {
  async getByIssueId(issueId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "issueId" } },
          { field: { Name: "author" } },
          { field: { Name: "authorEmail" } },
          { field: { Name: "content" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        where: [
          {
            FieldName: "issueId",
            Operator: "EqualTo",
            Values: [parseInt(issueId)]
          }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching comments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching comments:", error.message);
      }
      throw error;
    }
  },

  async create(commentData) {
    try {
      if (!commentData.issueId || !commentData.content?.trim()) {
        throw new Error('Issue ID and content are required');
      }

      const params = {
        records: [{
          Name: `Comment by ${commentData.author || 'User'}`,
          issueId: parseInt(commentData.issueId),
          author: commentData.author || "Current User",
          authorEmail: commentData.authorEmail || "user@example.com",
          content: commentData.content.trim(),
          createdAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comment records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating comment:", error?.response?.data?.message);
      } else {
        console.error("Error creating comment:", error.message);
      }
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      if (!updateData.content?.trim()) {
        throw new Error('Content is required');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          content: updateData.content.trim()
        }]
      };

      const response = await apperClient.updateRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} comment records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating comment:", error?.response?.data?.message);
      } else {
        console.error("Error updating comment:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} comment records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting comment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting comment:", error.message);
      }
      throw error;
    }
  }
};

export default commentService;