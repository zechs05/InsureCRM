import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, User, MapPin, FileText, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentDetailsProps {
  appointment: any;
  onClose: () => void;
  onUpdate: (appointment: any) => void;
  onDelete: (appointmentId: string) => void;
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
  status: 'scheduled' | 'completed' | 'cancelled';
}

const typeIcons = {
  call: Calendar,
  meeting: User,
  task: FileText
};

const typeColors = {
  call: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  task: 'bg-green-100 text-green-600'
};

const statusColors = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function AppointmentDetails({ appointment, onClose, onUpdate, onDelete }: AppointmentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: appointment.title,
      type: appointment.type,
      with: appointment.with || '',
      date: format(appointment.date, 'yyyy-MM-dd'),
      time: appointment.time.includes('AM') || appointment.time.includes('PM') 
        ? format(new Date(`2000-01-01 ${appointment.time}`), 'HH:mm')
        : appointment.time,
      duration: appointment.duration.toString(),
      location: appointment.location || '',
      description: appointment.description || '',
      status: appointment.status
    }
  });

  const appointmentType = watch('type');
  const appointmentStatus = watch('status');

  const handleMarkComplete = () => {
    const updatedAppointment = {
      ...appointment,
      status: 'completed'
    };
    onUpdate(updatedAppointment);
  };

  const handleCancel = () => {
    const updatedAppointment = {
      ...appointment,
      status: 'cancelled'
    };
    onUpdate(updatedAppointment);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const updatedAppointment = {
        ...appointment,
        title: data.title,
        type: data.type,
        with: data.with,
        date: new Date(data.date),
        time: format(new Date(`2000-01-01T${data.time}`), 'h:mm a'),
        duration: parseInt(data.duration),
        location: data.location,
        description: data.description,
        status: data.status
      };
      
      // In a real app, this would be an API call
      setTimeout(() => {
        onUpdate(updatedAppointment);
        setIsEditing(false);
        setSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSaving(false);
    }
  };

  const handleDeleteAppointment = () => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setDeleting(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        onDelete(appointment.id);
        setDeleting(false);
      }, 500);
    }
  };

  const TypeIcon = typeIcons[appointment.type];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Edit Appointment</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    appointmentStatus === 'scheduled' 
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      {...register('status')}
                      value="scheduled"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
                      <Clock className="h-5 w-5 mb-1" />
                      <span className="text-sm">Scheduled</span>
                    </div>
                  </label>
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    appointmentStatus === 'completed' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      {...register('status')}
                      value="completed"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-5 w-5 mb-1" />
                      <span className="text-sm">Completed</span>
                    </div>
                  </label>
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    appointmentStatus === 'cancelled' 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      {...register('status')}
                      value="cancelled"
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-5 w-5 mb-1" />
                      <span className="text-sm">Cancelled</span>
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

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleDeleteAppointment}
                disabled={deleting}
                className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                  deleting
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${typeColors[appointment.type]}`}>
                  <TypeIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 ml-3">{appointment.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{appointment.time} ({appointment.duration} minutes)</span>
              </div>
              
              {appointment.with && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">With: {appointment.with}</span>
                </div>
              )}
              
              {appointment.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Location: {appointment.location}</span>
                </div>
              )}
              
              {appointment.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{appointment.description}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleDeleteAppointment}
                disabled={deleting}
                className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                  deleting
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              
              <div className="flex space-x-2">
                {appointment.status === 'scheduled' && (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Cancel
                    </button>
                    <button
                      onClick={handleMarkComplete}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark Complete
                    </button>
                  </>
                )}
                {appointment.status !== 'scheduled' && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-5 w-5 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}