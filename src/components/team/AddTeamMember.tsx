import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus } from 'lucide-react';
import type { TeamMember } from '../../types';

interface AddTeamMemberProps {
  onClose: () => void;
  onAdd: (member: TeamMember) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: 'agent' | 'admin' | 'manager';
  department: string;
  bio: string;
  accessLevel: 'view' | 'edit' | 'admin';
  avatar: string;
}

const defaultAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
];

export default function AddTeamMember({ onClose, onAdd }: AddTeamMemberProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      role: 'agent',
      department: 'sales',
      accessLevel: 'edit',
      avatar: defaultAvatars[0]
    }
  });

  const selectedAvatar = watch('avatar');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // Create a new team member object
      const newMember: TeamMember = {
        id: '', // This will be set by the parent component
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        bio: data.bio,
        accessLevel: data.accessLevel,
        avatar: data.avatar,
        performance: {
          leadsAssigned: 0,
          leadsClosed: 0,
          revenue: 0
        }
      };
      
      // Call the onAdd callback with the new member
      onAdd(newMember);
      onClose();
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Add Team Member</h3>
              <p className="text-sm text-gray-500">Add a new member to your team</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <img
                  src={selectedAvatar}
                  alt="Selected avatar"
                  className="h-24 w-24 rounded-full border-4 border-blue-100"
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {defaultAvatars.map((avatar) => (
                  <label key={avatar} className="cursor-pointer">
                    <input
                      type="radio"
                      {...register('avatar')}
                      value={avatar}
                      className="sr-only"
                    />
                    <img
                      src={avatar}
                      alt="Avatar option"
                      className={`w-12 h-12 rounded-full transition-all ${
                        selectedAvatar === avatar 
                          ? 'ring-4 ring-blue-500' 
                          : 'ring-2 ring-transparent hover:ring-blue-200'
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  {...register('department')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select
                  {...register('accessLevel')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Edit</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter team member bio..."
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
              <UserPlus className="h-5 w-5 mr-2" />
              {saving ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}