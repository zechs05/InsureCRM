import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, DollarSign, Plus, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { calculateCommission } from './CommissionTracker';

interface AddCommissionSaleProps {
  onClose: () => void;
  onAdd: (sale: any) => void;
  defaultBonusPercentage: number;
}

interface FormData {
  policyId: string;
  policyType: string;
  clientName: string;
  annualPremium: number;
  bonusPercentage: number;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

const policyTypes = [
  'Term Life',
  'Whole Life',
  'Universal Life',
  'Auto Insurance',
  'Home Insurance',
  'Health Insurance',
  'Disability Insurance',
  'Other'
];

export default function AddCommissionSale({ onClose, onAdd, defaultBonusPercentage }: AddCommissionSaleProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      policyType: 'Term Life',
      bonusPercentage: defaultBonusPercentage,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending'
    }
  });

  const annualPremium = watch('annualPremium') || 0;
  const bonusPercentage = watch('bonusPercentage') || defaultBonusPercentage;

  // Calculate commission values
  const { baseCommission, totalCommission } = calculateCommission(annualPremium, bonusPercentage);

  const generatePolicyId = () => {
    const prefix = 'POL';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum}`;
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const { baseCommission, totalCommission } = calculateCommission(data.annualPremium, data.bonusPercentage);
      
      const newSale = {
        id: `sale-${Date.now()}`,
        policyId: data.policyId || generatePolicyId(),
        policyType: data.policyType,
        clientName: data.clientName,
        annualPremium: data.annualPremium,
        baseCommission,
        bonusPercentage: data.bonusPercentage,
        totalCommission,
        date: data.date,
        status: data.status
      };
      
      // In a real app, this would be an API call
      setTimeout(() => {
        onAdd(newSale);
        setSaving(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error adding commission sale:', error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Add Commission Sale</h3>
              <p className="text-sm text-gray-500">Record a new policy sale and commission</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy ID
                </label>
                <input
                  type="text"
                  {...register('policyId')}
                  placeholder={generatePolicyId()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Leave blank to auto-generate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Type
                </label>
                <select
                  {...register('policyType', { required: 'Policy type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {policyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.policyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.policyType.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                {...register('clientName', { required: 'Client name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Premium
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('annualPremium', { 
                      required: 'Annual premium is required',
                      min: { value: 1, message: 'Premium must be greater than 0' }
                    })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {errors.annualPremium && (
                  <p className="mt-1 text-sm text-red-600">{errors.annualPremium.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('bonusPercentage', { 
                      required: 'Bonus percentage is required',
                      min: { value: 100, message: 'Minimum 100%' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="125"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                {errors.bonusPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.bonusPercentage.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Commission Calculation Preview */}
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Commission Calculation
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Annual Premium:</span>
                  <span className="text-sm font-medium text-blue-900">${annualPremium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Base Commission (50%):</span>
                  <span className="text-sm font-medium text-blue-900">${baseCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Bonus ({bonusPercentage}%):</span>
                  <span className="text-sm font-medium text-blue-900">${totalCommission.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Total Commission:</span>
                    <span className="text-sm font-bold text-blue-900">${totalCommission.toLocaleString()}</span>
                  </div>
                </div>
              </div>
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
              {saving ? 'Adding...' : 'Add Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}