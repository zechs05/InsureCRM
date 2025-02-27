import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Calendar, User, Search, Filter, Plus, ChevronDown, UserPlus, Cigarette, Users, Upload, FileText, DollarSign, Check, X, Download } from 'lucide-react';
import { format, parse } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Contact, TeamMember } from '../../types';
import AddContact from './AddContact';
import ContactDetails from './ContactDetails';
import ImportContacts from './ImportContacts';

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'agent',
    email: 'john.s@example.com',
    phone: '(555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'John is a senior insurance agent with over 10 years of experience in life and health insurance. He specializes in helping families find the right coverage for their needs.',
    department: 'sales',
    accessLevel: 'edit',
    performance: {
      leadsAssigned: 45,
      leadsClosed: 12,
      revenue: 48250
    }
  },
  {
    id: '2',
    name: 'Lisa Johnson',
    role: 'agent',
    email: 'lisa.j@example.com',
    phone: '(555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Lisa is an experienced agent focusing on auto and home insurance. She has consistently been a top performer, helping clients find the best coverage options.',
    department: 'sales',
    accessLevel: 'edit',
    performance: {
      leadsAssigned: 38,
      leadsClosed: 15,
      revenue: 62500
    }
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    email: 'sarah.t@example.com',
    phone: '(555) 123-4567',
    coverage: 'Term Life - $500,000',
    age: 35,
    dateOfBirth: '1989-06-15',
    smoker: false,
    assignedTeamMemberId: '1',
    source: 'website',
    notes: 'Interested in increasing coverage for family protection',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    isActive: true,
    policyNumber: 'TL-45678',
    enforcedDate: '2024-02-15',
    annualPremium: 5000,
    commission: 6125,
    commissionDate: '2024-02-23'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 987-6543',
    coverage: 'Auto Insurance - $100,000',
    age: 42,
    dateOfBirth: '1982-11-23',
    smoker: true,
    assignedTeamMemberId: '2',
    source: 'referral',
    notes: 'Looking for comprehensive coverage for new vehicle',
    createdAt: '2024-03-10T14:45:00Z',
    updatedAt: '2024-03-12T11:20:00Z',
    isActive: false
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    coverage: 'Home Insurance - $350,000',
    age: 29,
    dateOfBirth: '1995-03-08',
    smoker: false,
    assignedTeamMemberId: '1',
    source: 'facebook',
    notes: 'New homeowner seeking coverage',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-08T15:30:00Z',
    isActive: true,
    policyNumber: 'HI-78901',
    enforcedDate: '2024-01-10',
    annualPremium: 2400,
    commission: 3000,
    commissionDate: '2024-01-15'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '(555) 789-0123',
    coverage: 'Term Life - $750,000',
    age: 45,
    dateOfBirth: '1979-09-12',
    smoker: false,
    assignedTeamMemberId: '2',
    source: 'website',
    notes: 'Interested in retirement planning and life insurance',
    createdAt: '2024-02-28T13:20:00Z',
    updatedAt: '2024-03-05T10:45:00Z',
    isActive: false
  },
  {
    id: '5',
    name: 'Mary Jones',
    email: 'mary.j@example.com',
    phone: '(555) 234-5678',
    coverage: 'Whole Life - $500,000',
    age: 38,
    dateOfBirth: '1986-07-30',
    smoker: false,
    assignedTeamMemberId: '1',
    source: 'referral',
    notes: 'Looking for long-term life insurance coverage',
    createdAt: '2024-02-20T11:10:00Z',
    updatedAt: '2024-03-01T14:25:00Z',
    isActive: true,
    policyNumber: 'AB33923',
    enforcedDate: '2024-02-15',
    annualPremium: 5000,
    commission: 6125,
    commissionDate: '2024-02-23'
  }
];

const sourceColors = {
  facebook: 'bg-blue-100 text-blue-800',
  referral: 'bg-green-100 text-green-800',
  website: 'bg-purple-100 text-purple-800',
  manual: 'bg-gray-100 text-gray-800',
  other: 'bg-yellow-100 text-yellow-800',
  import: 'bg-orange-100 text-orange-800'
};

