import React from 'react';
import { X, Settings } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../types/dashboard';
import WidgetContent from './WidgetContent';

interface WidgetWrapperProps {
  widget: WidgetConfig;
  editMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  dashboardConfig: DashboardConfig;
}

export default function WidgetWrapper({
  widget,
  editMode,
  isSelected,
  onSelect,
  onRemove,
  dashboardConfig
}: WidgetWrapperProps) {
  return (
    <div 
      className={`h-full w-full rounded-lg transition-all duration-300 overflow-hidden ${
        editMode ? 'cursor-move' : ''
      } ${
        isSelected ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: dashboardConfig.widgetBackgroundColor,
        border: `1px solid ${dashboardConfig.widgetBorderColor}`,
        boxShadow: isSelected ? `0 0 0 2px ${dashboardConfig.accentColor}` : 'none',
        color: dashboardConfig.textColor
      }}
      onClick={onSelect}
    >
      <div 
        className="p-4 border-b flex justify-between items-center"
        style={{ borderColor: dashboardConfig.widgetBorderColor }}
      >
        <h3 className="font-medium truncate" style={{ color: dashboardConfig.textColor }}>
          {widget.title}
        </h3>
        {editMode && (
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: dashboardConfig.textColor }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4 h-[calc(100%-56px)] overflow-auto">
        <WidgetContent widget={widget} dashboardConfig={dashboardConfig} />
      </div>
    </div>
  );
}