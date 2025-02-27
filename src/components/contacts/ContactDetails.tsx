import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, User, Edit2, Save, Trash2, Cigarette, Users } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Contact, TeamMember } from '../../types';

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
  onUpdate: (updatedContact: Contact) => void;
  onDelete: (contactId: string) => void;
  teamMembers: TeamMember[];
}

export default function ContactDetails({ contact, onClose, onUpdate, onDelete, teamMembers }: ContactDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState({ ...contact });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedContact(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update age if date of birth changed
      if (editedContact.dateOfBirth !== contact.dateOfBirth) {
        editedContact.age = calculateAge(editedContact.dateOfBirth);
      }
      
      // Update assigned team member if changed
      if (editedContact.assignedTeamMemberId !== contact.assignedTeamMemberId) {
        if (editedContact.assignedTeamMemberId) {
          const teamMember = teamMembers.find(tm => tm.id === editedContact.assignedTeamMemberId);
          if (teamMember) {
            editedContact.assignedTeamMember = teamMember;
          } else {
            editedContact.assignedTeamMember = undefined;
          }
        } else {
          editedContact.assignedTeamMember = undefined;
        }
      }
      
      // Update timestamp
      editedContact.updatedAt = new Date().toISOString();
      
      // In a real app, this would be an API call to Supabase
      // const { data, error } = await supabase
      //   .from('contacts')
      //   .update(editedContact)
      //   .eq('id', contact.id)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      onUpdate(editedContact);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setDeleting(true);
      try {
        // In a real app, this would be an API call to Supabase
        // const { error } = await supabase
        //   .from('contacts')
        //   .delete()
        //   .eq('id', contact.id);
        
        // if (error) throw error;
        
        onDelete(contact.id);
        onClose();
      } catch (error) {
        console.error('Error deleting contact:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const sourceColors = {
    facebook: 'bg-blue-100 text-blue-800',
    referral: 'bg-green-100 text-green-800',
    website: 'bg-purple-100 text-purple-800',
    manual: 'bg-gray-100 text-gray-800',
    other: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedContact.name}
                  onChange={handleInputChange}
                  className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              )}
              <div className="flex items-center mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[contact.source]}`}>
                  {contact.source.charAt(0).toUpperCase() + contact.source.slice(1)}
                </span>
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
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={editedContact.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={editedContact.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editedContact.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smoker"
                        name="smoker"
                        checked={editedContact.smoker}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="smoker" className="ml-2 flex items-center text-sm text-gray-900">
                        <Cigarette className="h-4 w-4 mr-2 text-gray-500" />
                        Smoker
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {format(new Date(contact.dateOfBirth), 'MMMM d, yyyy')} ({contact.age} years)
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Cigarette className={`h-4 w-4 mr-2 ${contact.smoker ? 'text-red-500' : 'text-green-500'}`} />
                      <span className="text-gray-900">{contact.smoker ? 'Smoker' : 'Non-Smoker'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Coverage Information</h3>
            {isEditing ? (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Coverage</label>
                <input
                  type="text"
                  name="coverage"
                  value={editedContact.coverage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-900">{contact.coverage}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Team Member</h3>
            {isEditing ? (
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="assignedTeamMemberId"
                  value={editedContact.assignedTeamMemberId || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center">
                {contact.assignedTeamMember ? (
                  <>
                    <img 
                      src={contact.assignedTeamMember.avatar} 
                      alt={contact.assignedTeamMember.name} 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-900">{contact.assignedTeamMember.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
            {isEditing ? (
              <textarea
                name="notes"
                value={editedContact.notes || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700">
                {contact.notes || 'No notes available.'}
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-2">
            {!isEditing && (
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className={`px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center ${
                  deleting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
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
                Edit Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}