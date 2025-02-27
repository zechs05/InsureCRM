import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const commissions = [
  {
    id: '1',
    policyType: 'Term Life',
    client: 'David Wilson',
    amount: 3250,
    date: '2024-03-15',
    status: 'paid'
  },
  {
    id: '2',
    policyType: 'Whole Life',
    client: 'Sarah Thompson',
    amount: 4800,
    date: '2024-03-12',
    status: 'paid'
  },
  {
    id: '3',
    policyType: 'Auto Insurance',
    client: 'Michael Chen',
    amount: 1200,
    date: '2024-03-20',
    status: 'pending'
  },
  {
    id: '4',
    policyType: 'Home Insurance',
    client: 'Emily Davis',
    amount: 3200,
    date: '2024-03-25',
    status: 'pending'
  }
];

export default function CommissionTracker() {
  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
    
  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Paid Commissions</p>
              <p className="text-xl font-semibold text-green-900 mt-1">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Commissions</p>
              <p className="text-xl font-semibold text-yellow-900 mt-1">${totalPending.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {commissions.map((commission) => (
          <div key={commission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{commission.client}</p>
              <p className="text-xs text-gray-500">{commission.policyType}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${commission.amount.toLocaleString()}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                commission.status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {commission.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">YTD Commissions</span>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900 mr-2">$48,250</span>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+12.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}