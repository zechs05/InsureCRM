import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, User, MapPin, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentFormProps {
  onClose: () => void;
  onAdd: (appointment: any) => void;
  initialDate?: Date;
}

interface FormData {
  title: string;
  type: 'call' | 'meeting' | 'task';
  with?: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  description?: string;
}

export default function AppointmentForm({ onClose, onAdd, initialDate = new Date() }: AppointmentFormProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'call',
      date: format(initialDate, 'yyyy-MM-dd'),
      time: '09:00',
      duration: '30'
    }
  });

  const appointmentType = watch('type');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const newAppointment = {
        id: `appointment-${Date.now()}`,
        title: data.title,
        type: data.type,
        with: data.with,
        date: new Date(data.date),
        time: format(new Date(`2000-01-01T${data.time}`), 'h:mm a'),
        duration: parseInt(data.duration),
        location: data.location,
        description: data.description,
        status: 'scheduled'
      };
      
      // In a real app, this would be an API call
      setTimeout(() => {
        onAdd(newAppointment);
        setSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error adding appointment:', error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Add Appointment</h3>
              <p className="text-sm text-gray-500">Schedule a new appointment, call, or task</p>
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
                Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter appointment title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                  appointmentType === 'call' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    {...register('type')}
                    value="call"
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center">
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-sm">Call</span>
                  </div>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                  appointmentType === 'meeting' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    {...register('type')}
                    value="meeting"
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center">
                    <User className="h-5 w-5 mb-1" />
                    <span className="text-sm">Meeting</span>
                  </div>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                  appointmentType === 'task' 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    {...register('type')}
                    value="task"
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center">
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-sm">Task</span>
                  </div>
                </label>
              </div>
            </div>

            {(appointmentType === 'call' || appointmentType === 'meeting') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  With
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('with')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client or team member name"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    {...register('time', { required: 'Time is required' })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
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
                <option value="120">2 hours</option>
              </select>
            </div>

            {appointmentType === 'meeting' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('location')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting location"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add details about this appointment..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              {saving ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}