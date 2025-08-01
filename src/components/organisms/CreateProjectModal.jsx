import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import FormField from '@/components/molecules/FormField';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectLead: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectLeads = [
    "Sarah Chen",
    "Mike Rodriguez", 
    "Emily Davis",
    "Alex Johnson",
    "Tom Wilson",
    "Lisa Park",
    "David Kim",
    "Jessica Brown"
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        projectLead: editData.projectLead || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        projectLead: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.projectLead) {
      newErrors.projectLead = 'Project lead is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        projectLead: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editData ? 'Edit Project' : 'Create New Project'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Project Name"
              required
              error={errors.name}
            >
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                disabled={isSubmitting}
                className={errors.name ? 'border-red-300 focus:ring-red-500' : ''}
              />
            </FormField>

            <FormField
              label="Description"
              required
              error={errors.description}
            >
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project goals and scope"
                rows={4}
                disabled={isSubmitting}
                className={errors.description ? 'border-red-300 focus:ring-red-500' : ''}
              />
            </FormField>

            <FormField
              label="Project Lead"
              required
              error={errors.projectLead}
            >
              <Select
                value={formData.projectLead}
                onChange={(e) => handleInputChange('projectLead', e.target.value)}
                disabled={isSubmitting}
                className={errors.projectLead ? 'border-red-300 focus:ring-red-500' : ''}
              >
                <option value="">Select project lead</option>
                {projectLeads.map(lead => (
                  <option key={lead} value={lead}>{lead}</option>
                ))}
              </Select>
            </FormField>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                <span>{editData ? 'Update Project' : 'Create Project'}</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProjectModal;