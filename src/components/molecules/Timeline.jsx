import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import PriorityIndicator from '@/components/molecules/PriorityIndicator';

const Timeline = ({ events = [] }) => {
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'created':
        return 'Plus';
      case 'status_changed':
        return 'GitBranch';
      case 'priority_changed':
        return 'AlertTriangle';
      case 'assignee_changed':
        return 'User';
      case 'description_changed':
        return 'FileText';
      case 'title_changed':
        return 'Edit3';
      default:
        return 'Clock';
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'created':
        return 'bg-green-500';
      case 'status_changed':
        return 'bg-blue-500';
      case 'priority_changed':
        return 'bg-orange-500';
      case 'assignee_changed':
        return 'bg-purple-500';
      case 'description_changed':
        return 'bg-gray-500';
      case 'title_changed':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatEventMessage = (event) => {
    switch (event.eventType) {
      case 'created':
        return `Created by ${event.user}`;
      case 'status_changed':
        return `Status changed from "${event.oldValue}" to "${event.newValue}"`;
      case 'priority_changed':
        return `Priority changed from "${event.oldValue}" to "${event.newValue}"`;
      case 'assignee_changed':
        return event.oldValue 
          ? `Assignee changed from "${event.oldValue}" to "${event.newValue}"`
          : `Assigned to ${event.newValue}`;
      case 'description_changed':
        return 'Description updated';
      case 'title_changed':
        return `Title changed from "${event.oldValue}" to "${event.newValue}"`;
      default:
        return event.description || 'Unknown event';
    }
  };

  const renderEventValue = (event) => {
    if (event.eventType === 'status_changed') {
      return (
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={event.newValue} size="sm" />
        </div>
      );
    }

    if (event.eventType === 'priority_changed') {
      return (
        <div className="flex items-center gap-2 mt-1">
          <PriorityIndicator priority={event.newValue} size="sm" />
        </div>
      );
    }

    return null;
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <ApperIcon name="Clock" size={24} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id || index} className="flex items-start gap-3 relative">
          {/* Timeline line */}
          {index < events.length - 1 && (
            <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200" />
          )}
          
          {/* Event marker */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
            ${getEventColor(event.eventType)}
          `}>
            <ApperIcon 
              name={getEventIcon(event.eventType)} 
              size={14} 
              className="text-white" 
            />
          </div>

          {/* Event content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {formatEventMessage(event)}
                  </p>
                  {renderEventValue(event)}
                  {event.description && event.eventType !== 'description_changed' && (
                    <p className="text-xs text-gray-600 mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">
                  {format(new Date(event.timestamp), "MMM d, h:mm a")}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;