import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, X, Users, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../types';
import CallOutcomeForm from './CallOutcomeForm';

interface CallSchedulerProps {
  onClose: () => void;
}

interface CallForm {
  leadId: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  type: 'initial' | 'follow_up' | 'policy_review';
  priority: 'low' | 'medium' | 'high';
}

const callTypes = [
  { value: 'initial', label: 'Initial Consultation' },
  { value: 'follow_up', label: 'Follow-up Call' },
  { value: 'policy_review', label: 'Policy Review' }
];

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' }
];

export default function CallScheduler({ onClose }: CallSchedulerProps) {
  const [scheduling, setScheduling] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [existingCalls, setExistingCalls] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, setValue } = useForm<CallForm>({
    defaultValues: {
      duration: '30',
      type: 'initial',
      priority: 'medium'
    }
  });

  const watchTime = watch('time');
  const watchDuration = watch('duration');

  useEffect(() => {
    fetchLeads();
    fetchExistingCalls();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchExistingCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('type', 'call')
        .gte('scheduled_at', format(new Date(), 'yyyy-MM-dd'))
        .lte('scheduled_at', format(addDays(new Date(), 7), 'yyyy-MM-dd'));

      if (error) throw error;
      setExistingCalls(data || []);
    } catch (error) {
      console.error('Error fetching existing calls:', error);
    }
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isConflict = existingCalls.some(call => {
          const callTime = new Date(call.scheduled_at);
          const slotTime = new Date(`${selectedDate}T${timeString}`);
          return Math.abs(callTime.getTime() - slotTime.getTime()) < 30 * 60 * 1000; // 30 minutes buffer
        });
        
        if (!isConflict) {
          slots.push(timeString);
        }
      }
    }
    return slots;
  };

  const onSubmit = async (data: CallForm) => {
    setScheduling(true);
    try {
      const scheduledTime = new Date(`${data.date}T${data.time}`);
      
      const { data: call, error } = await supabase
        .from('communications')
        .insert({
          type: 'call',
          lead_id: data.leadId,
          scheduled_at: scheduledTime.toISOString(),
          duration: parseInt(data.duration),
          notes: data.notes,
          status: 'scheduled',
          call_type: data.type,
          priority: data.priority
        })
        .select()
        .single();

      if (error) throw error;
      
      if (call) {
        setCurrentCallId(call.id);
        setShowOutcomeForm(true);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error scheduling call:', error);
    } finally {
      setScheduling(false);
    }
  };

  const handleOutcomeComplete = () => {
    setShowOutcomeForm(false);
    onClose();
  };

  const availableTimeSlots = getAvailableTimeSlots();

  if (showOutcomeForm && currentCallId) {
    return (
      <CallOutcomeForm
        callId={currentCallId}
        onClose={() => setShowOutcomeForm(false)}
        onComplete={handleOutcomeComplete}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Schedule Call</h3>
          <p className="text-sm text-gray-500">Schedule a call with a lead</p>
        </div>
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
            Lead
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              {...register('leadId')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Type
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {callTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                {...register('date')}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                {...register('time')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a time</option>
                {availableTimeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            {...register('duration')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes & Talking Points
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Add agenda items, questions, or important points to discuss..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {watchTime && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Scheduling Summary</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {format(parseISO(`${selectedDate}T${watchTime}`), 'MMMM d, yyyy h:mm a')} -{' '}
                  {watchDuration} minutes
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={scheduling}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
              scheduling
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Phone className="h-5 w-5 mr-2" />
            {scheduling ? 'Scheduling...' : 'Schedule Call'}
          </button>
        </div>
      </div>
    </form>
  );
}