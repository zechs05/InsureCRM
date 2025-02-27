import React, { useState } from 'react';
import { Settings, Facebook, Bell, Shield, Users, Database, Paintbrush, Cog } from 'lucide-react';
import FacebookLeadSettings from '../leads/FacebookLeadSettings';
import { FacebookConfig } from '../../types/facebook';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'facebook' | 'notifications' | 'security' | 'team' | 'database' | 'appearance'>('facebook');
  const [showFacebookSettings, setShowFacebookSettings] = useState(false);

  const handleSaveFacebookSettings = async (config: Partial<FacebookConfig>) => {
    try {
      // Save Facebook settings to local storage for now
      // In a real app, this would be saved to Supabase
      localStorage.setItem('facebookLeadConfig', JSON.stringify(config));
      
      // Close the settings modal
      setShowFacebookSettings(false);
      
      // Show success message
      alert('Facebook Lead Ads settings saved successfully!');
    } catch (error) {
      console.error('Error saving Facebook settings:', error);
      alert('Failed to save Facebook settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your application settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="p-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'general' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  General
                </div>
              </button>
              <button
                onClick={() => setActiveTab('facebook')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'facebook' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook Leads
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'security' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </div>
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'team' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </div>
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'database' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </div>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'appearance' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Appearance
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'facebook' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Facebook Lead Ads Integration</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure your Facebook Lead Ads integration to automatically import leads
                  </p>
                </div>
                <button
                  onClick={() => setShowFacebookSettings(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Configure
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700">Integration Status</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Connection Status</span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync</span>
                    <span className="text-sm text-gray-900">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Leads Imported</span>
                    <span className="text-sm text-gray-900">124 leads</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
                <div className="mt-4 space-x-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    Sync Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    View Logs
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900">Integration Guide</h4>
                <p className="mt-1 text-sm text-blue-700">
                  To set up Facebook Lead Ads integration:
                </p>
                <ol className="mt-2 ml-4 text-sm text-blue-700 list-decimal space-y-1">
                  <li>Create a Facebook App in the Facebook Developers Console</li>
                  <li>Set up a Lead Ad campaign in Facebook Ads Manager</li>
                  <li>Get your access token and configure the integration settings</li>
                  <li>Map your form fields to CRM fields</li>
                  <li>Test the integration with a sample lead</li>
                </ol>
                <p className="mt-2 text-sm text-blue-700">
                  Need help? Check out our{' '}
                  <a href="#" className="underline">detailed documentation</a>{' '}
                  or{' '}
                  <a href="#" className="underline">contact support</a>.
                </p>
              </div>
            </div>
          )}

          {/* Other tab content would go here */}
        </div>
      </div>

      {showFacebookSettings && (
        <FacebookLeadSettings
          onClose={() => setShowFacebookSettings(false)}
          onSave={handleSaveFacebookSettings}
        />
      )}
    </div>
  );
}