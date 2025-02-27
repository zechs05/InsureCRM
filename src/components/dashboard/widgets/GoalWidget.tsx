import React from 'react';
import { Target } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface GoalWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function GoalWidget({ widget, dashboardConfig }: GoalWidgetProps) {
  const { data, settings } = widget;
  const percentage = Math.min(Math.round((data.current / data.target) * 100), 100);
  const remaining = data.target - data.current;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 
            className="text-lg font-medium"
            style={{ color: dashboardConfig.textColor }}
          >
            {data.name}
          </h3>
          <p 
            className="text-sm"
            style={{ color: `${dashboardConfig.textColor}99` }}
          >
            Progress towards your goal
          </p>
        </div>
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
        >
          <Target 
            className="h-5 w-5"
            style={{ color: dashboardConfig.accentColor }}
          />
        </div>
      </div>

      <div 
        className="h-2 rounded-full mb-4"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p 
            className="text-sm"
            style={{ color: `${dashboardConfig.textColor}99` }}
          >
            Current
          </p>
          <p 
            className="text-lg font-medium"
            style={{ color: dashboardConfig.textColor }}
          >
            {data.current} {data.unit}
          </p>
        </div>
        <div>
          <p 
            className="text-sm"
            style={{ color: `${dashboardConfig.textColor}99` }}
          >
            Target
          </p>
          <p 
            className="text-lg font-medium"
            style={{ color: dashboardConfig.textColor }}
          >
            {data.target} {data.unit}
          </p>
        </div>
      </div>

      {settings.showRemaining && (
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
        >
          <p 
            className="text-sm"
            style={{ color: dashboardConfig.textColor }}
          >
            {remaining} {data.unit} remaining to reach your goal
          </p>
        </div>
      )}
    </div>
  );
}