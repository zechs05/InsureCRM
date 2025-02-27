import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import DashboardIcon from '../DashboardIcon';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface ActivityWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function ActivityWidget({ widget, dashboardConfig }: ActivityWidgetProps) {
  const { data, settings } = widget;
  const activities = data.activities || [];
  const limit = settings.limit || 5;

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div 
          className="text-center py-8"
          style={{ color: `${dashboardConfig.textColor}99` }}
        >
          No recent activity
        </div>
      ) : (
        activities.slice(0, limit).map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-start p-3 rounded-lg transition-colors"
            style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
          >
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
            >
              <DashboardIcon 
                name={activity.icon || 'Activity'}
                className="h-5 w-5"
                style={{ color: dashboardConfig.accentColor }}
              />
            </div>
            <div className="ml-3 flex-1">
              <p 
                className="text-sm font-medium"
                style={{ color: dashboardConfig.textColor }}
              >
                {activity.title}
              </p>
              {activity.description && (
                <p 
                  className="text-sm mt-0.5"
                  style={{ color: `${dashboardConfig.textColor}99` }}
                >
                  {activity.description}
                </p>
              )}
              {settings.showTime && (
                <div 
                  className="flex items-center mt-1 text-xs"
                  style={{ color: `${dashboardConfig.textColor}99` }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(activity.timestamp), 'h:mm a')}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}