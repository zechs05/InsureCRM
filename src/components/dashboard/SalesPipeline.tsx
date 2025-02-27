import React from 'react';
import { DollarSign } from 'lucide-react';

const pipelineStages = [
  { 
    name: 'New Leads', 
    count: 45, 
    value: 22500, 
    color: 'bg-blue-500',
    percentage: 18
  },
  { 
    name: 'Contacted', 
    count: 32, 
    value: 16000, 
    color: 'bg-indigo-500',
    percentage: 13
  },
  { 
    name: 'Qualified', 
    count: 28, 
    value: 42000, 
    color: 'bg-purple-500',
    percentage: 33
  },
  { 
    name: 'Proposal', 
    count: 15, 
    value: 30000, 
    color: 'bg-pink-500',
    percentage: 24
  },
  { 
    name: 'Closing', 
    count: 8, 
    value: 15250, 
    color: 'bg-red-500',
    percentage: 12
  }
];

export default function SalesPipeline() {
  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  
  return (
    <div className="p-4">
      <div className="flex h-8 mb-6 rounded-lg overflow-hidden">
        {pipelineStages.map((stage) => (
          <div 
            key={stage.name}
            className={`${stage.color} h-full`}
            style={{ width: `${stage.percentage}%` }}
            title={`${stage.name}: $${stage.value.toLocaleString()}`}
          />
        ))}
      </div>
      
      <div className="space-y-4">
        {pipelineStages.map((stage) => (
          <div key={stage.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <span className="ml-2 text-sm font-medium text-gray-700">{stage.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{stage.count} leads</span>
              <div className="flex items-center text-sm font-medium text-gray-900">
                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                {stage.value.toLocaleString()}
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((stage.value / totalValue) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Total Pipeline Value</span>
          <span className="text-lg font-semibold text-gray-900">${totalValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}