import React, { useState, useRef } from 'react';
import { Plus, UserPlus, Phone, Mail, Calendar, FileText, X } from 'lucide-react';

export default function QuickActions() {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  const actions = [
    { icon: UserPlus, label: 'Add Lead', action: () => console.log('Add lead') },
    { icon: Phone, label: 'Schedule Call', action: () => console.log('Schedule call') },
    { icon: Mail, label: 'Send Email', action: () => console.log('Send email') },
    { icon: Calendar, label: 'Add Appointment', action: () => console.log('Add appointment') },
    { icon: FileText, label: 'Create Quote', action: () => console.log('Create quote') }
  ];

  const handleActionClick = (actionFn) => {
    actionFn();
    setShowActions(false);
  };

  return (
    <div className="relative" ref={actionsRef}>
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
      >
        {showActions ? (
          <X className="h-5 w-5" />
        ) : (
          <Plus className="h-5 w-5" />
        )}
      </button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.action)}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <action.icon className="h-4 w-4 mr-3 text-gray-500" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}