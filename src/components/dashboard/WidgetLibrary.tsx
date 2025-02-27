import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { WidgetCategory, WidgetDefinition, DashboardConfig } from '../../types/dashboard';
import DashboardIcon from './DashboardIcon';

interface WidgetLibraryProps {
  onClose: () => void;
  onAddWidget: (widgetType: string, widgetTitle: string, size: any) => void;
  dashboardConfig: DashboardConfig;
}

// Widget library categories and definitions
const widgetLibrary: WidgetCategory[] = [
  {
    id: 'charts',
    name: 'Charts & Graphs',
    description: 'Visualize your data with various chart types',
    widgets: [
      {
        type: 'chart',
        name: 'Line Chart',
        description: 'Track trends over time',
        icon: 'LineChart',
        defaultSize: 'medium',
        defaultData: {
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
        defaultSettings: {
          showLegend: true,
          aspectRatio: 2
        }
      },
      {
        type: 'chart',
        name: 'Bar Chart',
        description: 'Compare values across categories',
        icon: 'BarChart',
        defaultSize: 'medium',
        defaultData: {
          chartType: 'bar',
          labels: ['Term Life', 'Whole Life', 'Auto', 'Home', 'Health'],
          datasets: [
            {
              label: 'Policies Sold',
              data: [65, 45, 35, 28, 22],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(236, 72, 153, 0.7)'
              ]
            }
          ]
        },
        defaultSettings: {
          showLegend: true,
          aspectRatio: 2
        }
      },
      {
        type: 'chart',
        name: 'Pie Chart',
        description: 'Show proportions of a whole',
        icon: 'PieChart',
        defaultSize: 'small',
        defaultData: {
          chartType: 'pie',
          labels: ['Term Life', 'Whole Life', 'Auto', 'Home', 'Health'],
          datasets: [
            {
              data: [35, 25, 20, 15, 5],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(236, 72, 153, 0.7)'
              ]
            }
          ]
        },
        defaultSettings: {
          showLegend: true,
          aspectRatio: 1
        }
      }
    ]
  },
  {
    id: 'metrics',
    name: 'Metrics & KPIs',
    description: 'Display key performance indicators and metrics',
    widgets: [
      {
        type: 'stats',
        name: 'Stats Grid',
        description: 'Display multiple metrics in a grid',
        icon: 'LayoutGrid',
        defaultSize: 'medium',
        defaultData: {
          metrics: [
            { label: 'Active Leads', value: '245', change: '+12.5%', icon: 'Users', color: 'blue' },
            { label: 'Monthly Goal', value: '82%', change: '+4.3%', icon: 'Target', color: 'green' },
            { label: 'Conversion Rate', value: '24.8%', change: '+2.1%', icon: 'TrendingUp', color: 'purple' },
            { label: 'Revenue MTD', value: '$48,250', change: '+18.2%', icon: 'DollarSign', color: 'yellow' }
          ]
        },
        defaultSettings: {
          columns: 2,
          showChange: true
        }
      },
      {
        type: 'number',
        name: 'Number Display',
        description: 'Show a single important number with context',
        icon: 'Hash',
        defaultSize: 'small',
        defaultData: {
          value: '$48,250',
          label: 'Monthly Revenue',
          change: '+12.5%',
          icon: 'DollarSign',
          color: 'green'
        },
        defaultSettings: {
          showIcon: true,
          showChange: true,
          size: 'large'
        }
      },
      {
        type: 'progress',
        name: 'Progress Bar',
        description: 'Show progress toward a goal',
        icon: 'BarChart3',
        defaultSize: 'small',
        defaultData: {
          value: 65,
          max: 100,
          label: 'Monthly Goal Progress'
        },
        defaultSettings: {
          showLabel: true,
          showValue: true,
          color: 'blue'
        }
      }
    ]
  },
  {
    id: 'activity',
    name: 'Activity & Updates',
    description: 'Track activities and recent updates',
    widgets: [
      {
        type: 'activity',
        name: 'Activity Feed',
        description: 'Show recent activities and events',
        icon: 'Activity',
        defaultSize: 'medium',
        defaultData: {
          activities: []
        },
        defaultSettings: {
          limit: 5,
          showTime: true
        }
      },
      {
        type: 'calendar',
        name: 'Calendar',
        description: 'View upcoming appointments and events',
        icon: 'Calendar',
        defaultSize: 'medium',
        defaultData: {
          events: []
        },
        defaultSettings: {
          view: 'month',
          showWeekends: true
        }
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Metrics',
    description: 'Create your own custom metrics and formulas',
    widgets: [
      {
        type: 'custom-metric',
        name: 'Custom Metric',
        description: 'Create a metric with a custom formula',
        icon: 'Calculator',
        defaultSize: 'small',
        defaultData: {
          formula: 'revenue / leads',
          variables: {
            revenue: 48250,
            leads: 245
          },
          label: 'Revenue per Lead',
          format: 'currency'
        },
        defaultSettings: {
          showFormula: false,
          precision: 0
        }
      }
    ]
  }
];

export default function WidgetLibrary({ onClose, onAddWidget, dashboardConfig }: WidgetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter widgets based on search query
  const filteredCategories = widgetLibrary.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0);

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
              Widget Library
            </h3>
            <p 
              className="text-sm"
              style={{ color: `${dashboardConfig.textColor}99` }}
            >
              Add widgets to your dashboard
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
          <div className="relative mb-6">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
              style={{ color: `${dashboardConfig.textColor}99` }}
            />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: `${dashboardConfig.textColor}11`,
                border: `1px solid ${dashboardConfig.widgetBorderColor}`,
                color: dashboardConfig.textColor
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div key={category.id}>
                <h4 
                  className="text-sm font-medium mb-2"
                  style={{ color: dashboardConfig.textColor }}
                >
                  {category.name}
                </h4>
                <div className="space-y-2">
                  {category.widgets.map(widget => (
                    <div
                      key={widget.type}
                      className="p-4 rounded-lg cursor-pointer transition-colors"
                      style={{
                        backgroundColor: `${dashboardConfig.textColor}11`,
                        border: `1px solid ${dashboardConfig.widgetBorderColor}`
                      }}
                      onClick={() => onAddWidget(widget.type, widget.name, widget.defaultSize)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
                          >
                            <DashboardIcon 
                              name={widget.icon}
                              className="h-5 w-5"
                              style={{ color: dashboardConfig.accentColor }}
                            />
                          </div>
                          <div className="ml-3">
                            <h5 
                              className="text-sm font-medium"
                              style={{ color: dashboardConfig.textColor }}
                            >
                              {widget.name}
                            </h5>
                            <p 
                              className="text-xs mt-0.5"
                              style={{ color: `${dashboardConfig.textColor}99` }}
                            >
                              {widget.description}
                            </p>
                          </div>
                        </div>
                        <Plus 
                          className="h-5 w-5"
                          style={{ color: dashboardConfig.accentColor }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}