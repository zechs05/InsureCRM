import React from 'react';
import { X, Check } from 'lucide-react';
import { DashboardPreset, DashboardConfig } from '../../types/dashboard';

interface DashboardPresetsProps {
  onClose: () => void;
  onApplyPreset: (preset: DashboardConfig, layouts: any, widgets: any) => void;
  currentConfig: DashboardConfig;
  dashboardConfig: DashboardConfig;
}

const presets: DashboardPreset[] = [
  {
    id: 'sales-focused',
    name: 'Sales Dashboard',
    description: 'Optimized for tracking sales performance and revenue',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80',
    config: {
      id: 'sales',
      name: 'Sales Dashboard',
      theme: 'light',
      columns: 12,
      rowHeight: 50,
      backgroundColor: '#f9fafb',
      widgetBackgroundColor: '#ffffff',
      widgetBorderColor: '#e5e7eb',
      textColor: '#111827',
      accentColor: '#3b82f6'
    },
    layouts: {
      lg: [
        { i: 'stats', x: 0, y: 0, w: 12, h: 3 },
        { i: 'revenue-chart', x: 0, y: 3, w: 8, h: 6 },
        { i: 'top-performers', x: 8, y: 3, w: 4, h: 6 },
        { i: 'recent-sales', x: 0, y: 9, w: 6, h: 6 },
        { i: 'pipeline', x: 6, y: 9, w: 6, h: 6 }
      ]
    },
    widgets: [
      {
        id: 'stats',
        type: 'stats',
        title: 'Key Metrics',
        size: 'medium',
        data: {
          metrics: [
            { label: 'Revenue', value: '$48,250', change: '+12.5%', icon: 'DollarSign', color: 'green' },
            { label: 'Policies Sold', value: '124', change: '+8.3%', icon: 'FileText', color: 'blue' },
            { label: 'Conversion Rate', value: '24.8%', change: '+2.1%', icon: 'TrendingUp', color: 'purple' },
            { label: 'Active Leads', value: '245', change: '+15.2%', icon: 'Users', color: 'yellow' }
          ]
        },
        settings: {
          columns: 4,
          showChange: true
        }
      },
      {
        id: 'revenue-chart',
        type: 'chart',
        title: 'Revenue Trend',
        size: 'large',
        data: {
          chartType: 'line',
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [12500, 19200, 15800, 24500, 18300, 22100],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }
          ]
        },
        settings: {
          showLegend: true,
          aspectRatio: 2
        }
      }
    ]
  },
  {
    id: 'team-focused',
    name: 'Team Dashboard',
    description: 'Perfect for managing team performance and activities',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    config: {
      id: 'team',
      name: 'Team Dashboard',
      theme: 'light',
      columns: 12,
      rowHeight: 50,
      backgroundColor: '#f9fafb',
      widgetBackgroundColor: '#ffffff',
      widgetBorderColor: '#e5e7eb',
      textColor: '#111827',
      accentColor: '#8b5cf6'
    },
    layouts: {
      lg: [
        { i: 'team-stats', x: 0, y: 0, w: 12, h: 3 },
        { i: 'team-performance', x: 0, y: 3, w: 8, h: 6 },
        { i: 'activity-feed', x: 8, y: 3, w: 4, h: 6 },
        { i: 'calendar', x: 0, y: 9, w: 6, h: 6 },
        { i: 'tasks', x: 6, y: 9, w: 6, h: 6 }
      ]
    },
    widgets: [
      {
        id: 'team-stats',
        type: 'stats',
        title: 'Team Performance',
        size: 'medium',
        data: {
          metrics: [
            { label: 'Team Members', value: '12', change: '+2', icon: 'Users', color: 'purple' },
            { label: 'Avg. Conversion', value: '32%', change: '+4.3%', icon: 'TrendingUp', color: 'green' },
            { label: 'Active Leads', value: '245', change: '+15.2%', icon: 'Target', color: 'blue' },
            { label: 'Tasks Completed', value: '85%', change: '+5.5%', icon: 'CheckSquare', color: 'yellow' }
          ]
        },
        settings: {
          columns: 4,
          showChange: true
        }
      }
    ]
  },
  {
    id: 'client-focused',
    name: 'Client Dashboard',
    description: 'Focus on client relationships and policy management',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
    config: {
      id: 'client',
      name: 'Client Dashboard',
      theme: 'light',
      columns: 12,
      rowHeight: 50,
      backgroundColor: '#f9fafb',
      widgetBackgroundColor: '#ffffff',
      widgetBorderColor: '#e5e7eb',
      textColor: '#111827',
      accentColor: '#10b981'
    },
    layouts: {
      lg: [
        { i: 'client-stats', x: 0, y: 0, w: 12, h: 3 },
        { i: 'policy-distribution', x: 0, y: 3, w: 6, h: 6 },
        { i: 'renewals', x: 6, y: 3, w: 6, h: 6 },
        { i: 'recent-interactions', x: 0, y: 9, w: 6, h: 6 },
        { i: 'upcoming-renewals', x: 6, y: 9, w: 6, h: 6 }
      ]
    },
    widgets: [
      {
        id: 'client-stats',
        type: 'stats',
        title: 'Client Overview',
        size: 'medium',
        data: {
          metrics: [
            { label: 'Total Clients', value: '186', change: '+8', icon: 'Users', color: 'green' },
            { label: 'Active Policies', value: '248', change: '+12', icon: 'FileText', color: 'blue' },
            { label: 'Retention Rate', value: '94%', change: '+2.1%', icon: 'Heart', color: 'red' },
            { label: 'Avg. Policy Value', value: '$4,850', change: '+5.5%', icon: 'DollarSign', color: 'yellow' }
          ]
        },
        settings: {
          columns: 4,
          showChange: true
        }
      }
    ]
  }
];

export default function DashboardPresets({
  onClose,
  onApplyPreset,
  currentConfig,
  dashboardConfig
}: DashboardPresetsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: dashboardConfig.widgetBackgroundColor }}
      >
        <div 
          className="p-6 border-b flex justify-between items-center"
          style={{ borderColor: dashboardConfig.widgetBorderColor }}
        >
          <div>
            <h3 
              className="text-lg font-medium"
              style={{ color: dashboardConfig.textColor }}
            >
              Dashboard Presets
            </h3>
            <p 
              className="text-sm"
              style={{ color: `${dashboardConfig.textColor}99` }}
            >
              Choose a pre-configured dashboard layout
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ color: dashboardConfig.textColor }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {presets.map(preset => (
              <div
                key={preset.id}
                className="rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`
                }}
              >
                <img
                  src={preset.thumbnail}
                  alt={preset.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 
                    className="text-lg font-medium"
                    style={{ color: dashboardConfig.textColor }}
                  >
                    {preset.name}
                  </h4>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: `${dashboardConfig.textColor}99` }}
                  >
                    {preset.description}
                  </p>
                  <button
                    onClick={() => onApplyPreset(preset.config, preset.layouts, preset.widgets)}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: dashboardConfig.accentColor }}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Apply Preset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}