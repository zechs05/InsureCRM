import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, MoreVertical, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Client } from '../../types';

const mockClients: Client[] = [
  {
    id: '101',
    name: 'Sarah Thompson',
    email: 'sarah.t@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    dateOfBirth: '1985-06-15',
    gender: 'female',
    occupation: 'Software Engineer',
    income: 120000,
    maritalStatus: 'married',
    dependents: 2,
    notes: 'Interested in increasing life insurance coverage for family protection.',
    createdAt: '2023-01-10',
    updatedAt: '2023-01-10',
    assignedAgentId: 'agent1'
  },
  {
    id: '102',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'NY',
    zipCode: '10001',
    dateOfBirth: '1978-11-23',
    gender: 'male',
    occupation: 'Doctor',
    income: 250000,
    maritalStatus: 'married',
    dependents: 3,
    notes: 'Looking for comprehensive coverage for family and assets.',
    createdAt: '2023-02-15',
    updatedAt: '2023-02-15',
    assignedAgentId: 'agent2'
  },
  {
    id: '103',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine St',
    city: 'Elsewhere',
    state: 'TX',
    zipCode: '75001',
    dateOfBirth: '1990-03-08',
    gender: 'female',
    occupation: 'Marketing Manager',
    income: 95000,
    maritalStatus: 'single',
    dependents: 0,
    notes: 'First-time homeowner looking for home insurance.',
    createdAt: '2023-03-05',
    updatedAt: '2023-03-05',
    assignedAgentId: 'agent1'
  },
  {
    id: '104',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '(555) 789-0123',
    address: '321 Elm St',
    city: 'Nowhere',
    state: 'FL',
    zipCode: '33101',
    dateOfBirth: '1965-09-12',
    gender: 'male',
    occupation: 'Business Owner',
    income: 180000,
    maritalStatus: 'divorced',
    dependents: 2,
    notes: 'Interested in retirement planning and life insurance.',
    createdAt: '2023-04-02',
    updatedAt: '2023-04-02',
    assignedAgentId: 'agent3'
  },
  {
    id: '105',
    name: 'Lisa Brown',
    email: 'lisa.b@example.com',
    phone: '(555) 234-5678',
    address: '567 Maple Dr',
    city: 'Anyplace',
    state: 'IL',
    zipCode: '60601',
    dateOfBirth: '1982-07-30',
    gender: 'female',
    occupation: 'Teacher',
    income: 75000,
    maritalStatus: 'married',
    dependents: 1,
    notes: 'Looking for affordable auto and home insurance bundle.',
    createdAt: '2023-03-18',
    updatedAt: '2023-03-18',
    assignedAgentId: 'agent2'
  }
];

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Demographics
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Policies
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">
                      Client since {format(new Date(client.createdAt), 'MMM yyyy')}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {client.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {client.city}, {client.state}
                </div>
                <div className="text-sm text-gray-500 ml-6">
                  {client.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {format(new Date(client.dateOfBirth), 'MMM d, yyyy')}
                  </div>
                  <div className="mt-1">
                    {client.occupation && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {client.occupation}
                      </span>
                    )}
                    {client.maritalStatus && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {client.maritalStatus.charAt(0).toUpperCase() + client.maritalStatus.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  {client.id === '101' ? '2 Active' : client.id === '102' ? '3 Active' : '1 Active'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {client.id === '101' ? 'Life, Auto' : client.id === '102' ? 'Life, Home, Auto' : client.id === '103' ? 'Home' : client.id === '104' ? 'Life' : 'Auto'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900">View</button>
                <button className="ml-4 text-blue-600 hover:text-blue-900">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}