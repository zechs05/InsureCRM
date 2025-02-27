import React, { useState } from 'react';
import { Phone, Mail, Calendar, MessageSquare, FileText, Clock, Tag, User, MapPin, DollarSign, Activity, X } from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { Lead } from '../../types';

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDetails({ lead, onClose }: LeadDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'documents' | 'notes'>('overview');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Phone className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">Call with {lead.name}</p>
                  <p className="text-xs text-gray-500">Yesterday at 2:30 PM</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Discussed policy options, interested in term life</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Mail className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">Email sent to {lead.name}</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Sent policy information and quote</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">SMS sent to {lead.name}</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Appointment confirmation</p>
              </div>
            </div>
          </div>
        );
        
      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Policy Quote.pdf</p>
                  <p className="text-xs text-gray-500">Added 3 days ago</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Download</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Application Form.pdf</p>
                  <p className="text-xs text-gray-500">Added 1 week ago</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Download</button>
            </div>
          </div>
        );
        
      case 'notes':
        return (
          <div className="space-y-4">
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this lead..."
              defaultValue={lead.notes}
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{lead.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{lead.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">123 Main St, Anytown, USA</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Policy Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{lead.policyType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">${lead.coverageAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">John Smith (Agent)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Activity className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Created on:</span>
                  <span className="text-gray-900 ml-1">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Last contacted:</span>
                  <span className="text-gray-900 ml-1">{format(new Date(lead.lastContactedAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Next follow-up:</span>
                  <span className="text-gray-900 ml-1">{format(addDays(new Date(), 3), 'MMM d, yyyy')}</span>
                </div>
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
            <div className="flex items-center mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{lead.source.charAt(0).toUpperCase() + lead.source.slice(1)} Lead</span>
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
            {['overview', 'activity', 'documents', 'notes'].map((tab) => (
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
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Edit Lead
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Delete
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}