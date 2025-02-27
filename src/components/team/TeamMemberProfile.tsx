import React, { useState } from 'react';
import { Mail, Phone, Calendar, Shield, Award, Clock, X, Edit2, Save, Trash2, User, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { TeamMember } from '../../types';

interface TeamMemberProfileProps {
  member: TeamMember;
  onClose: () => void;
  onUpdate: (updatedMember: TeamMember) => void;
  onDelete: (memberId: string) => void;
}

const accessLevels = [
  { value: 'view', label: 'View Only', description: 'Can view leads and data but cannot make changes' },
  { value: 'edit', label: 'Edit', description: 'Can view and edit leads, but cannot delete or manage team' },
  { value: 'admin', label: 'Admin', description: 'Full access to all features and settings' }
];

export default function TeamMemberProfile({ member, onClose, onUpdate, onDelete }: TeamMemberProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({ ...member });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'access'>('profile');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccessChange = (level: string) => {
    setEditedMember(prev => ({
      ...prev,
      accessLevel: level
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({
          name: editedMember.name,
          email: editedMember.email,
          phone: editedMember.phone,
          role: editedMember.role,
          bio: editedMember.bio,
          accessLevel: editedMember.accessLevel,
          department: editedMember.department
        })
        .eq('id', member.id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        onUpdate(data as TeamMember);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', member.id);

        if (error) throw error;
        
        onDelete(member.id);
        onClose();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-blue-900">Leads Assigned</h4>
                  <span className="text-xl font-semibold text-blue-700">{member.performance.leadsAssigned}</span>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-green-900">Leads Closed</h4>
                  <span className="text-xl font-semibold text-green-700">{member.performance.leadsClosed}</span>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-purple-900">Revenue Generated</h4>
                  <span className="text-xl font-semibold text-purple-700">${member.performance.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Conversion Rate</h3>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${(member.performance.leadsClosed / member.performance.leadsAssigned) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs font-medium text-gray-700">
                  {((member.performance.leadsClosed / member.performance.leadsAssigned) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Monthly Performance</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-end h-32 space-x-2">
                  {[65, 48, 72, 85, 60, 75].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {format(new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1), 'MMM')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">Closed a $125,000 policy</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">Added 3 new leads</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'access':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Access Level</h3>
              <div className="space-y-3">
                {accessLevels.map(level => (
                  <div 
                    key={level.value}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      (isEditing ? editedMember.accessLevel : member.accessLevel) === level.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => isEditing && handleAccessChange(level.value)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        level.value === 'admin' 
                          ? 'bg-red-100 text-red-600' 
                          : level.value === 'edit'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                      }`}>
                        <Lock className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{level.label}</p>
                        <p className="text-xs text-gray-500">{level.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Permissions</h3>
              <div className="space-y-2">
                {[
                  { name: 'View leads', enabled: true },
                  { name: 'Edit leads', enabled: (isEditing ? editedMember.accessLevel : member.accessLevel) !== 'view' },
                  { name: 'Delete leads', enabled: (isEditing ? editedMember.accessLevel : member.accessLevel) === 'admin' },
                  { name: 'Manage team', enabled: (isEditing ? editedMember.accessLevel : member.accessLevel) === 'admin' },
                  { name: 'View analytics', enabled: true },
                  { name: 'Export data', enabled: (isEditing ? editedMember.accessLevel : member.accessLevel) !== 'view' },
                  { name: 'System settings', enabled: (isEditing ? editedMember.accessLevel : member.accessLevel) === 'admin' }
                ].map((permission, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{permission.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      permission.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {permission.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Login Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Last login</span>
                  </div>
                  <span className="text-sm text-gray-500">Today, 9:32 AM</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Two-factor authentication</span>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default: // profile
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editedMember.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editedMember.phone || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{member.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Role Information</h3>
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Role</label>
                        <select
                          name="role"
                          value={editedMember.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="agent">Agent</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Department</label>
                        <select
                          name="department"
                          value={editedMember.department || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Department</option>
                          <option value="sales">Sales</option>
                          <option value="support">Support</option>
                          <option value="marketing">Marketing</option>
                          <option value="operations">Operations</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                      </div>
                      {member.department && (
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{member.department.charAt(0).toUpperCase() + member.department.slice(1)} Department</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedMember.bio || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team member bio..."
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {member.bio || 'No bio available.'}
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Joined:</span>
                  <span className="text-gray-900 ml-1">{format(new Date(member.joinedAt || member.created_at), 'MMM d, yyyy')}</span>
                </div>
                {member.lastActive && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Last active:</span>
                    <span className="text-gray-900 ml-1">{format(new Date(member.lastActive), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={member.avatar}
              alt={member.name}
              className="h-12 w-12 rounded-full"
            />
            <div className="ml-4">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedMember.name}
                  onChange={handleInputChange}
                  className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
              )}
              <div className="flex items-center mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
                {member.department && (
                  <>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{member.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex">
            {['profile', 'performance', 'access'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {renderTabContent()}
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-2">
            {!isEditing && (
              <button 
                onClick={handleDelete}
                className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}