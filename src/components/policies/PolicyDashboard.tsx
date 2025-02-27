import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, ChevronDown, Calendar, Clock, DollarSign, User, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import PolicyList from './PolicyList';
import ClientList from './ClientList';
import RenewalTracker from './RenewalTracker';
import ClaimsList from './ClaimsList';
import AddPolicy from './AddPolicy';
import AddClient from './AddClient';
import type { Policy, Client } from '../../types';

export default function PolicyDashboard() {
  const [activeView, setActiveView] = useState<'policies' | 'clients' | 'renewals' | 'claims'>('policies');
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const summaryStats = [
    {
      label: 'Active Policies',
      value: '248',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Upcoming Renewals',
      value: '12',
      icon: Calendar,
      color: 'bg-yellow-500'
    },
    {
      label: 'Premium Revenue',
      value: '$124,500',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      label: 'Total Clients',
      value: '186',
      icon: User,
      color: 'bg-purple-500'
    }
  ];

  const handleAddPolicy = (policy: Policy) => {
    // In a real app, this would update state or trigger a refetch
    console.log('Policy added:', policy);
  };

  const handleAddClient = (client: Client) => {
    // In a real app, this would update state or trigger a refetch
    console.log('Client added:', client);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'clients':
        return <ClientList />;
      case 'renewals':
        return <RenewalTracker />;
      case 'claims':
        return <ClaimsList />;
      default:
        return <PolicyList />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Policy Management</h2>
              <p className="text-sm text-gray-500">Manage policies, clients, renewals, and claims</p>
            </div>
            <div className="flex space-x-2">
              {activeView === 'policies' && (
                <button 
                  onClick={() => setShowAddPolicy(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Policy
                </button>
              )}
              {activeView === 'clients' && (
                <button 
                  onClick={() => setShowAddClient(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Client
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies, clients, or claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="lapsed">Lapsed</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                More Filters
                <ChevronDown className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Type
                </label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="term_life">Term Life</option>
                  <option value="whole_life">Whole Life</option>
                  <option value="universal_life">Universal Life</option>
                  <option value="auto">Auto</option>
                  <option value="home">Home</option>
                  <option value="health">Health</option>
                  <option value="disability">Disability</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Renewal Date
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From"
                  />
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Range
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min"
                  />
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveView('policies')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'policies'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Policies
              </button>
              <button
                onClick={() => setActiveView('clients')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'clients'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Clients
              </button>
              <button
                onClick={() => setActiveView('renewals')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'renewals'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Renewals
              </button>
              <button
                onClick={() => setActiveView('claims')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'claims'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Claims
              </button>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {showAddPolicy && (
        <AddPolicy
          onClose={() => setShowAddPolicy(false)}
          onAdd={handleAddPolicy}
        />
      )}

      {showAddClient && (
        <AddClient
          onClose={() => setShowAddClient(false)}
          onAdd={handleAddClient}
        />
      )}
    </div>
  );
}