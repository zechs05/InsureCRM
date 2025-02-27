import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Facebook, AlertCircle } from 'lucide-react';
import { facebookLeadService } from '../../lib/facebook';
import type { FacebookConfig } from '../../types/facebook';

interface FacebookLeadSettingsProps {
  onClose: () => void;
  onSave: (config: Partial<FacebookConfig>) => void;
}

export default function FacebookLeadSettings({ onClose, onSave }: FacebookLeadSettingsProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit } = useForm<Partial<FacebookConfig>>();

  const handleFacebookConnect = async () => {
    try {
      setConnecting(true);
      setError(null);

      // Initialize Facebook SDK
      await facebookLeadService.initialize();

      // Perform login
      const accessToken = await facebookLeadService.login();
      
      // Get the Facebook page details
      const pageDetails = await facebookLeadService.getPages(accessToken);

      if (!pageDetails) {
        throw new Error('No Facebook pages found. Please make sure you have admin access to a Facebook page.');
      }
      
      // Get form details
      const formDetails = await facebookLeadService.getForms(accessToken, pageDetails.id);

      if (!formDetails?.length) {
        throw new Error('No lead forms found. Please create a lead form in Facebook first.');
      }
      
      // Save the configuration
      const config = {
        accessToken,
        pageId: pageDetails.id,
        formId: formDetails[0]?.id,
        syncInterval: 5
      };
      
      await facebookLeadService.saveConfig(config);
      onSave(config);
      onClose();
    } catch (error: any) {
      console.error('Facebook connection error:', error);
      
      if (error.message?.includes('Failed to initialize Facebook SDK')) {
        setError('Failed to connect to Facebook. Please check your internet connection and try again.');
      } else if (error.message?.includes('Facebook login failed')) {
        setError('Failed to connect to Facebook. Please try again. If the problem persists, check your Facebook App settings.');
      } else {
        setError(error.message || 'Failed to connect to Facebook. Please try again.');
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Facebook Lead Ads Settings</h3>
              <p className="text-sm text-gray-500">Configure your Facebook Lead Ads integration</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleFacebookConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1874EA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Facebook className="h-5 w-5 mr-2" />
            {connecting ? 'Connecting...' : 'Connect with Facebook'}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Before connecting, make sure:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></div>
                You have admin access to your Facebook page
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></div>
                You have at least one Lead Ad form created
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></div>
                Your Facebook App is properly configured
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}