// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Helper function to calculate project statistics
const calculateProjectStats = async (project) => {
  try {
    // Get issues for this project to calculate statistics
    const issueParams = {
      fields: [
        { field: { Name: "status" } },
        { field: { Name: "projectId" } }
      ],
      where: [
        {
          FieldName: "projectId",
          Operator: "EqualTo",
          Values: [project.Id]
        }
      ]
    };

    const issueResponse = await apperClient.fetchRecords('issue', issueParams);
    const projectIssues = issueResponse.success ? issueResponse.data || [] : [];
    
    const totalIssues = projectIssues.length;
    const resolvedIssues = projectIssues.filter(issue => 
      issue.status === 'Resolved' || issue.status === 'Closed'
    ).length;
    const progress = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

    return {
      ...project,
      totalIssues,
      resolvedIssues,
      progress
    };
  } catch (error) {
    // If issues can't be fetched, return project without stats
    return {
      ...project,
      totalIssues: 0,
      resolvedIssues: 0,
      progress: 0
    };
  }
};

const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "projectLead" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
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

      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const projects = response.data || [];
      
      // Calculate statistics for each project
      const projectsWithStats = await Promise.all(
        projects.map(project => calculateProjectStats(project))
      );
      
      return projectsWithStats;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects:", error.message);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "projectLead" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const project = response.data;
      return await calculateProjectStats(project);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching project:", error.message);
      }
      throw error;
    }
  },

  async create(projectData) {
    try {
      // Validate required fields
      if (!projectData.name?.trim()) {
        throw new Error('Project name is required');
      }
      if (!projectData.description?.trim()) {
        throw new Error('Project description is required');
      }
      if (!projectData.projectLead?.trim()) {
        throw new Error('Project lead is required');
      }

      const params = {
        records: [{
          Name: projectData.name.trim(),
          description: projectData.description.trim(),
          projectLead: projectData.projectLead.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Tags: projectData.tags || ''
        }]
      };

      const response = await apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} project records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return await calculateProjectStats(successfulRecords[0].data);
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error("Error creating project:", error.message);
      }
      throw error;
    }
  },

  async update(id, projectData) {
    try {
      // Validate required fields
      if (!projectData.name?.trim()) {
        throw new Error('Project name is required');
      }
      if (!projectData.description?.trim()) {
        throw new Error('Project description is required');
      }
      if (!projectData.projectLead?.trim()) {
        throw new Error('Project lead is required');
      }

      const updateFields = {
        Name: projectData.name.trim(),
        description: projectData.description.trim(),
        projectLead: projectData.projectLead.trim(),
        updatedAt: new Date().toISOString()
      };

      if (projectData.tags !== undefined) {
        updateFields.Tags = projectData.tags;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} project records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return await calculateProjectStats(successfulUpdates[0].data);
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error("Error updating project:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} project records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error("Error deleting project:", error.message);
      }
      throw error;
    }
  }
};

export default projectService;