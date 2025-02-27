import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';

interface SMSComposerProps {
  onClose: () => void;
}

interface SMSForm {
  to: string;
  message: string;
  template?: string;
}

const smsTemplates = [
  {
    id: 'appointment_reminder',
    name: 'Appointment Reminder',
    content: 'Hi {name}, this is a reminder about your insurance consultation tomorrow at {time}. Looking forward to speaking with you!'
  },
  {
    id: 'follow_up',
    name: 'Quick Follow-up',
    content: 'Hi {name}, just following up on our conversation about life insurance. Would you like to schedule a time to discuss your options?'
  }
];

export default function SMSComposer({ onClose }: SMSComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, setValue } = useForm<SMSForm>();

  const onTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = smsTemplates.find(t => t.id === templateId);
    if (template) {
      setValue('message', template.content);
    }
  };

  const onSubmit = async (data: SMSForm) => {
    setSending(true);
    try {
      // In a real application, this would integrate with your SMS service
      const { error } = await supabase
        .from('communications')
        .insert({
          type: 'sms',
          recipient: data.to,
          content: data.message,
          status: 'sent',
          template_id: selectedTemplate || null
        });

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error sending SMS:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Send SMS</h3>
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
            {smsTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To (Phone Number)
          </label>
          <input
            type="tel"
            {...register('to')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Character count: {watch('message')?.length || 0}
          </p>
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
            <MessageSquare className="h-5 w-5 mr-2" />
            {sending ? 'Sending...' : 'Send SMS'}
          </button>
        </div>
      </div>
    </form>
  );
}