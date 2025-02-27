import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DashboardIcon from '../DashboardIcon';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface StatsWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function StatsWidget({ widget, dashboardConfig }: StatsWidgetProps) {
  const { data, settings } = widget;
  const { metrics } = data;
  const columns = settings.columns || 2;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="p-4 rounded-lg transition-colors"
          style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: `${dashboardConfig.textColor}99` }}
              >
                {metric.label}
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: dashboardConfig.textColor }}
              >
                {metric.value}
              </p>
            </div>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
            >
              <DashboardIcon 
                name={metric.icon}
                className="h-5 w-5"
                style={{ color: dashboardConfig.accentColor }}
              />
            </div>
          </div>
          {settings.showChange && metric.change && (
            <div className="mt-2 flex items-center">
              {metric.change.startsWith('+') ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                {metric.change}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}