import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';

interface EmailComposerProps {
  onClose: () => void;
}

interface EmailForm {
  to: string;
  subject: string;
  content: string;
  template?: string;
}

const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Our Insurance Family',
    content: `Dear {name},

Thank you for your interest in our life insurance solutions. We're excited to help you protect what matters most.

I'd love to schedule a brief call to discuss your needs and find the perfect coverage for you. Would any of these times work for you?

- Tomorrow at 2:00 PM
- Wednesday at 10:00 AM
- Thursday at 4:00 PM

Best regards,
{agent_name}`
  },
  {
    id: 'follow_up',
    name: 'Follow-up After Call',
    subject: 'Thank You for Your Time',
    content: `Hi {name},

Thank you for taking the time to discuss your insurance needs today. I've put together some information about the policies we discussed:

{policy_details}

Please let me know if you have any questions. I'm here to help!

Best regards,
{agent_name}`
  }
];

export default function EmailComposer({ onClose }: EmailComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<EmailForm>();

  const onTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setValue('subject', template.subject);
      setValue('content', template.content);
    }
  };

  const onSubmit = async (data: EmailForm) => {
    setSending(true);
    try {
      // In a real application, this would integrate with your email service
      const { error } = await supabase
        .from('communications')
        .insert({
          type: 'email',
          recipient: data.to,
          subject: data.subject,
          content: data.content,
          status: 'sent',
          template_id: selectedTemplate || null
        });

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Compose Email</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a template</option>
            {emailTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="email"
            {...register('to')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            {...register('subject')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            {...register('content')}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
              sending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </form>
  );
}