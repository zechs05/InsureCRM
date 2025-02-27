import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, User, Plus, ChevronLeft, ChevronRight, MoreVertical, Search, Filter, CheckCircle, X, CalendarClock, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, getDay, parseISO, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import AppointmentForm from './AppointmentForm';
import AppointmentDetails from './AppointmentDetails';

interface Appointment {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'task';
  with?: string;
  date: Date;
  time: string;
  duration: number;
  location?: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Policy Review',
    type: 'call',
    with: 'Sarah Thompson',
    date: new Date(),
    time: '10:30 AM',
    duration: 45,
    description: 'Annual policy review to discuss coverage options and potential adjustments.',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Initial Consultation',
    type: 'meeting',
    with: 'Michael Chen',
    date: addDays(new Date(), 1),
    time: '2:00 PM',
    duration: 60,
    location: 'Office - Conference Room A',
    description: 'First meeting to discuss insurance needs and coverage options.',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Quote Presentation',
    type: 'call',
    with: 'Emily Davis',
    date: addDays(new Date(), 2),
    time: '11:15 AM',
    duration: 30,
    description: 'Present and explain the prepared insurance quotes.',
    status: 'scheduled'
  },
  {
    id: '4',
    title: 'Follow up with David Wilson',
    type: 'task',
    date: addDays(new Date(), 3),
    time: '9:00 AM',
    duration: 15,
    description: 'Send follow-up email with additional information about policy options.',
    status: 'scheduled'
  },
  {
    id: '5',
    title: 'Policy Signing',
    type: 'meeting',
    with: 'Lisa Brown',
    date: addDays(new Date(), 4),
    time: '3:30 PM',
    duration: 45,
    location: 'Client Office',
    description: 'Meet to review and sign new policy documents.',
    status: 'scheduled'
  }
];

const typeIcons = {
  call: Phone,
  meeting: User,
  task: CheckCircle
};

const typeColors = {
  call: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  task: 'bg-green-100 text-green-600'
};

type CalendarViewType = 'day' | 'week' | 'month';

