import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface WelcomeWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function WelcomeWidget({ widget, dashboardConfig }: WelcomeWidgetProps) {
  const { data, settings } = widget;
  const userName = data.userName || 'there';
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;

  return (
    <div className="h-full flex items-center">
      <div className="flex-1">
        {settings.showGreeting && (
          <div className="flex items-center mb-2">
            {isDay ? (
              <Sun className="h-6 w-6 mr-2" style={{ color: dashboardConfig.accentColor }} />
            ) : (
              <Moon className="h-6 w-6 mr-2" style={{ color: dashboardConfig.accentColor }} />
            )}
            <h2 className="text-2xl font-semibold" style={{ color: dashboardConfig.textColor }}>
              {isDay ? 'Good day' : 'Good evening'}, {userName}!
            </h2>
          </div>
        )}
        {settings.showDate && (
          <p className="text-lg" style={{ color: `${dashboardConfig.textColor}99` }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        )}
      </div>
    </div>
  );
}