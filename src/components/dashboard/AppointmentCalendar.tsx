import React from 'react';
import { Calendar, Clock, Video, Phone, User } from 'lucide-react';
import { format, addDays } from 'date-fns';

const appointments = [
  {
    id: '1',
    title: 'Policy Review',
    type: 'video',
    with: 'Sarah Thompson',
    date: new Date(),
    time: '2:30 PM',
    duration: 45
  },
  {
    id: '2',
    title: 'Initial Consultation',
    type: 'call',
    with: 'Michael Chen',
    date: addDays(new Date(), 1),
    time: '10:00 AM',
    duration: 30
  },
  {
    id: '3',
    title: 'Quote Presentation',
    type: 'video',
    with: 'Emily Davis',
    date: addDays(new Date(), 2),
    time: '3:15 PM',
    duration: 60
  }
];

const appointmentTypeIcons = {
  video: Video,
  call: Phone,
  inPerson: User
};

const appointmentTypeColors = {
  video: 'bg-purple-100 text-purple-600',
  call: 'bg-blue-100 text-blue-600',
  inPerson: 'bg-green-100 text-green-600'
};

export default function AppointmentCalendar() {
  return (
    <div className="divide-y divide-gray-200">
      {appointments.map((appointment) => {
        const Icon = appointmentTypeIcons[appointment.type];
        const colorClass = appointmentTypeColors[appointment.type];
        
        return (
          <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
                  <p className="text-sm text-gray-500">with {appointment.with}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(appointment.date, 'MMM d')}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time} ({appointment.duration} min)
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Reschedule
              </button>
              <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                Join {appointment.type === 'video' ? 'Video' : 'Call'}
              </button>
            </div>
          </div>
        );
      })}
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Full Calendar
        </button>
      </div>
    </div>
  );
}