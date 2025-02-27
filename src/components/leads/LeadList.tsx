import React, { useEffect, useState } from 'react';
import { Phone, Mail, Clock, Tag, MoreVertical, Filter, Search, Plus, ChevronDown, ArrowUpDown, Download, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../types';
import LeadImport from './LeadImport';
import AddLead from './AddLead';
import SalesPipeline from './SalesPipeline';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal: 'bg-indigo-100 text-indigo-800',
  closed: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800'
};

export default function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'pipeline'>('list');

  useEffect(() => {
    fetchLeads();
  }, [filter, searchQuery, sortField, sortDirection]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        // Use mock data if there's an error
        setLeads(getMockLeads());
      } else {
        setLeads(data || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Use mock data if there's an error
      setLeads(getMockLeads());
    } finally {
      setLoading(false);
    }
  };

  const getMockLeads = (): Lead[] => {
    return [
      {
        id: '1',
        name: 'Sarah Thompson',
        email: 'sarah.t@example.com',
        phone: '(555) 123-4567',
        status: 'new',
        source: 'website',
        policyType: 'Term Life',
        coverageAmount: 500000,
        notes: 'Interested in life insurance for family protection',
        createdAt: '2024-03-15T10:30:00Z',
        lastContactedAt: '2024-03-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        phone: '(555) 987-6543',
        status: 'contacted',
        source: 'referral',
        policyType: 'Auto Insurance',
        coverageAmount: 100000,
        notes: 'Looking for comprehensive auto coverage',
        createdAt: '2024-03-10T14:45:00Z',
        lastContactedAt: '2024-03-12T11:20:00Z'
      },
      {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '(555) 456-7890',
        status: 'qualified',
        source: 'website',
        policyType: 'Home Insurance',
        coverageAmount: 350000,
        notes: 'New homeowner seeking coverage',
        createdAt: '2024-03-05T09:15:00Z',
        lastContactedAt: '2024-03-08T15:30:00Z'
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david.w@example.com',
        phone: '(555) 789-0123',
        status: 'proposal',
        source: 'facebook',
        policyType: 'Term Life',
        coverageAmount: 750000,
        notes: 'Reviewing proposal for term life policy',
        createdAt: '2024-02-28T13:20:00Z',
        lastContactedAt: '2024-03-05T10:45:00Z'
      },
      {
        id: '5',
        name: 'Lisa Brown',
        email: 'lisa.b@example.com',
        phone: '(555) 234-5678',
        status: 'closed',
        source: 'referral',
        policyType: 'Auto Insurance',
        coverageAmount: 75000,
        notes: 'Policy issued and payment received',
        createdAt: '2024-02-20T11:10:00Z',
        lastContactedAt: '2024-03-01T14:25:00Z'
      }
    ];
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddLead = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Source', 'Policy Type', 'Coverage Amount', 'Created At'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.status,
        lead.source,
        lead.policyType,
        lead.coverageAmount,
        lead.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderContent = () => {
    if (viewMode === 'pipeline') {
      return <SalesPipeline />;
    }

    return (
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No leads found</div>
        ) : viewMode === 'list' ? (
          leads.map((lead) => (
            <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                    {lead.source === 'facebook' && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Facebook Lead
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="h-4 w-4 mr-2" />
                      {lead.policyType} • ${(lead.coverageAmount / 1000).toFixed(0)}k
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Last contacted: {new Date(lead.lastContactedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Schedule Call
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Send Email
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 overflow-x-auto">
            <div className="flex space-x-4 min-w-[800px]">
              {['new', 'contacted', 'qualified', 'proposal', 'closed'].map(status => (
                <div key={status} className="flex-1 min-w-[250px]">
                  <div className={`p-2 rounded-t-lg ${statusColors[status]} bg-opacity-50`}>
                    <h3 className="font-medium text-center capitalize">{status}</h3>
                  </div>
                  <div className="bg-gray-50 rounded-b-lg min-h-[400px] p-2 space-y-2">
                    {leads
                      .filter(lead => lead.status === status)
                      .map(lead => (
                        <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{lead.name}</h4>
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{lead.email}</p>
                          <p className="text-xs text-gray-500">{lead.policyType} • ${(lead.coverageAmount / 1000).toFixed(0)}k</p>
                          <div className="mt-2 flex justify-between">
                            <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                            <button className="text-xs text-blue-600">Details</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <LeadImport />
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
            <div className="flex space-x-2">
              <button 
                onClick={exportLeads}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button 
                onClick={() => setShowAddLead(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Lead
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Leads</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
              </button>
              
              <button 
                onClick={() => handleSort('created_at')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="h-5 w-5 mr-2 text-gray-500" />
                Sort
              </button>
              
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                >
                  Kanban
                </button>
                <button 
                  onClick={() => setViewMode('pipeline')}
                  className={`px-3 py-2 ${viewMode === 'pipeline' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                >
                  Pipeline
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Source
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Sources</option>
                  <option value="facebook">Facebook</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="term">Term Life</option>
                  <option value="whole">Whole Life</option>
                  <option value="universal">Universal Life</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {renderContent()}
      </div>

      {showAddLead && (
        <AddLead
          onClose={() => setShowAddLead(false)}
          onAdd={handleAddLead}
        />
      )}
    </div>
  );
}