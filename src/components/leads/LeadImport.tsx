import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle2, Facebook, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { facebookLeadService } from '../../lib/facebook';
import type { Lead } from '../../types';
import FacebookLeadSettings from './FacebookLeadSettings';
import FacebookLeadSync from './FacebookLeadSync';

export default function LeadImport() {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showFacebookSettings, setShowFacebookSettings] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      // Check if Facebook Lead Ads is configured
      const { data } = await supabase
        .from('facebook_config')
        .select('*')
        .single();

      setIsConfigured(!!data);
    } catch (error) {
      console.error('Error checking configuration:', error);
    }
  };

  const handleSyncComplete = () => {
    setLastSyncTime(new Date());
  };

  const handleSaveFacebookSettings = async (config: any) => {
    try {
      setShowFacebookSettings(false);
      setIsConfigured(true);
      // Trigger initial sync after configuration
      await facebookLeadService.syncLeads();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error after saving Facebook settings:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Import Leads</h2>
          <p className="text-sm text-gray-500">Import leads from Facebook Lead Ads</p>
        </div>
        <div className="flex space-x-2">
          {isConfigured ? (
            <button
              onClick={() => setShowFacebookSettings(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Cog className="h-5 w-5 mr-2" />
              Settings
            </button>
          ) : (
            <button
              onClick={() => setShowFacebookSettings(true)}
              className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1874EA] transition-colors flex items-center"
            >
              <Facebook className="h-5 w-5 mr-2" />
              Connect Facebook
            </button>
          )}
        </div>
      </div>

      {isConfigured ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Connection Status</h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              {lastSyncTime && (
                <p className="text-sm text-gray-500 mt-2">
                  Last synced: {lastSyncTime.toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Lead Forms</h3>
              <p className="text-sm text-gray-500 mt-2">2 active forms configured</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Sync Frequency</h3>
              <p className="text-sm text-gray-500 mt-2">Every 5 minutes</p>
            </div>
          </div>

          <FacebookLeadSync onSyncComplete={handleSyncComplete} />
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <Facebook className="h-12 w-12 text-[#1877F2] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connect Facebook Lead Ads
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Connect your Facebook account to automatically import leads from your Lead Ads campaigns.
          </p>
          <button
            onClick={() => setShowFacebookSettings(true)}
            className="px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1874EA] transition-colors inline-flex items-center"
          >
            <Facebook className="h-5 w-5 mr-2" />
            Connect with Facebook
          </button>
        </div>
      )}

      {showFacebookSettings && (
        <FacebookLeadSettings
          onClose={() => setShowFacebookSettings(false)}
          onSave={handleSaveFacebookSettings}
        />
      )}
    </div>
  );
}