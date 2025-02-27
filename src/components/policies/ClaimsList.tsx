import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Clock, DollarSign, User, Search, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { Claim } from '../../types';

const mockClaims: Claim[] = [
  {
    id: '1',
    policyId: '2',
    clientId: '102',
    claimNumber: 'CLM-12345',
    type: 'Auto Accident',
    status: 'under_review',
    filedDate: '2024-03-10',
    incidentDate: '2024-03-05',
    description: 'Vehicle damaged in rear-end collision at intersection.',
    amount: 4500,
    documents: [
      {
        id: 'd1',
        name: 'Accident Report.pdf',
        url: '#',
        uploadedAt: '2024-03-10T14:30:00Z'
      },
      {
        id: 'd2',
        name: 'Damage Photos.zip',
        url: '#',
        uploadedAt: '2024-03-10T14:35:00Z'
      }
    ],
    notes: 'Waiting for repair shop estimate.',
    createdAt: '2024-03-10T14:30:00Z',
    updatedAt: '2024-03-12T09:15:00Z',
    assignedAgentId: 'agent1'
  },
  {
    id: '2',
    policyId: '3',
    clientId: '103',
    claimNumber: 'CLM-23456',
    type: 'Water Damage',
    status: 'approved',
    filedDate: '2024-02-20',
    incidentDate: '2024-02-18',
    description: 'Water damage from burst pipe in upstairs bathroom.',
    amount: 8200,
    approvedAmount: 7500,
    documents: [
      {
        id: 'd3',
        name: 'Plumber Report.pdf',
        url: '#',
        uploadedAt: '2024-02-20T10:15:00Z'
      },
      {
        id: 'd4',
        name: 'Damage Assessment.pdf',
        url: '#',
        uploadedAt: '2024-02-22T16:20:00Z'
      }
    ],
    notes: 'Approved for repair. Contractor scheduled for next week.',
    createdAt: '2024-02-20T10:15:00Z',
    updatedAt: '2024-02-25T11:30:00Z',
    assignedAgentId: 'agent2'
  },
  {
    id: '3',
    policyId: '5',
    clientId: '105',
    claimNumber: 'CLM-34567',
    type: 'Medical Procedure',
    status: 'paid',
    filedDate: '2024-01-15',
    incidentDate: '2024-01-10',
    description: 'Outpatient surgery procedure.',
    amount: 12500,
    approvedAmount: 11000,
    documents: [
      {
        id: 'd5',
        name: 'Medical Records.pdf',
        url: '#',
        uploadedAt: '2024-01-15T09:45:00Z'
      },
      {
        id: 'd6',
        name: 'Hospital Bill.pdf',
        url: '#',
        uploadedAt: '2024-01-15T09:50:00Z'
      }
    ],
    notes: 'Claim processed and payment sent to provider.',
    createdAt: '2024-01-15T09:45:00Z',
    updatedAt: '2024-01-28T14:20:00Z',
    assignedAgentId: 'agent3'
  },
  {
    id: '4',
    policyId: '2',
    clientId: '102',
    claimNumber: 'CLM-45678',
    type: 'Windshield Damage',
    status: 'submitted',
    filedDate: '2024-03-18',
    incidentDate: '2024-03-17',
    description: 'Cracked windshield from road debris.',
    amount: 850,
    documents: [
      {
        id: 'd7',
        name: 'Windshield Photo.jpg',
        url: '#',
        uploadedAt: '2024-03-18T15:10:00Z'
      }
    ],
    notes: 'Awaiting initial review.',
    createdAt: '2024-03-18T15:10:00Z',
    updatedAt: '2024-03-18T15:10:00Z',
    assignedAgentId: 'agent1'
  },
  {
    id: '5',
    policyId: '3',
    clientId: '103',
    claimNumber: 'CLM-56789',
    type: 'Theft',
    status: 'denied',
    filedDate: '2024-02-05',
    incidentDate: '2024-02-01',
    description: 'Laptop stolen from vehicle.',
    amount: 1200,
    documents: [
      {
        id: 'd8',
        name: 'Police Report.pdf',
        url: '#',
        uploadedAt: '2024-02-05T11:25:00Z'
      },
      {
        id: 'd9',
        name: 'Purchase Receipt.pdf',
        url: '#',
        uploadedAt: '2024-02-05T11:30:00Z'
      }
    ],
    notes: 'Claim denied. Personal property in vehicle not covered under home policy.',
    createdAt: '2024-02-05T11:25:00Z',
    updatedAt: '2024-02-10T13:45:00Z',
    assignedAgentId: 'agent2'
  }
];

const clientNames = {
  '101': 'Sarah Thompson',
  '102': 'Michael Chen',
  '103': 'Emily Davis',
  '104': 'David Wilson',
  '105': 'Lisa Brown'
};

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  paid: 'bg-purple-100 text-purple-800'
};

const statusIcons = {
  submitted: Clock,
  under_review: AlertCircle,
  approved: CheckCircle,
  denied: AlertCircle,
  paid: DollarSign
};

export default function ClaimsList() {
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientNames[claim.clientId].toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="paid">Paid</option>
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
        <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
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
              Claim Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="auto_accident">Auto Accident</option>
              <option value="water_damage">Water Damage</option>
              <option value="theft">Theft</option>
              <option value="medical">Medical</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range
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
      
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No claims found matching your criteria.
          </div>
        ) : (
          filteredClaims.map(claim => {
            const StatusIcon = statusIcons[claim.status];
            
            return (
              <div key={claim.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${statusColors[claim.status].replace('text-', 'bg-').replace('100', '200')}`}>
                        <StatusIcon className={`h-5 w-5 ${statusColors[claim.status].replace('bg-', 'text-')}`} />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">{claim.claimNumber}</h4>
                          <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
                            {formatStatus(claim.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{claim.type}</p>
                        <div className="mt-2 flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{clientNames[claim.clientId]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Filed: {format(new Date(claim.filedDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Incident: {format(new Date(claim.incidentDate), 'MMM d, yyyy')}
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-900">${claim.amount.toLocaleString()}</span>
                        {claim.approvedAmount && (
                          <span className="text-sm text-gray-500 ml-1">
                            (Approved: ${claim.approvedAmount.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{claim.description}</p>
                  </div>
                  
                  {claim.documents && claim.documents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.documents.map(doc => (
                          <span key={doc.id} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            <FileText className="h-3 w-3 mr-1" />
                            {doc.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Add Note
                    </button>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    Update Status
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}