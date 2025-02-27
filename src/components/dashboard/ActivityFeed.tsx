import React from 'react';
import { Mail, Phone, User, FileText, Clock, Calendar, MessageSquare } from 'lucide-react';
import { format, subHours, subMinutes } from 'date-fns';

const activityTypes = {
  email: { icon: Mail, color: 'bg-blue-100 text-blue-600' },
  call: { icon: Phone, color: 'bg-green-100 text-green-600' },
  lead: { icon: User, color: 'bg-purple-100 text-purple-600' },
  policy: { icon: FileText, color: 'bg-yellow-100 text-yellow-600' },
  meeting: { icon: Calendar, color: 'bg-red-100 text-red-600' },
  message: { icon: MessageSquare, color: 'bg-indigo-100 text-indigo-600' }
};

const activities = [
  {
    id: '1',
    type: 'email',
    title: 'Email sent to Sarah Thompson',
    description: 'Policy renewal reminder',
    timestamp: subHours(new Date(), 1)
  },
  {
    id: '2',
    type: 'call',
    title: 'Call with Michael Chen',
    description: 'Discussed policy options, interested in term life',
    timestamp: subHours(new Date(), 3)
  },
  {
    id: '3',
    type: 'lead',
    title: 'New lead assigned',
    description: 'Emily Davis - Referred by John Smith',
    timestamp: subHours(new Date(), 5)
  },
  {
    id: '4',
    type: 'policy',
    title: 'Policy issued',
    description: 'Term Life - $500k for David Wilson',
    timestamp: subHours(new Date(), 8)
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Meeting scheduled',
    description: 'Policy review with the Johnsons',
    timestamp: subHours(new Date(), 12)
  },
  {
    id: '6',
    type: 'message',
    title: 'SMS sent to Lisa Brown',
    description: 'Appointment confirmation',
    timestamp: subMinutes(new Date(), 30)
  }
];

export default function ActivityFeed() {
  return (
    <div className="divide-y divide-gray-200">
      {activities.map((activity) => {
        const { icon: Icon, color } = activityTypes[activity.type];
        
        return (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex">
              <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(activity.timestamp, 'h:mm a')}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
}