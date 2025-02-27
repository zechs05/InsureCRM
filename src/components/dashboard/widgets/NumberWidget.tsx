import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DashboardIcon from '../DashboardIcon';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface NumberWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function NumberWidget({ widget, dashboardConfig }: NumberWidgetProps) {
  const { data, settings } = widget;

  return (
    <div className="h-full flex items-center">
      <div className="flex-1">
        {settings.showIcon && data.icon && (
          <div 
            className="p-2 rounded-lg w-fit mb-2"
            style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
          >
            <DashboardIcon 
              name={data.icon}
              className="h-5 w-5"
              style={{ color: dashboardConfig.accentColor }}
            />
          </div>
        )}
        <p 
          className="text-sm"
          style={{ color: `${dashboardConfig.textColor}99` }}
        >
          {data.label}
        </p>
        <p 
          className={`font-semibold ${settings.size === 'large' ? 'text-3xl' : 'text-2xl'} mt-1`}
          style={{ color: dashboardConfig.textColor }}
        >
          {data.value}
        </p>
        {settings.showChange && data.change && (
          <div className="flex items-center mt-2">
            {data.change.startsWith('+') ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={data.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
              {data.change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}