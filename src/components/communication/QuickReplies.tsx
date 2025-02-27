import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
  onClose: () => void;
}

interface QuickReply {
  id: string;
  content: string;
}

const defaultQuickReplies: QuickReply[] = [
  {
    id: '1',
    content: 'Yes, that works for me.'
  },
  {
    id: '2',
    content: 'I\'ll get back to you on that shortly.'
  },
  {
    id: '3',
    content: 'Could we schedule a call to discuss this further?'
  },
  {
    id: '4',
    content: 'Thank you for your prompt response.'
  },
  {
    id: '5',
    content: 'I\'ve attached the requested documents.'
  },
  {
    id: '6',
    content: 'Let me know if you need anything else.'
  }
];

export default function QuickReplies({ onSelect, onClose }: QuickRepliesProps) {
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(defaultQuickReplies);
  const [showAddReply, setShowAddReply] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null);

  const handleAddReply = () => {
    if (!newReplyContent.trim()) return;
    
    const newReply: QuickReply = {
      id: `reply-${Date.now()}`,
      content: newReplyContent
    };
    
    setQuickReplies([...quickReplies, newReply]);
    setNewReplyContent('');
    setShowAddReply(false);
  };

  const handleUpdateReply = () => {
    if (!editingReply || !editingReply.content.trim()) return;
    
    setQuickReplies(quickReplies.map(reply => 
      reply.id === editingReply.id ? editingReply : reply
    ));
    
    setEditingReply(null);
  };

  const handleDeleteReply = (id: string) => {
    setQuickReplies(quickReplies.filter(reply => reply.id !== id));
    if (editingReply?.id === id) {
      setEditingReply(null);
    }
  };

  return (
    <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Quick Replies</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setShowAddReply(true)}
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
      
      {showAddReply ? (
        <div className="p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quick Reply Text
              </label>
              <textarea
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter quick reply text"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddReply(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReply}
                disabled={!newReplyContent.trim()}
                className={`px-3 py-1 rounded-lg text-white transition-colors text-sm ${
                  newReplyContent.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Add Reply
              </button>
            </div>
          </div>
        </div>
      ) : editingReply ? (
        <div className="p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quick Reply Text
              </label>
              <textarea
                value={editingReply.content}
                onChange={(e) => setEditingReply({...editingReply, content: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingReply(null)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReply}
                disabled={!editingReply.content.trim()}
                className={`px-3 py-1 rounded-lg text-white transition-colors text-sm ${
                  editingReply.content.trim()
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
          {quickReplies.map((reply) => (
            <div 
              key={reply.id}
              className="p-3 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-700">{reply.content}</p>
                <div className="flex space-x-1 ml-2">
                  <button 
                    onClick={() => setEditingReply(reply)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Edit2 className="h-3 w-3 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleDeleteReply(reply.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => onSelect(reply.content)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Send
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}