export default function CalendarView() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appointment.with && appointment.with.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || appointment.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const navigatePrevious = () => {
    if (viewType === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (viewType === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewType === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewType === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    setShowAddAppointment(false);
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    ));
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    setSelectedAppointment(null);
  };

  const renderDayView = () => {
    const dayAppointments = filteredAppointments.filter(appointment => 
      isSameDay(appointment.date, currentDate)
    ).sort((a, b) => {
      const timeA = a.time.includes('AM') ? 
        parseInt(a.time.split(':')[0]) : 
        parseInt(a.time.split(':')[0]) + 12;
      const timeB = b.time.includes('AM') ? 
        parseInt(b.time.split(':')[0]) : 
        parseInt(b.time.split(':')[0]) + 12;
      return timeA - timeB;
    });

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        <div className="p-6">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No appointments scheduled for this day
            </div>
          ) : (
            <div className="space-y-4">
              {dayAppointments.map((appointment) => {
                const TypeIcon = typeIcons[appointment.type];
                return (
                  <div 
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${typeColors[appointment.type]}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-lg font-medium text-gray-900">{appointment.title}</h4>
                        <span className="text-sm text-gray-500">{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      {appointment.with && (
                        <p className="text-sm text-gray-600 mt-1">With: {appointment.with}</p>
                      )}
                      {appointment.location && (
                        <p className="text-sm text-gray-600 mt-1">Location: {appointment.location}</p>
                      )}
                      {appointment.description && (
                        <p className="text-sm text-gray-500 mt-2">{appointment.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {format(startDate, 'MMMM d')} - {format(endDate, 'MMMM d, yyyy')}
          </h3>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-200">
          {days.map((day, i) => (
            <div key={i} className="p-2 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-sm font-medium text-gray-500">{format(day, 'EEE')}</p>
              <p className={`text-lg font-semibold ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[500px]">
          {days.map((day, dayIndex) => {
            const dayAppointments = filteredAppointments.filter(appointment => 
              isSameDay(appointment.date, day)
            );
            
            return (
              <div 
                key={dayIndex} 
                className={`border-r border-gray-200 last:border-r-0 p-2 ${
                  isToday(day) ? 'bg-blue-50' : ''
                }`}
              >
                {dayAppointments.length === 0 ? (
                  <div 
                    className="h-full min-h-[100px] flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg"
                    onClick={() => {
                      setCurrentDate(day);
                      setShowAddAppointment(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayAppointments.map((appointment) => {
                      const TypeIcon = typeIcons[appointment.type];
                      return (
                        <div 
                          key={appointment.id}
                          onClick={() => setSelectedAppointment(appointment)}
                          className={`p-2 rounded-lg ${typeColors[appointment.type].replace('text-', 'bg-').replace('100', '50')} hover:shadow-sm transition-shadow cursor-pointer text-xs`}
                        >
                          <div className="flex items-center">
                            <TypeIcon className={`h-3 w-3 mr-1 ${typeColors[appointment.type].replace('bg-', 'text-')}`} />
                            <span className="font-medium truncate">{appointment.title}</span>
                          </div>
                          <div className="mt-1 text-gray-600">{appointment.time}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    const startDate = startOfWeek(startOfMonthDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonthDate, { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="p-2 text-center">
              <p className="text-sm font-medium text-gray-500">{day}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const dayAppointments = filteredAppointments.filter(appointment => 
                  isSameDay(appointment.date, day)
                );
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`border-r border-gray-200 last:border-r-0 p-2 min-h-[100px] ${
                      !isCurrentMonth ? 'bg-gray-50' : isToday(day) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        !isCurrentMonth ? 'text-gray-400' : isToday(day) ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {isCurrentMonth && (
                        <button 
                          onClick={() => {
                            setCurrentDate(day);
                            setShowAddAppointment(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Plus className="h-3 w-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                    
                    {dayAppointments.length > 0 && (
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((appointment) => {
                          const TypeIcon = typeIcons[appointment.type];
                          return (
                            <div 
                              key={appointment.id}
                              onClick={() => setSelectedAppointment(appointment)}
                              className={`p-1 rounded ${typeColors[appointment.type].replace('text-', 'bg-').replace('100', '50')} hover:shadow-sm transition-shadow cursor-pointer text-xs`}
                            >
                              <div className="flex items-center">
                                <TypeIcon className={`h-2 w-2 mr-1 ${typeColors[appointment.type].replace('bg-', 'text-')}`} />
                                <span className="truncate">{appointment.title}</span>
                              </div>
                            </div>
                          );
                        })}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUpcomingAppointments = () => {
    const today = new Date();
    const upcomingAppointments = filteredAppointments
      .filter(appointment => appointment.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);

    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No upcoming appointments
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const TypeIcon = typeIcons[appointment.type];
                return (
                  <div 
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${typeColors[appointment.type]}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{appointment.title}</h4>
                        <span className="text-xs text-gray-500">{format(appointment.date, 'MMM d')}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      {appointment.with && (
                        <p className="text-xs text-gray-600 mt-1">With: {appointment.with}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
          <p className="text-sm text-gray-500">Manage your appointments, calls, and tasks</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddAppointment(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <button 
                  onClick={navigateToday}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Today
                </button>
                <div className="flex">
                  <button 
                    onClick={navigatePrevious}
                    className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <button 
                    onClick={navigateNext}
                    className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewType('day')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewType === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Day
                </button>
                <button 
                  onClick={() => setViewType('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewType === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewType('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewType === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
          
          {viewType === 'day' && renderDayView()}
          {viewType === 'week' && renderWeekView()}
          {viewType === 'month' && renderMonthView()}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="all"
                      checked={filterType === 'all'}
                      onChange={() => setFilterType('all')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Types</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="call"
                      checked={filterType === 'call'}
                      onChange={() => setFilterType('call')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Calls</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="meeting"
                      checked={filterType === 'meeting'}
                      onChange={() => setFilterType('meeting')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Meetings</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="task"
                      checked={filterType === 'task'}
                      onChange={() => setFilterType('task')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tasks</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {renderUpcomingAppointments()}
        </div>
      </div>

      {showAddAppointment && (
        <AppointmentForm
          onClose={() => setShowAddAppointment(false)}
          onAdd={handleAddAppointment}
          initialDate={currentDate}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
}