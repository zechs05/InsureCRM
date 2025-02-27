import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { facebookLeadService } from '../../lib/facebook';

interface FacebookLeadSyncProps {
  onSyncComplete?: () => void;
}

export default function FacebookLeadSync({ onSyncComplete }: FacebookLeadSyncProps) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setMessage] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setStatus('idle');
    setMessage('');

    try {
      const count = await facebookLeadService.syncLeads();
      setStatus('success');
      setMessage(`Successfully synced ${count} new leads`);
      setLastSync(new Date());
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to sync leads. Please try again.');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Initial sync
    handleSync();

    // Set up interval for automatic sync
    const interval = setInterval(handleSync, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Facebook Lead Sync</h3>
          <p className="text-sm text-gray-500">
            Automatically import leads from Facebook Lead Ads
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
            syncing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {syncStatus !== 'idle' && (
        <div className={`flex items-center p-4 rounded-lg ${
          syncStatus === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {syncStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <p className={`text-sm ${
            syncStatus === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {syncMessage}
          </p>
        </div>
      )}

      {lastSync && (
        <p className="mt-4 text-sm text-gray-500">
          Last synced: {lastSync.toLocaleString()}
        </p>
      )}
    </div>
  );
}