import React from 'react';
import { X, Move } from 'lucide-react';

interface DashboardSettingsProps {
  onClose: () => void;
  widgets: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
  activeWidgets: string[];
  onToggleWidget: (widgetId: string) => void;
}

export default function DashboardSettings({
  onClose,
  widgets,
  activeWidgets,
  onToggleWidget
}: DashboardSettingsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Dashboard Settings</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Customize Widgets</h4>
              <p className="text-sm text-gray-500 mb-4">
                Select which widgets to display on your dashboard
              </p>

              <div className="space-y-2">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <widget.icon className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">{widget.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={activeWidgets.includes(widget.id)}
                        onChange={() => onToggleWidget(widget.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Layout Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <div className="grid grid-cols-2 gap-1 w-full">
                      <div className="bg-gray-200 h-8 rounded"></div>
                      <div className="bg-gray-200 h-8 rounded"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Two Columns</span>
                </button>
                
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-full">
                      <div className="bg-gray-200 h-4 rounded mb-1"></div>
                      <div className="bg-gray-200 h-4 rounded mb-1"></div>
                      <div className="bg-gray-200 h-4 rounded"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Single Column</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}