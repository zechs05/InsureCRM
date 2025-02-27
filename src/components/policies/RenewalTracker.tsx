import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Bell, Mail, Phone, FileText } from 'lucide-react';
import { format, addDays, isBefore, differenceInDays } from 'date-fns';
import type { Policy } from '../../types';

const mockRenewals = [
  {
    id: '1',
    policyNumber: 'POL-12345',
    clientName: 'Sarah Thompson',
    clientId: '101',
    policyType: 'Term Life',
    renewalDate: addDays(new Date(), 5),
    premium: 1250,
    newPremium: 1275,
    status: 'pending',
    notified: true,
    lastContactDate: addDays(new Date(), -3)
  },
  {
    id: '2',
    policyNumber: 'POL-23456',
    clientName: 'Michael Chen',
    clientId: '102',
    policyType: 'Auto',
    renewalDate: addDays(new Date(), 12),
    premium: 850,
    newPremium: 875,
    status: 'pending',
    notified: true,
    lastContactDate: addDays(new Date(), -5)
  },
  {
    id: '3',
    policyNumber: 'POL-34567',
    clientName: 'Emily Davis',
    clientId: '103',
    policyType: 'Home',
    renewalDate: addDays(new Date(), 18),
    premium: 1450,
    newPremium: 1450,
    status: 'pending',
    notified: false,
    lastContactDate: null
  },
  {
    id: '4',
    policyNumber: 'POL-45678',
    clientName: 'David Wilson',
    clientId: '104',
    policyType: 'Health',
    renewalDate: addDays(new Date(), 25),
    premium: 950,
    newPremium: 985,
    status: 'pending',
    notified: false,
    lastContactDate: null
  },
  {
    id: '5',
    policyNumber: 'POL-56789',
    clientName: 'Lisa Brown',
    clientId: '105',
    policyType: 'Auto',
    renewalDate: addDays(new Date(), -5),
    premium: 750,
    newPremium: 780,
    status: 'overdue',
    notified: true,
    lastContactDate: addDays(new Date(), -10)
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  renewed: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

export default function RenewalTracker() {
  const [renewals, setRenewals] = useState(mockRenewals);
  const [filter, setFilter] = useState('all');

  const filteredRenewals = renewals.filter(renewal => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return differenceInDays(renewal.renewalDate, new Date()) <= 7;
    if (filter === 'overdue') return isBefore(renewal.renewalDate, new Date());
    if (filter === 'notified') return renewal.notified;
    if (filter === 'not_notified') return !renewal.notified;
    return true;
  });

  const handleSendReminder = (renewalId: string) => {
    setRenewals(renewals.map(renewal => 
      renewal.id === renewalId 
        ? { ...renewal, notified: true, lastContactDate: new Date() } 
        : renewal
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap gap-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All Renewals
        </button>
        <button 
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Urgent (7 days)
        </button>
        <button 
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Overdue
        </button>
        <button 
          onClick={() => setFilter('notified')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'notified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Notified
        </button>
        <button 
          onClick={() => setFilter('not_notified')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'not_notified' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Not Notified
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Renewal Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRenewals.map((renewal) => (
              <tr key={renewal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{renewal.policyNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{renewal.clientName}</div>
                  <div className="text-sm text-gray-500">ID: {renewal.clientId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{renewal.policyType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{format(renewal.renewalDate, 'MMM d, yyyy')}</div>
                  <div className="text-sm text-gray-500">
                    {differenceInDays(renewal.renewalDate, new Date()) < 0 ? (
                      <span className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {Math.abs(differenceInDays(renewal.renewalDate, new Date()))} days overdue
                      </span>
                    ) : differenceInDays(renewal.renewalDate, new Date()) <= 7 ? (
                      <span className="flex items-center text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {differenceInDays(renewal.renewalDate, new Date())} days left
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {differenceInDays(renewal.renewalDate, new Date())} days left
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${renewal.premium} → ${renewal.newPremium}</div>
                  <div className="text-sm text-gray-500">
                    {renewal.newPremium > renewal.premium ? (
                      <span className="text-red-600">+${renewal.newPremium - renewal.premium}</span>
                    ) : renewal.newPremium < renewal.premium ? (
                      <span className="text-green-600">-${renewal.premium - renewal.newPremium}</span>
                    ) : (
                      <span className="text-gray-500">No change</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[renewal.status]}`}>
                    {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    {renewal.notified ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Notified
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <Bell className="h-4 w-4 mr-1" />
                        Not notified
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {renewal.lastContactDate ? format(renewal.lastContactDate, 'MMM d, yyyy') : 'Never'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!renewal.notified && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSendReminder(renewal.id)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </button>
                      <button className="flex items-center text-blue-600 hover:text-blue-900">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </button>
                    </div>
                  )}
                  <button className="mt-2 text-blue-600 hover:text-blue-900">Process</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}