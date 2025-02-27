import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Goal } from '../../types';

interface AddGoalProps {
  onClose: () => void;
  onAdd: (goal: Goal) => void;
}

interface FormData {
  type: 'revenue' | 'leads' | 'policies';
  target: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

const goalTypes = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'leads', label: 'Leads' },
  { value: 'policies', label: 'Policies' }
];

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

export default function AddGoal({ onClose, onAdd }: AddGoalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'revenue',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const goalType = watch('type');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const { data: goal, error } = await supabase
        .from('goals')
        .insert({
          type: data.type,
          target: data.target,
          current: 0,
          period: data.period,
          start_date: data.startDate,
          end_date: data.endDate
        })
        .select()
        .single();

      if (error) throw error;
      
      if (goal) {
        onAdd(goal as Goal);
      }
      onClose();
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Set New Goal</h3>
              <p className="text-sm text-gray-500">Define your performance targets</p>
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
                Goal Type
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {goalTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target {goalType === 'revenue' ? 'Amount ($)' : 'Count'}
              </label>
              <input
                type="number"
                {...register('target', {
                  required: 'Target is required',
                  min: {
                    value: 1,
                    message: 'Target must be greater than 0'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.target && (
                <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                {...register('period')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Target className="h-5 w-5 mr-2" />
              {saving ? 'Setting Goal...' : 'Set Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}