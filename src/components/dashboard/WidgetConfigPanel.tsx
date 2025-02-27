import React, { useState } from 'react';
import { X, Save, Trash2, Settings } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../types/dashboard';
import DashboardIcon from './DashboardIcon';

interface WidgetConfigPanelProps {
  widget: WidgetConfig;
  onClose: () => void;
  onUpdate: (config: Partial<WidgetConfig>) => void;
  onRemove: () => void;
  dashboardConfig: DashboardConfig;
}

export default function WidgetConfigPanel({
  widget,
  onClose,
  onUpdate,
  onRemove,
  dashboardConfig
}: WidgetConfigPanelProps) {
  const [title, setTitle] = useState(widget.title);
  const [settings, setSettings] = useState(widget.settings);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    try {
      onUpdate({
        title,
        settings
      });
      onClose();
    } catch (error) {
      console.error('Error saving widget configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderSettingsFields = () => {
    switch (widget.type) {
      case 'welcome':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Greeting
              </label>
              <input
                type="checkbox"
                checked={settings.showGreeting}
                onChange={(e) => setSettings({ ...settings, showGreeting: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Date
              </label>
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={(e) => setSettings({ ...settings, showDate: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </>
        );

      case 'stats':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Columns
              </label>
              <select
                value={settings.columns}
                onChange={(e) => setSettings({ ...settings, columns: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Change
              </label>
              <input
                type="checkbox"
                checked={settings.showChange}
                onChange={(e) => setSettings({ ...settings, showChange: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </>
        );

      case 'chart':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Chart Type
              </label>
              <select
                value={widget.data.chartType}
                onChange={(e) => onUpdate({ 
                  data: { ...widget.data, chartType: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="doughnut">Doughnut Chart</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Legend
              </label>
              <input
                type="checkbox"
                checked={settings.showLegend}
                onChange={(e) => setSettings({ ...settings, showLegend: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Aspect Ratio
              </label>
              <input
                type="number"
                value={settings.aspectRatio}
                onChange={(e) => setSettings({ ...settings, aspectRatio: parseFloat(e.target.value) })}
                min={0.5}
                max={4}
                step={0.1}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              />
            </div>
          </>
        );

      case 'activity':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Activity Limit
              </label>
              <input
                type="number"
                value={settings.limit}
                onChange={(e) => setSettings({ ...settings, limit: parseInt(e.target.value) })}
                min={1}
                max={20}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Time
              </label>
              <input
                type="checkbox"
                checked={settings.showTime}
                onChange={(e) => setSettings({ ...settings, showTime: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </>
        );

      case 'calendar':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                View Type
              </label>
              <select
                value={settings.view}
                onChange={(e) => setSettings({ ...settings, view: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Show Weekends
              </label>
              <input
                type="checkbox"
                checked={settings.showWeekends}
                onChange={(e) => setSettings({ ...settings, showWeekends: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </>
        );

      case 'custom-metric':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Formula
              </label>
              <input
                type="text"
                value={widget.data.formula}
                onChange={(e) => onUpdate({ 
                  data: { ...widget.data, formula: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Format
              </label>
              <select
                value={widget.data.format}
                onChange={(e) => onUpdate({ 
                  data: { ...widget.data, format: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              >
                <option value="number">Number</option>
                <option value="currency">Currency</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Precision
              </label>
              <input
                type="number"
                value={settings.precision}
                onChange={(e) => setSettings({ ...settings, precision: parseInt(e.target.value) })}
                min={0}
                max={4}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ 
                  borderColor: dashboardConfig.widgetBorderColor,
                  backgroundColor: `${dashboardConfig.textColor}11`,
                  color: dashboardConfig.textColor
                }}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
      style={{ 
        backgroundColor: dashboardConfig.widgetBackgroundColor,
        borderLeft: `1px solid ${dashboardConfig.widgetBorderColor}`
      }}
    >
      <div 
        className="p-6 border-b flex justify-between items-center"
        style={{ borderColor: dashboardConfig.widgetBorderColor }}
      >
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2" style={{ color: dashboardConfig.textColor }} />
          <h3 
            className="font-medium"
            style={{ color: dashboardConfig.textColor }}
          >
            Widget Settings
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          style={{ color: dashboardConfig.textColor }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: dashboardConfig.textColor }}
          >
            Widget Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ 
              borderColor: dashboardConfig.widgetBorderColor,
              backgroundColor: `${dashboardConfig.textColor}11`,
              color: dashboardConfig.textColor
            }}
          />
        </div>

        {renderSettingsFields()}

        <div className="pt-6 border-t" style={{ borderColor: dashboardConfig.widgetBorderColor }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: dashboardConfig.accentColor }}
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onRemove}
            className="w-full mt-2 flex items-center justify-center px-4 py-2 border rounded-lg transition-colors"
            style={{ 
              borderColor: dashboardConfig.widgetBorderColor,
              color: dashboardConfig.textColor
            }}
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Remove Widget
          </button>
        </div>
      </div>
    </div>
  );
}