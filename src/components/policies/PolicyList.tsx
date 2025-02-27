import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, User, MoreVertical, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import type { Policy } from '../../types';

const mockPolicies: Policy[] = [
  {
    id: '1',
    policyNumber: 'POL-12345',
    clientId: '101',
    type: 'term_life',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2043-01-15',
    renewalDate: '2024-01-15',
    premium: 1250,
    paymentFrequency: 'monthly',
    coverageAmount: 500000,
    createdAt: '2023-01-10',
    updatedAt: '2023-01-10',
    assignedAgentId: 'agent1'
  },
  {
    id: '2',
    policyNumber: 'POL-23456',
    clientId: '102',
    type: 'auto',
    status: 'active',
    startDate: '2023-03-20',
    endDate: '2024-03-20',
    renewalDate: '2024-03-20',
    premium: 850,
    paymentFrequency: 'semi_annual',
    coverageAmount: 100000,
    deductible: 500,
    createdAt: '2023-03-15',
    updatedAt: '2023-03-15',
    assignedAgentId: 'agent1'
  },
  {
    id: '3',
    policyNumber: 'POL-34567',
    clientId: '103',
    type: 'home',
    status: 'active',
    startDate: '2023-02-10',
    endDate: '2024-02-10',
    renewalDate: '2024-02-10',
    premium: 1450,
    paymentFrequency: 'annual',
    coverageAmount: 350000,
    deductible: 1000,
    createdAt: '2023-02-05',
    updatedAt: '2023-02-05',
    assignedAgentId: 'agent2'
  },
  {
    id: '4',
    policyNumber: 'POL-45678',
    clientId: '104',
    type: 'whole_life',
    status: 'pending',
    startDate: '2023-04-01',
    endDate: '2073-04-01',
    renewalDate: '2024-04-01',
    premium: 2100,
    paymentFrequency: 'monthly',
    coverageAmount: 750000,
    createdAt: '2023-03-25',
    updatedAt: '2023-03-25',
    assignedAgentId: 'agent1'
  },
  {
    id: '5',
    policyNumber: 'POL-56789',
    clientId: '105',
    type: 'health',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    renewalDate: '2024-01-01',
    premium: 950,
    paymentFrequency: 'monthly',
    coverageAmount: 1000000,
    deductible: 2500,
    createdAt: '2022-12-15',
    updatedAt: '2022-12-15',
    assignedAgentId: 'agent3'
  }
];

const clientNames = {
  '101': 'Sarah Thompson',
  '102': 'Michael Chen',
  '103': 'Emily Davis',
  '104': 'David Wilson',
  '105': 'Lisa Brown'
};

const policyTypeLabels = {
  term_life: 'Term Life',
  whole_life: 'Whole Life',
  universal_life: 'Universal Life',
  auto: 'Auto Insurance',
  home: 'Home Insurance',
  health: 'Health Insurance',
  disability: 'Disability Insurance',
  other: 'Other'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
  lapsed: 'bg-purple-100 text-purple-800'
};

export default function PolicyList() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  return (
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
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Premium
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coverage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Renewal
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{policy.policyNumber}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(policy.startDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{clientNames[policy.clientId]}</div>
                <div className="text-sm text-gray-500">ID: {policy.clientId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{policyTypeLabels[policy.type]}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[policy.status]}`}>
                  {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${policy.premium}/mo</div>
                <div className="text-sm text-gray-500">{policy.paymentFrequency}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${policy.coverageAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{format(new Date(policy.renewalDate), 'MMM d, yyyy')}</div>
                <div className="text-sm text-gray-500">
                  {new Date(policy.renewalDate) < addMonths(new Date(), 1) ? (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Soon
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Good
                    </span>
                  )}
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