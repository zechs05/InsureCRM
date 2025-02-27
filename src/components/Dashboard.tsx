import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, Plus, Save, X, Trash2, Sliders, Layout, Palette } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import WidgetLibrary from './dashboard/WidgetLibrary';
import WidgetWrapper from './dashboard/WidgetWrapper';
import DashboardSettings from './dashboard/DashboardSettings';
import { WidgetConfig, LayoutConfig, DashboardConfig, WidgetSize } from '../types/dashboard';
import { generateWidgetId } from '../utils/dashboardUtils';
import WidgetConfigPanel from './dashboard/WidgetConfigPanel';
import DashboardPresets from './dashboard/DashboardPresets';
import ThemeCustomizer from './dashboard/ThemeCustomizer';

// Make responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layouts for different breakpoints
const defaultLayouts = {
  lg: [],
  md: [],
  sm: [],
  xs: []
};

interface DashboardProps {
  user?: User;
}

export default function Dashboard({ user }: DashboardProps) {
  // Dashboard state
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutConfig[] }>(defaultLayouts);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    id: 'default',
    name: 'My Dashboard',
    theme: 'light',
    columns: 12,
    rowHeight: 50,
    backgroundColor: '#f9fafb',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#e5e7eb',
    textColor: '#111827',
    accentColor: '#3b82f6'
  });
  const [showPresets, setShowPresets] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dashboardSaved, setDashboardSaved] = useState(false);

  // Get user's name from metadata, or use a default greeting if not available
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  // Load dashboard configuration from localStorage or API
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // In a real app, this would be loaded from Supabase
        const savedDashboard = localStorage.getItem('dashboardConfig');
        const savedLayouts = localStorage.getItem('dashboardLayouts');
        const savedWidgets = localStorage.getItem('dashboardWidgets');
        
        if (savedDashboard) {
          setDashboardConfig(JSON.parse(savedDashboard));
        }
        
        if (savedLayouts) {
          setLayouts(JSON.parse(savedLayouts));
        }
        
        if (savedWidgets) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          // If no widgets, set up default dashboard
          setupDefaultDashboard();
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setupDefaultDashboard();
      }
    };
    
    loadDashboard();
  }, [user?.id]);

  // Set up default dashboard with some starter widgets
  const setupDefaultDashboard = () => {
    const defaultWidgets: WidgetConfig[] = [
      {
        id: 'welcome-widget',
        type: 'welcome',
        title: 'Welcome',
        size: 'medium' as WidgetSize,
        data: {
          userName: userName
        },
        settings: {
          showGreeting: true,
          showDate: true
        }
      },
      {
        id: 'stats-widget',
        type: 'stats',
        title: 'Key Metrics',
        size: 'medium' as WidgetSize,
        data: {
          metrics: [
            { label: 'Active Leads', value: '245', change: '+12.5%', icon: 'Users', color: 'blue' },
            { label: 'Monthly Goal', value: '82%', change: '+4.3%', icon: 'Target', color: 'green' },
            { label: 'Conversion Rate', value: '24.8%', change: '+2.1%', icon: 'TrendingUp', color: 'purple' },
            { label: 'Revenue MTD', value: '$48,250', change: '+18.2%', icon: 'DollarSign', color: 'yellow' }
          ]
        },
        settings: {
          columns: 2,
          showChange: true
        }
      },
      {
        id: 'activity-widget',
        type: 'activity',
        title: 'Recent Activity',
        size: 'medium' as WidgetSize,
        data: {},
        settings: {
          limit: 5,
          showTime: true
        }
      },
      {
        id: 'chart-widget',
        type: 'chart',
        title: 'Sales Performance',
        size: 'medium' as WidgetSize,
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
    ];
    
    // Create default layout
    const defaultLayout = [
      { i: 'welcome-widget', x: 0, y: 0, w: 12, h: 2 },
      { i: 'stats-widget', x: 0, y: 2, w: 12, h: 3 },
      { i: 'activity-widget', x: 0, y: 5, w: 6, h: 6 },
      { i: 'chart-widget', x: 6, y: 5, w: 6, h: 6 }
    ];
    
    setWidgets(defaultWidgets);
    setLayouts({ lg: defaultLayout, md: defaultLayout, sm: defaultLayout, xs: defaultLayout });
  };

  // Save dashboard configuration
  const saveDashboard = async () => {
    try {
      // In a real app, this would save to Supabase
      localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
      
      // Show saved notification
      setDashboardSaved(true);
      setTimeout(() => setDashboardSaved(false), 2000);
    } catch (error) {
      console.error('Error saving dashboard:', error);
    }
  };

  // Handle layout changes
  const handleLayoutChange = (currentLayout: LayoutConfig[], allLayouts: { [key: string]: LayoutConfig[] }) => {
    if (isDragging || isResizing) {
      setLayouts(allLayouts);
    }
  };

  // Add a new widget from the library
  const addWidget = (widgetType: string, widgetTitle: string, size: WidgetSize = 'medium') => {
    const newWidgetId = generateWidgetId();
    const newWidget: WidgetConfig = {
      id: newWidgetId,
      type: widgetType,
      title: widgetTitle,
      size,
      data: {},
      settings: {}
    };
    
    // Add widget to state
    setWidgets([...widgets, newWidget]);
    
    // Add widget to layout
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach(breakpoint => {
      let width = 6;
      let height = 6;
      
      // Adjust size based on widget type and size
      if (size === 'small') {
        width = 3;
        height = 3;
      } else if (size === 'large') {
        width = 12;
        height = 8;
      }
      
      // Find a good position for the new widget
      const layout = newLayouts[breakpoint];
      let y = 0;
      if (layout.length > 0) {
        // Find the maximum y + h value to place the widget below existing ones
        y = Math.max(...layout.map(item => item.y + item.h));
      }
      
      newLayouts[breakpoint].push({
        i: newWidgetId,
        x: 0,
        y,
        w: width,
        h: height
      });
    });
    
    setLayouts(newLayouts);
    setShowWidgetLibrary(false);
  };

  // Remove a widget
  const removeWidget = (widgetId: string) => {
    // Remove widget from state
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
    
    // Remove widget from layout
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach(breakpoint => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(item => item.i !== widgetId);
    });
    
    setLayouts(newLayouts);
    
    // If the removed widget was selected, clear selection
    if (selectedWidget === widgetId) {
      setSelectedWidget(null);
    }
  };

  // Update widget configuration
  const updateWidgetConfig = (widgetId: string, config: Partial<WidgetConfig>) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, ...config } : widget
    ));
  };

  // Apply a dashboard preset
  const applyPreset = (preset: DashboardConfig, presetLayouts: { [key: string]: LayoutConfig[] }, presetWidgets: WidgetConfig[]) => {
    setDashboardConfig(preset);
    setLayouts(presetLayouts);
    setWidgets(presetWidgets);
    setShowPresets(false);
  };

  // Apply theme changes
  const applyTheme = (theme: Partial<DashboardConfig>) => {
    setDashboardConfig({ ...dashboardConfig, ...theme });
    setShowThemeCustomizer(false);
  };

  return (
    <div 
      className="space-y-6 transition-colors duration-300"
      style={{ 
        backgroundColor: dashboardConfig.backgroundColor,
        color: dashboardConfig.textColor
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: dashboardConfig.textColor }}>
            {dashboardConfig.name}
          </h1>
          <p className="text-gray-600" style={{ color: `${dashboardConfig.textColor}99` }}>
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex space-x-2">
          {editMode ? (
            <>
              <button 
                onClick={() => setShowWidgetLibrary(true)}
                className="px-3 py-2 rounded-lg flex items-center text-white transition-colors"
                style={{ backgroundColor: dashboardConfig.accentColor }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Widget
              </button>
              <button 
                onClick={() => setShowPresets(true)}
                className="px-3 py-2 rounded-lg flex items-center border transition-colors"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  color: dashboardConfig.textColor
                }}
              >
                <Layout className="h-5 w-5 mr-2" />
                Presets
              </button>
              <button 
                onClick={() => setShowThemeCustomizer(true)}
                className="px-3 py-2 rounded-lg flex items-center border transition-colors"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  color: dashboardConfig.textColor
                }}
              >
                <Palette className="h-5 w-5 mr-2" />
                Theme
              </button>
              <button 
                onClick={saveDashboard}
                className="px-3 py-2 rounded-lg flex items-center text-white transition-colors"
                style={{ backgroundColor: dashboardConfig.accentColor }}
              >
                <Save className="h-5 w-5 mr-2" />
                Save
              </button>
              <button 
                onClick={() => setEditMode(false)}
                className="px-3 py-2 rounded-lg flex items-center border transition-colors"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  color: dashboardConfig.textColor
                }}
              >
                <X className="h-5 w-5 mr-2" />
                Exit
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditMode(true)}
              className="px-3 py-2 rounded-lg flex items-center text-white transition-colors"
              style={{ backgroundColor: dashboardConfig.accentColor }}
            >
              <Sliders className="h-5 w-5 mr-2" />
              Customize
            </button>
          )}
        </div>
      </div>

      {/* Dashboard saved notification */}
      {dashboardSaved && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center z-50">
          <CheckCircle className="h-5 w-5 mr-2" />
          Dashboard saved successfully!
        </div>
      )}

      {/* Responsive Grid Layout */}
      <div className="relative">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
          rowHeight={dashboardConfig.rowHeight}
          onLayoutChange={handleLayoutChange}
          isDraggable={editMode}
          isResizable={editMode}
          onDragStart={() => setIsDragging(true)}
          onDragStop={() => setIsDragging(false)}
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={() => setIsResizing(false)}
          margin={[16, 16]}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="transition-shadow duration-300">
              <WidgetWrapper
                widget={widget}
                editMode={editMode}
                isSelected={selectedWidget === widget.id}
                onSelect={() => editMode && setSelectedWidget(widget.id)}
                onRemove={() => removeWidget(widget.id)}
                dashboardConfig={dashboardConfig}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibrary
          onClose={() => setShowWidgetLibrary(false)}
          onAddWidget={addWidget}
          dashboardConfig={dashboardConfig}
        />
      )}

      {/* Widget Configuration Panel */}
      {editMode && selectedWidget && (
        <WidgetConfigPanel
          widget={widgets.find(w => w.id === selectedWidget)!}
          onClose={() => setSelectedWidget(null)}
          onUpdate={(config) => updateWidgetConfig(selectedWidget, config)}
          onRemove={() => removeWidget(selectedWidget)}
          dashboardConfig={dashboardConfig}
        />
      )}

      {/* Dashboard Presets Modal */}
      {showPresets && (
        <DashboardPresets
          onClose={() => setShowPresets(false)}
          onApplyPreset={applyPreset}
          currentConfig={dashboardConfig}
          dashboardConfig={dashboardConfig}
        />
      )}

      {/* Theme Customizer Modal */}
      {showThemeCustomizer && (
        <ThemeCustomizer
          onClose={() => setShowThemeCustomizer(false)}
          onApplyTheme={applyTheme}
          currentConfig={dashboardConfig}
          dashboardConfig={dashboardConfig}
        />
      )}
    </div>
  );
}