const coverageOptions = [
  'Term Life',
  'Whole Life',
  'Critical Illness',
  'Disability',
  'Mortgage',
  'Auto',
  'Home'
];

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterSmoker, setFilterSmoker] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch contacts and team members
  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setLoading(true);
    setTimeout(() => {
      // Assign team members to contacts
      const contactsWithTeamMembers = mockContacts.map(contact => {
        if (contact.assignedTeamMemberId) {
          const teamMember = mockTeamMembers.find(tm => tm.id === contact.assignedTeamMemberId);
          return {
            ...contact,
            assignedTeamMember: teamMember
          };
        }
        return contact;
      });
      
      setContacts(contactsWithTeamMembers);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddContact = (newContact: Contact) => {
    // Add the new contact to the state
    setContacts([newContact, ...contacts]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    // Update the contact in the state
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setSelectedContact(updatedContact);
  };

  const handleDeleteContact = (contactId: string) => {
    // Remove the contact from the state
    setContacts(contacts.filter(contact => contact.id !== contactId));
    setSelectedContact(null);
  };

  const handleImportContacts = (importedContacts: Contact[]) => {
    // Add the imported contacts to the state
    setContacts([...importedContacts, ...contacts]);
    setShowImportContacts(false);
  };

  const exportContactsToCSV = () => {
    // Create CSV content
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Coverage',
      'Age',
      'Date of Birth',
      'Smoker',
      'Source',
      'Active',
      'Policy Number',
      'Enforced Date',
      'Annual Premium',
      'Commission',
      'Commission Date',
      'Notes'
    ];
    
    const csvRows = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.email}"`,
        `"${contact.phone}"`,
        `"${contact.coverage}"`,
        contact.age,
        contact.dateOfBirth,
        contact.smoker ? 'Yes' : 'No',
        `"${contact.source}"`,
        contact.isActive ? 'Yes' : 'No',
        contact.policyNumber ? `"${contact.policyNumber}"` : '',
        contact.enforcedDate || '',
        contact.annualPremium || '',
        contact.commission || '',
        contact.commissionDate || '',
        `"${contact.notes || ''}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.policyNumber && contact.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = filterSource === 'all' || contact.source === filterSource;
    const matchesSmoker = filterSmoker === 'all' || 
      (filterSmoker === 'smoker' && contact.smoker) || 
      (filterSmoker === 'non-smoker' && !contact.smoker);
    const matchesAssigned = filterAssigned === 'all' || contact.assignedTeamMemberId === filterAssigned;
    const matchesActive = filterActive === 'all' || 
      (filterActive === 'active' && contact.isActive) || 
      (filterActive === 'inactive' && !contact.isActive);
    
    return matchesSearch && matchesSource && matchesSmoker && matchesAssigned && matchesActive;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <p className="text-sm text-gray-500">Manage your client contacts and their information</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowImportContacts(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>
          <button 
            onClick={exportContactsToCSV}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddContact(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="facebook">Facebook</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="manual">Manual</option>
                  <option value="import">Import</option>
                  <option value="other">Other</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  Smoker Status
                </label>
                <select 
                  value={filterSmoker}
                  onChange={(e) => setFilterSmoker(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="smoker">Smoker</option>
                  <option value="non-smoker">Non-Smoker</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select 
                  value={filterAssigned}
                  onChange={(e) => setFilterAssigned(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Team Members</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="number" 
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No contacts found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coverage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age/DOB
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr 
                    key={contact.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-500">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sourceColors[contact.source]}`}>
                              {contact.source.charAt(0).toUpperCase() + contact.source.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {contact.email}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.coverage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.age} years</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {format(new Date(contact.dateOfBirth), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Cigarette className={`h-4 w-4 mr-2 ${contact.smoker ? 'text-red-500' : 'text-green-500'}`} />
                        <span className="text-sm text-gray-900">{contact.smoker ? 'Smoker' : 'Non-Smoker'}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {contact.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <X className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.isActive && contact.policyNumber ? (
                        <div>
                          <div className="text-sm text-gray-900 flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            {contact.policyNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Enforced: {contact.enforcedDate ? format(new Date(contact.enforcedDate), 'MMM d, yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-900 flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                            ${contact.annualPremium?.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No active policy</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.assignedTeamMember ? (
                        <div className="flex items-center">
                          <img 
                            src={contact.assignedTeamMember.avatar} 
                            alt={contact.assignedTeamMember.name} 
                            className="h-6 w-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-900">{contact.assignedTeamMember.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddContact && (
        <AddContact
          onClose={() => setShowAddContact(false)}
          onAdd={handleAddContact}
          teamMembers={teamMembers}
          coverageOptions={coverageOptions}
        />
      )}

      {showImportContacts && (
        <ImportContacts
          onClose={() => setShowImportContacts(false)}
          onImport={handleImportContacts}
          teamMembers={teamMembers}
        />
      )}

      {selectedContact && (
        <ContactDetails
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdate={handleUpdateContact}
          onDelete={handleDeleteContact}
          teamMembers={teamMembers}
          coverageOptions={coverageOptions}
        />
      )}
    </div>
  );
}