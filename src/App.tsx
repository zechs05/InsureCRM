import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, MessageSquare, Target, DollarSign, PieChart, Settings, GitBranch, FileText, CalendarClock, Phone } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadList from './components/leads/LeadList';
import TeamDashboard from './components/team/TeamDashboard';
import GoalTracker from './components/goals/GoalTracker';
import CommunicationCenter from './components/communication/CommunicationCenter';
import MessageCenter from './components/communication/MessageCenter';
import Analytics from './components/analytics/Analytics';
import SalesPipeline from './components/leads/SalesPipeline';
import PolicyDashboard from './components/policies/PolicyDashboard';
import CalendarView from './components/calendar/CalendarView';
import CommissionTracker from './components/commission/CommissionTracker';
import ContactsList from './components/contacts/ContactsList';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'leads' | 'team' | 'goals' | 'messages' | 'analytics' | 'pipeline' | 'policies' | 'settings' | 'calendar' | 'commission' | 'landing' | 'login' | 'signup' | 'contacts';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Set up auth state listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
          if (session?.user) {
            setActiveTab('dashboard');
          }
        }
      );
      
      setLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('landing');
  };

  const renderContent = () => {
    // If loading, show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // If not logged in, show landing, login, or signup
    if (!user) {
      switch (activeTab) {
        case 'login':
          return <Login onTabChange={setActiveTab} />;
        case 'signup':
          return <Signup onTabChange={setActiveTab} />;
        default:
          return <LandingPage onTabChange={setActiveTab} />;
      }
    }

    // If logged in, show app content
    switch (activeTab) {
      case 'leads':
        return <LeadList />;
      case 'team':
        return <TeamDashboard />;
      case 'goals':
        return <GoalTracker />;
      case 'messages':
        return <MessageCenter />;
      case 'analytics':
        return <Analytics />;
      case 'pipeline':
        return <SalesPipeline />;
      case 'policies':
        return <PolicyDashboard />;
      case 'calendar':
        return <CalendarView />;
      case 'commission':
        return <CommissionTracker />;
      case 'contacts':
        return <ContactsList />;
      case 'settings':
        return <div className="p-8"><h2 className="text-xl font-semibold">Settings</h2></div>;
      case 'landing':
        return <LandingPage onTabChange={setActiveTab} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  // If we're on the landing page, login, or signup, don't show the sidebar
  if (!user || activeTab === 'landing' || activeTab === 'login' || activeTab === 'signup') {
    return renderContent();
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} user={user} />
      <main className="flex-1 overflow-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;