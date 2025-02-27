import React from 'react';
import { Plus } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface EmptyWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function EmptyWidget({ widget, dashboardConfig }: EmptyWidgetProps) {
  return (
    <div 
      className="h-full flex flex-col items-center justify-center"
      style={{ color: `${dashboardConfig.textColor}99` }}
    >
      <Plus className="h-8 w-8 mb-2" />
      <p className="text-sm">Configure this widget</p>
    </div>
  );
}