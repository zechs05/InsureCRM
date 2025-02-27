import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

interface MessageTemplatesProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

const defaultTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Message',
    content: 'Hello! Thank you for your interest in our insurance services. How can I assist you today?'
  },
  {
    id: '2',
    name: 'Follow-up',
    content: 'I wanted to follow up on our previous conversation. Have you had a chance to review the information I sent?'
  },
  {
    id: '3',
    name: 'Quote Ready',
    content: 'Good news! I\'ve prepared a personalized quote based on your needs. Would you like me to walk you through the details?'
  },
  {
    id: '4',
    name: 'Meeting Confirmation',
    content: 'I\'m confirming our meeting on [DATE] at [TIME]. Please let me know if you need to reschedule.'
  },
  {
    id: '5',
    name: 'Thank You',
    content: 'Thank you for choosing us for your insurance needs. It\'s been a pleasure working with you!'
  }
];

export default function MessageTemplates({ onSelect, onClose }: MessageTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) return;
    
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      content: newTemplateContent
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setNewTemplateContent('');
    setShowAddTemplate(false);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !editingTemplate.name.trim() || !editingTemplate.content.trim()) return;
    
    setTemplates(templates.map(template => 
      template.id === editingTemplate.id ? editingTemplate : template
    ));
    
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    if (editingTemplate?.id === id) {
      setEditingTemplate(null);
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Message Templates</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setShowAddTemplate(true)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      
      {showAddTemplate ? (
        <div className="p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Template Content
              </label>
              <textarea
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter template content"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddTemplate(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTemplate}
                disabled={!newTemplateName.trim() || !newTemplateContent.trim()}
                className={`px-3 py-1 rounded-lg text-white transition-colors text-sm ${
                  newTemplateName.trim() && newTemplateContent.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Add Template
              </button>
            </div>
          </div>
        </div>
      ) : editingTemplate ? (
        <div className="p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Template Content
              </label>
              <textarea
                value={editingTemplate.content}
                onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTemplate}
                disabled={!editingTemplate.name.trim() || !editingTemplate.content.trim()}
                className={`px-3 py-1 rounded-lg text-white transition-colors text-sm ${
                  editingTemplate.name.trim() && editingTemplate.content.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No templates found</div>
          ) : (
            filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => setEditingTemplate(template)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Edit2 className="h-3 w-3 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.content}</p>
                <button
                  onClick={() => onSelect(template.content)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use Template
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}