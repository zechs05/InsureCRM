import React from 'react';
import { BarChart3, Users, Calendar, MessageSquare, Target, DollarSign, PieChart, Settings, GitBranch, FileText, CalendarClock, CreditCard, LogOut, Phone, Facebook } from 'lucide-react';
import { User } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'leads' | 'team' | 'goals' | 'messages' | 'analytics' | 'pipeline' | 'policies' | 'settings' | 'calendar' | 'commission' | 'landing' | 'contacts';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  user: User;
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', value: 'dashboard' as const },
  { icon: Users, label: 'Team', value: 'team' as const },
  { icon: Facebook, label: 'Facebook Leads', value: 'leads' as const },
  { icon: Phone, label: 'Contacts', value: 'contacts' as const },
  { icon: GitBranch, label: 'Pipeline', value: 'pipeline' as const },
  { icon: FileText, label: 'Policies', value: 'policies' as const },
  { icon: CalendarClock, label: 'Calendar', value: 'calendar' as const },
  { icon: CreditCard, label: 'Commission', value: 'commission' as const },
  { icon: DollarSign, label: 'Goals', value: 'goals' as const },
  { icon: MessageSquare, label: 'Messages', value: 'messages' as const },
  { icon: PieChart, label: 'Analytics', value: 'analytics' as const },
  { icon: Settings, label: 'Settings', value: 'settings' as const },
];

export default function Sidebar({ activeTab, onTabChange, onLogout, user }: SidebarProps) {
  // Get user name for display
  const userName = user?.user_metadata?.full_name || 'User';
  const userEmail = user?.email || '';
  
  // Get profile picture if available
  const profilePicture = user?.user_metadata?.profile_picture || null;
  
  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 px-3 py-4 flex flex-col">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-blue-600">InsureCRM</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.value
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => onTabChange(item.value as Tab)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-4 py-4">
        <div className="flex items-center">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={userName} 
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Agent'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="mt-4 w-full flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}