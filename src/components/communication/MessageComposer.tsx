import React, { useState, useRef } from 'react';
import { Paperclip, X, Send } from 'lucide-react';

interface MessageComposerProps {
  onSend: (content: string, attachments?: any[]) => void;
}

export default function MessageComposer({ onSend }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    const attachmentData = attachments.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size)
    }));
    
    onSend(message, attachmentData.length > 0 ? attachmentData : undefined);
    setMessage('');
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {attachments.length > 0 && (
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center p-1 bg-white border border-gray-200 rounded"
              >
                <span className="text-xs text-gray-700 mr-1">{file.name}</span>
                <button 
                  onClick={() => handleRemoveAttachment(index)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-3 focus:outline-none resize-none"
        rows={3}
      />
      
      <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            message.trim() || attachments.length > 0 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}