import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Clock, Search, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EmailComposer from './EmailComposer';
import SMSComposer from './SMSComposer';
import CallScheduler from './CallScheduler';
import type { Communication } from '../../types';

const communicationTypes = {
  email: { icon: Mail, label: 'Email', color: 'text-blue-600' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'text-green-600' },
  call: { icon: Phone, label: 'Call', color: 'text-purple-600' }
};

export default function CommunicationCenter() {
  const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
  const [composeType, setComposeType] = useState<'email' | 'sms' | 'call' | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCommunications = async () => {
    try {
      let query = supabase
        .from('communications')
        .select(`
          *,
          lead:leads(name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      if (searchQuery) {
        query = query.textSearch('content', searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderComposeView = () => {
    switch (composeType) {
      case 'email':
        return <EmailComposer onClose={() => setComposeType(null)} />;
      case 'sms':
        return <SMSComposer onClose={() => setComposeType(null)} />;
      case 'call':
        return <CallScheduler onClose={() => setComposeType(null)} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {Object.entries(communicationTypes).map(([type, { icon: Icon, label, color }]) => (
              <button
                key={type}
                onClick={() => setComposeType(type as 'email' | 'sms' | 'call')}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className={`h-12 w-12 ${color} mb-4`} />
                <span className="text-lg font-medium text-gray-900">{label}</span>
                <span className="text-sm text-gray-500 mt-2">Create new {label.toLowerCase()}</span>
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex items-center p-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">Communication Center</h2>
              <p className="text-sm text-gray-500">Manage all your client communications in one place</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                History
              </button>
              <button
                onClick={() => {
                  setActiveTab('compose');
                  setComposeType(null);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'compose'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Compose
              </button>
            </div>
          </div>

          {activeTab === 'history' && (
            <div className="flex space-x-4 px-6 pb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="email">Emails</option>
                  <option value="sms">SMS</option>
                  <option value="call">Calls</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {activeTab === 'history' ? (
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading communications...</div>
            ) : communications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No communications found</div>
            ) : (
              communications.map((comm) => {
                const { icon: Icon, color } = communicationTypes[comm.type];
                return (
                  <div key={comm.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className={`${color} p-2 rounded-lg bg-opacity-10`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {comm.lead.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {format(new Date(comm.created_at), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{comm.content}</p>
                        {comm.status && (
                          <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {comm.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          renderComposeView()
        )}
      </div>
    </div>
  );
}