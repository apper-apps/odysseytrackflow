import mockProjects from '@/services/mockData/projects.json';
import issueService from '@/services/api/issueService';

// Create a mutable copy of the mock data
let projects = [...mockProjects];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to calculate project statistics
const calculateProjectStats = (project) => {
  const projectIssues = issueService.getIssuesByProjectId(project.Id);
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
};

const projectService = {
  // Get all projects with statistics
  async getAll() {
    await delay(300);
    return projects.map(calculateProjectStats);
  },

  // Get project by ID with statistics
  async getById(id) {
    await delay(200);
    if (typeof id !== 'number') {
      throw new Error('Project ID must be a number');
    }
    
    const project = projects.find(p => p.Id === id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    return calculateProjectStats(project);
  },

  // Create new project
  async create(projectData) {
    await delay(500);
    
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

    // Generate new ID
    const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.Id)) : 0;
    const newProject = {
      Id: maxId + 1,
      name: projectData.name.trim(),
      description: projectData.description.trim(),
      projectLead: projectData.projectLead.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.unshift(newProject);
    return calculateProjectStats(newProject);
  },

  // Update existing project
  async update(id, projectData) {
    await delay(400);
    
    if (typeof id !== 'number') {
      throw new Error('Project ID must be a number');
    }

    const index = projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

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

    const updatedProject = {
      ...projects[index],
      name: projectData.name.trim(),
      description: projectData.description.trim(),
      projectLead: projectData.projectLead.trim(),
      updatedAt: new Date().toISOString()
    };

    projects[index] = updatedProject;
    return calculateProjectStats(updatedProject);
  },

  // Delete project
  async delete(id) {
    await delay(300);
    
    if (typeof id !== 'number') {
      throw new Error('Project ID must be a number');
    }

    const index = projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  },

  // Get projects by lead
  async getProjectsByLead(leadName) {
    await delay(250);
    const filteredProjects = projects.filter(p => 
      p.projectLead.toLowerCase().includes(leadName.toLowerCase())
    );
    return filteredProjects.map(calculateProjectStats);
  },

  // Search projects by name or description
  async searchProjects(searchTerm) {
    await delay(200);
    const term = searchTerm.toLowerCase();
    const filteredProjects = projects.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
    return filteredProjects.map(calculateProjectStats);
  }
};

export default projectService;