import React, { useState } from 'react';
import { X, Check, Sun, Moon, Paintbrush } from 'lucide-react';
import { DashboardConfig, ThemePreset } from '../../types/dashboard';

interface ThemeCustomizerProps {
  onClose: () => void;
  onApplyTheme: (theme: Partial<DashboardConfig>) => void;
  currentConfig: DashboardConfig;
  dashboardConfig: DashboardConfig;
}

const themePresets: ThemePreset[] = [
  {
    id: 'light',
    name: 'Light',
    backgroundColor: '#f9fafb',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#e5e7eb',
    textColor: '#111827',
    accentColor: '#3b82f6'
  },
  {
    id: 'dark',
    name: 'Dark',
    backgroundColor: '#111827',
    widgetBackgroundColor: '#1f2937',
    widgetBorderColor: '#374151',
    textColor: '#f9fafb',
    accentColor: '#60a5fa'
  },
  {
    id: 'blue',
    name: 'Blue',
    backgroundColor: '#eff6ff',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#bfdbfe',
    textColor: '#1e3a8a',
    accentColor: '#3b82f6'
  },
  {
    id: 'green',
    name: 'Green',
    backgroundColor: '#f0fdf4',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#bbf7d0',
    textColor: '#14532d',
    accentColor: '#22c55e'
  },
  {
    id: 'purple',
    name: 'Purple',
    backgroundColor: '#f5f3ff',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#ddd6fe',
    textColor: '#4c1d95',
    accentColor: '#8b5cf6'
  },
  {
    id: 'orange',
    name: 'Orange',
    backgroundColor: '#fff7ed',
    widgetBackgroundColor: '#ffffff',
    widgetBorderColor: '#fed7aa',
    textColor: '#7c2d12',
    accentColor: '#f97316'
  }
];

export default function ThemeCustomizer({
  onClose,
  onApplyTheme,
  currentConfig,
  dashboardConfig
}: ThemeCustomizerProps) {
  const [customTheme, setCustomTheme] = useState({
    backgroundColor: currentConfig.backgroundColor,
    widgetBackgroundColor: currentConfig.widgetBackgroundColor,
    widgetBorderColor: currentConfig.widgetBorderColor,
    textColor: currentConfig.textColor,
    accentColor: currentConfig.accentColor
  });

  const handleColorChange = (property: keyof typeof customTheme, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const applyCustomTheme = () => {
    onApplyTheme(customTheme);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
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
              Theme Customizer
            </h3>
            <p 
              className="text-sm"
              style={{ color: `${dashboardConfig.textColor}99` }}
            >
              Customize your dashboard appearance
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

        <div className="p-6 space-y-6">
          <div>
            <h4 
              className="text-sm font-medium mb-4"
              style={{ color: dashboardConfig.textColor }}
            >
              Theme Presets
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themePresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => onApplyTheme(preset)}
                  className="p-4 rounded-lg border transition-all duration-300"
                  style={{ 
                    backgroundColor: preset.backgroundColor,
                    borderColor: preset.widgetBorderColor
                  }}
                >
                  <div 
                    className="h-20 rounded-lg border mb-3"
                    style={{ 
                      backgroundColor: preset.widgetBackgroundColor,
                      borderColor: preset.widgetBorderColor
                    }}
                  >
                    <div 
                      className="h-2 w-16 rounded mt-2 mx-2"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <div 
                      className="h-2 w-12 rounded mt-2 mx-2"
                      style={{ backgroundColor: preset.textColor }}
                    />
                  </div>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: preset.textColor }}
                  >
                    {preset.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-4"
              style={{ color: dashboardConfig.textColor }}
            >
              Custom Theme
            </h4>
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: dashboardConfig.textColor }}
                >
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ 
                      borderColor: dashboardConfig.widgetBorderColor,
                      backgroundColor: `${dashboardConfig.textColor}11`,
                      color: dashboardConfig.textColor
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: dashboardConfig.textColor }}
                >
                  Widget Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme.widgetBackgroundColor}
                    onChange={(e) => handleColorChange('widgetBackgroundColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.widgetBackgroundColor}
                    onChange={(e) => handleColorChange('widgetBackgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ 
                      borderColor: dashboardConfig.widgetBorderColor,
                      backgroundColor: `${dashboardConfig.textColor}11`,
                      color: dashboardConfig.textColor
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: dashboardConfig.textColor }}
                >
                  Widget Border Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme.widgetBorderColor}
                    onChange={(e) => handleColorChange('widgetBorderColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.widgetBorderColor}
                    onChange={(e) => handleColorChange('widgetBorderColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ 
                      borderColor: dashboardConfig.widgetBorderColor,
                      backgroundColor: `${dashboardConfig.textColor}11`,
                      color: dashboardConfig.textColor
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: dashboardConfig.textColor }}
                >
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ 
                      borderColor: dashboardConfig.widgetBorderColor,
                      backgroundColor: `${dashboardConfig.textColor}11`,
                      color: dashboardConfig.textColor
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: dashboardConfig.textColor }}
                >
                  Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTheme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ 
                      borderColor: dashboardConfig.widgetBorderColor,
                      backgroundColor: `${dashboardConfig.textColor}11`,
                      color: dashboardConfig.textColor
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={applyCustomTheme}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: dashboardConfig.accentColor }}
              >
                <Paintbrush className="h-5 w-5 mr-2" />
                Apply Custom Theme
              </button>
            </div>
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-4"
              style={{ color: dashboardConfig.textColor }}
            >
              Preview
            </h4>
            <div 
              className="rounded-lg p-4"
              style={{ backgroundColor: customTheme.backgroundColor }}
            >
              <div 
                className="rounded-lg border p-4"
                style={{ 
                  backgroundColor: customTheme.widgetBackgroundColor,
                  borderColor: customTheme.widgetBorderColor
                }}
              >
                <h5 
                  className="font-medium mb-2"
                  style={{ color: customTheme.textColor }}
                >
                  Sample Widget
                </h5>
                <div 
                  className="text-sm"
                  style={{ color: `${customTheme.textColor}99` }}
                >
                  This is how your widgets will look
                </div>
                <button
                  className="mt-4 px-4 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: customTheme.accentColor }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}