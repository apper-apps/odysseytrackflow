import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";
import projectService from "@/services/api/projectService";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const progressPercentage = Math.round(project.progress);
  
  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="FolderOpen" className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
            <p className="text-sm text-gray-500">Led by {project.projectLead}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.Id)}
            className="text-red-400 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Issues</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 font-medium">{project.totalIssues}</span>
            <span className="text-green-600">{project.resolvedIssues} resolved</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-900 font-medium">{progressPercentage}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
      setIsCreateModalOpen(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
      throw err;
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.Id, projectData);
      setProjects(prev => prev.map(p => p.Id === updatedProject.Id ? updatedProject : p));
      setEditingProject(null);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
      throw err;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.Id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track your project progress</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>New Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Empty
          icon="FolderOpen"
          title="No projects yet"
          description="Create your first project to start organizing your issues and tracking progress."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.Id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen || !!editingProject}
        onClose={closeModals}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
        editData={editingProject}
      />
    </div>
  );
};

export default Projects;