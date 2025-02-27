import React from 'react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface ProgressWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function ProgressWidget({ widget, dashboardConfig }: ProgressWidgetProps) {
  const { data, settings } = widget;
  const percentage = Math.min(Math.round((data.value / data.max) * 100), 100);

  return (
    <div>
      {settings.showLabel && (
        <div 
          className="flex justify-between items-center mb-2"
          style={{ color: dashboardConfig.textColor }}
        >
          <span className="text-sm font-medium">{data.label}</span>
          {settings.showValue && (
            <span className="text-sm font-medium">{percentage}%</span>
          )}
        </div>
      )}
      <div 
        className="h-2 rounded-full"
        style={{ backgroundColor: `${dashboardConfig.textColor}22` }}
      >
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: settings.color || dashboardConfig.accentColor
          }}
        />
      </div>
    </div>
  );
}