import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Award, Plus, Search, Filter, ChevronDown } from 'lucide-react';
import type { TeamMember } from '../../types';
import AddTeamMember from './AddTeamMember';
import TeamMemberProfile from './TeamMemberProfile';
import { supabase } from '../../lib/supabase';

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
    joinedAt: '2022-05-15T10:00:00Z',
    lastActive: '2024-03-25T14:30:00Z',
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
    joinedAt: '2023-01-10T09:00:00Z',
    lastActive: '2024-03-24T16:45:00Z',
    performance: {
      leadsAssigned: 38,
      leadsClosed: 15,
      revenue: 62500
    }
  },
  {
    id: '3',
    name: 'David Chen',
    role: 'manager',
    email: 'david.c@example.com',
    phone: '(555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'David leads the sales team with a focus on mentoring new agents and developing strategic partnerships. He has a background in financial planning and insurance.',
    department: 'sales',
    accessLevel: 'admin',
    joinedAt: '2021-08-05T08:30:00Z',
    lastActive: '2024-03-25T09:15:00Z',
    performance: {
      leadsAssigned: 52,
      leadsClosed: 18,
      revenue: 75000
    }
  },
  {
    id: '4',
    name: 'Sarah Williams',
    role: 'agent',
    email: 'sarah.w@example.com',
    phone: '(555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Sarah specializes in life insurance and retirement planning. She takes a holistic approach to helping clients secure their financial future.',
    department: 'sales',
    accessLevel: 'edit',
    joinedAt: '2023-03-20T11:00:00Z',
    lastActive: '2024-03-23T13:20:00Z',
    performance: {
      leadsAssigned: 32,
      leadsClosed: 9,
      revenue: 38500
    }
  },
  {
    id: '5',
    name: 'Michael Rodriguez',
    role: 'admin',
    email: 'michael.r@example.com',
    phone: '(555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Michael oversees the entire CRM system and team operations. With a background in both insurance and technology, he helps streamline processes for maximum efficiency.',
    department: 'operations',
    accessLevel: 'admin',
    joinedAt: '2021-02-15T10:30:00Z',
    lastActive: '2024-03-25T11:45:00Z',
    performance: {
      leadsAssigned: 25,
      leadsClosed: 10,
      revenue: 42000
    }
  }
];

const performanceMetrics = [
  {
    label: 'Total Team Members',
    value: '12',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    label: 'Average Conversion',
    value: '32%',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    label: 'Team Goal Progress',
    value: '78%',
    icon: Target,
    color: 'bg-purple-500'
  },
  {
    label: 'Top Performer',
    value: 'David C.',
    icon: Award,
    color: 'bg-yellow-500'
  }
];

export default function TeamDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddMember = (newMember: TeamMember) => {
    // Create a new member with a unique ID and default performance metrics
    const memberWithDefaults = {
      ...newMember,
      id: `member-${Date.now()}`,
      performance: {
        leadsAssigned: 0,
        leadsClosed: 0,
        revenue: 0
      },
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    // Add the new member to the state
    setTeamMembers([memberWithDefaults, ...teamMembers]);
  };

  const handleUpdateMember = (updatedMember: TeamMember) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
    setSelectedMember(updatedMember);
  };

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    setSelectedMember(null);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <button 
              onClick={() => setShowAddMember(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Team Member
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="agent">Agents</option>
                  <option value="manager">Managers</option>
                  <option value="admin">Admins</option>
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
                  Department
                </label>
                <select 
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Performance</option>
                  <option value="high">High Performers</option>
                  <option value="medium">Medium Performers</option>
                  <option value="low">Low Performers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Access Levels</option>
                  <option value="admin">Admin</option>
                  <option value="edit">Edit</option>
                  <option value="view">View Only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                      {member.department && (
                        <span className="ml-2 text-sm text-gray-500">{member.department.charAt(0).toUpperCase() + member.department.slice(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {member.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {member.phone}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="text-sm font-medium text-gray-900">{member.performance.leadsAssigned}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Closed</p>
                      <p className="text-sm font-medium text-gray-900">{member.performance.leadsClosed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-sm font-medium text-gray-900">${(member.performance.revenue / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddMember && (
        <AddTeamMember
          onClose={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}

      {selectedMember && (
        <TeamMemberProfile
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={handleUpdateMember}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
}