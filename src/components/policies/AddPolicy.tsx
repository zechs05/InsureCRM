import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Calendar, DollarSign, Plus } from 'lucide-react';
import { format, addYears } from 'date-fns';
import type { Policy } from '../../types';

interface AddPolicyProps {
  onClose: () => void;
  onAdd: (policy: Policy) => void;
}

interface FormData {
  clientId: string;
  type: string;
  policyNumber: string;
  status: string;
  startDate: string;
  endDate: string;
  premium: number;
  paymentFrequency: string;
  coverageAmount: number;
  deductible?: number;
  notes?: string;
}

const policyTypes = [
  { value: 'term_life', label: 'Term Life Insurance' },
  { value: 'whole_life', label: 'Whole Life Insurance' },
  { value: 'universal_life', label: 'Universal Life Insurance' },
  { value: 'auto', label: 'Auto Insurance' },
  { value: 'home', label: 'Home Insurance' },
  { value: 'health', label: 'Health Insurance' },
  { value: 'disability', label: 'Disability Insurance' },
  { value: 'other', label: 'Other' }
];

const paymentFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annual', label: 'Semi-Annual' },
  { value: 'annual', label: 'Annual' }
];

const clients = [
  { id: '101', name: 'Sarah Thompson' },
  { id: '102', name: 'Michael Chen' },
  { id: '103', name: 'Emily Davis' },
  { id: '104', name: 'David Wilson' },
  { id: '105', name: 'Lisa Brown' }
];

export default function AddPolicy({ onClose, onAdd }: AddPolicyProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      status: 'active',
      paymentFrequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const selectedType = watch('type');

  const getDefaultEndDate = () => {
    if (selectedType === 'term_life') {
      return format(addYears(new Date(), 20), 'yyyy-MM-dd');
    } else if (selectedType === 'whole_life' || selectedType === 'universal_life') {
      return format(addYears(new Date(), 50), 'yyyy-MM-dd');
    } else {
      return format(addYears(new Date(), 1), 'yyyy-MM-dd');
    }
  };

  const generatePolicyNumber = () => {
    const prefix = 'POL';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum}`;
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const newPolicy: Policy = {
        id: `policy-${Date.now()}`,
        policyNumber: data.policyNumber || generatePolicyNumber(),
        clientId: data.clientId,
        type: data.type as any,
        status: data.status as any,
        startDate: data.startDate,
        endDate: data.endDate,
        renewalDate: data.startDate, // In a real app, calculate based on payment frequency
        premium: data.premium,
        paymentFrequency: data.paymentFrequency as any,
        coverageAmount: data.coverageAmount,
        deductible: data.deductible,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedAgentId: 'agent1' // Default to current agent
      };
      
      // In a real app, this would be an API call
      setTimeout(() => {
        onAdd(newPolicy);
        onClose();
        setSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error adding policy:', error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Add New Policy</h3>
              <p className="text-sm text-gray-500">Create a new insurance policy</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    {...register('clientId', { required: 'Client is required' })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  {...register('policyNumber')}
                  placeholder={generatePolicyNumber()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Leave blank to auto-generate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Type
                </label>
                <select
                  {...register('type', { required: 'Policy type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select policy type</option>
                  {policyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="lapsed">Lapsed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  {...register('paymentFrequency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {paymentFrequencies.map(frequency => (
                    <option key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </option>
                  ))}
                </select>
                {errors.paymentFrequency && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentFrequency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('startDate', { required: 'Start date is required' })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    {...register('endDate', { required: 'End date is required' })}
                    defaultValue={getDefaultEndDate()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('premium', { 
                      required: 'Premium is required',
                      min: { value: 1, message: 'Premium must be greater than 0' }
                    })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.premium && (
                  <p className="mt-1 text-sm text-red-600">{errors.premium.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coverage Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('coverageAmount', { 
                      required: 'Coverage amount is required',
                      min: { value: 1000, message: 'Coverage must be at least 1,000' }
                    })}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.coverageAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverageAmount.message}</p>
                )}
              </div>
            </div>

            {(selectedType === 'auto' || selectedType === 'home' || selectedType === 'health') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deductible
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('deductible')}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional information about this policy..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              {saving ? 'Adding...' : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}