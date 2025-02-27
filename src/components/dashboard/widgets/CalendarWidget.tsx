import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface CalendarWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function CalendarWidget({ widget, dashboardConfig }: CalendarWidgetProps) {
  const { data, settings } = widget;
  const events = data.events || [];
  const today = new Date();
  const startDate = startOfWeek(today);
  const endDate = endOfWeek(today);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="text-center text-xs font-medium p-1"
            style={{ color: `${dashboardConfig.textColor}99` }}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = events.filter(event => 
            format(new Date(event.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          
          return (
            <div 
              key={day.toISOString()}
              className={`p-1 rounded-lg ${
                isToday(day) ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: `${dashboardConfig.textColor}11`,
                ringColor: dashboardConfig.accentColor
              }}
            >
              <div 
                className="text-center text-sm"
                style={{ color: dashboardConfig.textColor }}
              >
                {format(day, 'd')}
              </div>
              {dayEvents.length > 0 && (
                <div className="mt-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      className="text-xs p-1 rounded mb-1 truncate"
                      style={{ backgroundColor: event.color || dashboardConfig.accentColor }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div 
                      className="text-xs text-center"
                      style={{ color: `${dashboardConfig.textColor}99` }}
                    >
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}