import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { CallOutcome } from '../../types';

interface CallOutcomeFormProps {
  callId: string;
  onClose: () => void;
  onComplete: (outcome: CallOutcome) => void;
}

interface FormData {
  status: 'completed' | 'no_answer' | 'rescheduled' | 'cancelled';
  duration_actual: number;
  notes: string;
  follow_up_needed: boolean;
  follow_up_date?: string;
}

export default function CallOutcomeForm({ callId, onClose, onComplete }: CallOutcomeFormProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      status: 'completed',
      duration_actual: 30,
      follow_up_needed: false
    }
  });

  const followUpNeeded = watch('follow_up_needed');
  const status = watch('status');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const { data: outcome, error } = await supabase
        .from('call_outcomes')
        .insert({
          call_id: callId,
          status: data.status,
          duration_actual: data.duration_actual,
          notes: data.notes,
          follow_up_needed: data.follow_up_needed,
          follow_up_date: data.follow_up_needed ? data.follow_up_date : null
        })
        .select()
        .single();

      if (error) throw error;
      
      if (outcome) {
        onComplete(outcome as CallOutcome);
      }
      onClose();
    } catch (error) {
      console.error('Error saving call outcome:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Record Call Outcome</h3>
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
            Call Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="completed">Completed</option>
            <option value="no_answer">No Answer</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {status === 'completed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Duration (minutes)
            </label>
            <input
              type="number"
              {...register('duration_actual')}
              min="1"
              max="240"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes & Summary
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter call notes, key discussion points, and next steps..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('follow_up_needed')}
            id="follow_up_needed"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="follow_up_needed" className="ml-2 block text-sm text-gray-900">
            Follow-up needed?
          </label>
        </div>

        {followUpNeeded && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="datetime-local"
                {...register('follow_up_date')}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
            saving
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Check className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Save Outcome'}
        </button>
      </div>
    </form>
  );
}