import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ChevronDown, BarChart3, PieChart, Edit2, Save, X, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { supabase } from '../../lib/supabase';
import AddCommissionSale from './AddCommissionSale';

interface CommissionPeriod {
  id: string;
  period: 'weekly' | 'monthly' | 'yearly';
  target: number;
  current: number;
  startDate: string;
  endDate: string;
}

interface CommissionEntry {
  id: string;
  policyId: string;
  policyType: string;
  clientName: string;
  annualPremium: number;
  baseCommission: number;
  bonusPercentage: number;
  totalCommission: number;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

const mockCommissionPeriods: CommissionPeriod[] = [
  {
    id: '1',
    period: 'weekly',
    target: 5000,
    current: 3250,
    startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd')
  },
  {
    id: '2',
    period: 'monthly',
    target: 20000,
    current: 12500,
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  },
  {
    id: '3',
    period: 'yearly',
    target: 250000,
    current: 145000,
    startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfYear(new Date()), 'yyyy-MM-dd')
  }
];

// Calculate commission based on annual premium
export const calculateCommission = (annualPremium: number, bonusPercentage: number = 125) => {
  const baseCommission = annualPremium * 0.5; // 50% of annual premium
  const bonusMultiplier = bonusPercentage / 100;
  const totalCommission = baseCommission * bonusMultiplier;
  
  return {
    baseCommission,
    totalCommission
  };
};

// Mock commission entries with calculated values
const mockCommissionEntries: CommissionEntry[] = [
  {
    id: '1',
    policyId: 'POL-12345',
    policyType: 'Term Life',
    clientName: 'Sarah Thompson',
    annualPremium: 1200,
    baseCommission: 600,
    bonusPercentage: 125,
    totalCommission: 750,
    date: '2024-03-15',
    status: 'paid'
  },
  {
    id: '2',
    policyId: 'POL-23456',
    policyType: 'Auto Insurance',
    clientName: 'Michael Chen',
    annualPremium: 1800,
    baseCommission: 900,
    bonusPercentage: 125,
    totalCommission: 1125,
    date: '2024-03-18',
    status: 'paid'
  },
  {
    id: '3',
    policyId: 'POL-34567',
    policyType: 'Home Insurance',
    clientName: 'Emily Davis',
    annualPremium: 2400,
    baseCommission: 1200,
    bonusPercentage: 125,
    totalCommission: 1500,
    date: '2024-03-20',
    status: 'pending'
  },
  {
    id: '4',
    policyId: 'POL-45678',
    policyType: 'Whole Life',
    clientName: 'David Wilson',
    annualPremium: 3600,
    baseCommission: 1800,
    bonusPercentage: 125,
    totalCommission: 2250,
    date: '2024-03-22',
    status: 'pending'
  },
  {
    id: '5',
    policyId: 'POL-56789',
    policyType: 'Health Insurance',
    clientName: 'Lisa Brown',
    annualPremium: 2000,
    baseCommission: 1000,
    bonusPercentage: 125,
    totalCommission: 1250,
    date: '2024-03-10',
    status: 'paid'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function CommissionTracker() {
  const [commissionPeriods, setCommissionPeriods] = useState<CommissionPeriod[]>(mockCommissionPeriods);
  const [commissionEntries, setCommissionEntries] = useState<CommissionEntry[]>(mockCommissionEntries);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'projections' | 'settings'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [defaultBonusPercentage, setDefaultBonusPercentage] = useState(125);
  const [isEditingBonus, setIsEditingBonus] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editBonusValue, setEditBonusValue] = useState<number>(125);
  const [showAddSale, setShowAddSale] = useState(false);

  // In a real app, this would fetch data from the API
  useEffect(() => {
    const fetchCommissionData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching commission data:', error);
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, [selectedPeriod]);

  const toggleDetails = (periodId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [periodId]: !prev[periodId]
    }));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 50) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveDefaultBonus = () => {
    setDefaultBonusPercentage(editBonusValue);
    setIsEditingBonus(false);
    
    // Update all entries that have the default bonus percentage
    const updatedEntries = commissionEntries.map(entry => {
      if (entry.bonusPercentage === 125) { // Only update entries with the old default
        const { totalCommission } = calculateCommission(entry.annualPremium, editBonusValue);
        return {
          ...entry,
          bonusPercentage: editBonusValue,
          totalCommission
        };
      }
      return entry;
    });
    
    setCommissionEntries(updatedEntries);
  };

  const handleEditEntryBonus = (entryId: string, newBonusPercentage: number) => {
    const updatedEntries = commissionEntries.map(entry => {
      if (entry.id === entryId) {
        const { totalCommission } = calculateCommission(entry.annualPremium, newBonusPercentage);
        return {
          ...entry,
          bonusPercentage: newBonusPercentage,
          totalCommission
        };
      }
      return entry;
    });
    
    setCommissionEntries(updatedEntries);
    setEditingEntryId(null);
  };

  const handleAddCommissionSale = (newSale: CommissionEntry) => {
    setCommissionEntries([newSale, ...commissionEntries]);
    
    // Update period totals
    const updatedPeriods = commissionPeriods.map(period => {
      const saleDate = new Date(newSale.date);
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);
      
      if (saleDate >= periodStart && saleDate <= periodEnd && newSale.status !== 'cancelled') {
        return {
          ...period,
          current: period.current + newSale.totalCommission
        };
      }
      return period;
    });
    
    setCommissionPeriods(updatedPeriods);
  };

  const selectedPeriodData = commissionPeriods.find(period => period.period === selectedPeriod);

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commissionPeriods.map((period) => {
            const percentage = getProgressPercentage(period.current, period.target);
            const progressColor = getProgressColor(percentage);
            const statusIcon = getStatusIcon(percentage);
            
            return (
              <div 
                key={period.id} 
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                  period.period === selectedPeriod ? 'border-blue-500' : 'border-transparent'
                } cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => setSelectedPeriod(period.period)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 capitalize">{period.period} Commission</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(period.startDate), 'MMM d')} - {format(new Date(period.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {statusIcon}
                    <span className="ml-1 text-sm font-medium">{percentage}%</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{formatCurrency(period.current)} / {formatCurrency(period.target)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 ${progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {formatCurrency(period.target - period.current)} remaining
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDetails(period.id);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    Details
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails[period.id] ? 'transform rotate-180' : ''}`} />
                  </button>
                </div>
                
                {showDetails[period.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Policies Sold</p>
                        <p className="text-sm font-semibold text-gray-900">12</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg. Commission</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(period.current / 12)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Highest Commission</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(2250)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pending Commissions</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(3750)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 capitalize">{selectedPeriod} Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Commission by Policy Type</h4>
                <div className="space-y-4">
                  {[
                    { type: 'Term Life', value: 35, amount: 4375, color: 'bg-blue-500' },
                    { type: 'Whole Life', value: 25, amount: 3125, color: 'bg-green-500' },
                    { type: 'Auto', value: 20, amount: 2500, color: 'bg-purple-500' },
                    { type: 'Home', value: 15, amount: 1875, color: 'bg-yellow-500' },
                    { type: 'Health', value: 5, amount: 625, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.type}</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">{formatCurrency(item.amount)}</span>
                          <span className="text-xs text-gray-500">{item.value}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 ${item.color} rounded-full`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Commission Trend</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 h-64 flex items-end space-x-2">
                  {[65, 48, 72, 85, 60, 75, 90, 82, 95, 78, 88, 92].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-500"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center text-xs text-gray-500">
                  {selectedPeriod === 'weekly' ? 'Days' : selectedPeriod === 'monthly' ? 'Weeks' : 'Months'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Commission History</h3>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500 mr-2">Default Bonus Percentage:</span>
                {isEditingBonus ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={editBonusValue}
                      onChange={(e) => setEditBonusValue(Number(e.target.value))}
                      min="100"
                      max="200"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="ml-1 text-sm text-gray-500">%</span>
                    <button
                      onClick={handleSaveDefaultBonus}
                      className="ml-2 p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingBonus(false);
                        setEditBonusValue(defaultBonusPercentage);
                      }}
                      className="ml-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{defaultBonusPercentage}%</span>
                    <button
                      onClick={() => {
                        setIsEditingBonus(true);
                        setEditBonusValue(defaultBonusPercentage);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddSale(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Sale
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
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
                  Annual Premium
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Commission
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus %
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Commission
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissionEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.policyId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.policyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(entry.annualPremium)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(entry.baseCommission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingEntryId === entry.id ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={editBonusValue}
                          onChange={(e) => setEditBonusValue(Number(e.target.value))}
                          min="100"
                          max="200"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <span className="ml-1 text-sm text-gray-500">%</span>
                        <button
                          onClick={() => handleEditEntryBonus(entry.id, editBonusValue)}
                          className="ml-2 p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingEntryId(null);
                            setEditBonusValue(defaultBonusPercentage);
                          }}
                          className="ml-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>{entry.bonusPercentage}%</span>
                        <button
                          onClick={() => {
                            setEditingEntryId(entry.id);
                            setEditBonusValue(entry.bonusPercentage);
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(entry.totalCommission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[entry.status]}`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <button className="hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderProjections = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Commission Projections</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Projected Annual Income</h4>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Based on current performance</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(225000)}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-700">Current Pace</span>
                      <span className="font-medium text-blue-900">90%</span>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: '90%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-700">Annual Target</span>
                      <span className="font-medium text-blue-900">{formatCurrency(250000)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Growth Opportunities</h4>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">Potential Additional Revenue</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(75000)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cross-selling to existing clients</p>
                      <p className="text-xs text-gray-500">25 opportunities identified</p>
                    </div>
                    <p className="text-sm font-medium text-green-600">{formatCurrency(35000)}</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Policy upgrades</p>
                      <p className="text-xs text-gray-500">18 policies eligible</p>
                    </div>
                    <p className="text-sm font-medium text-green-600">{formatCurrency(22000)}</p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Referral opportunities</p>
                      <p className="text-xs text-gray-500">15 potential referrals</p>
                    </div>
                    <p className="text-sm font-medium text-green-600">{formatCurrency(18000)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Projection</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-end h-64 space-x-2">
                {[
                  { month: 'Jan', actual: 18500, projected: 18500 },
                  { month: 'Feb', actual: 19200, projected: 19200 },
                  { month: 'Mar', actual: 20500, projected: 20500 },
                  { month: 'Apr', actual: 0, projected: 21000 },
                  { month: 'May', actual: 0, projected: 21500 },
                  { month: 'Jun', actual: 0, projected: 22000 },
                  { month: 'Jul', actual: 0, projected: 22500 },
                  { month: 'Aug', actual: 0, projected: 23000 },
                  { month: 'Sep', actual: 0, projected: 23500 },
                  { month: 'Oct', actual: 0, projected: 24000 },
                  { month: 'Nov', actual: 0, projected: 24500 },
                  { month: 'Dec', actual: 0, projected: 25000 }
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full h-full flex items-end">
                      {data.actual > 0 && (
                        <div 
                          className="w-full bg-blue-500 rounded-t z-10"
                          style={{ height: `${(data.actual / 25000) * 100}%` }}
                        />
                      )}
                      <div 
                        className={`w-full ${data.actual > 0 ? 'bg-gray-300' : 'bg-blue-300'} rounded-t absolute`}
                        style={{ height: `${(data.projected / 25000) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-700">Actual</span> </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-700">Projected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Commission Settings</h3>
        </div>
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Default Commission Structure</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Base Commission Rate:</span>
                  <span className="text-sm font-medium text-gray-900">50% of Annual Premium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Default Bonus Percentage:</span>
                  {isEditingBonus ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editBonusValue}
                        onChange={(e) => setEditBonusValue(Number(e.target.value))}
                        min="100"
                        max="200"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                      <span className="ml-1 text-sm text-gray-500">%</span>
                      <button
                        onClick={handleSaveDefaultBonus}
                        className="ml-2 p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingBonus(false);
                          setEditBonusValue(defaultBonusPercentage);
                        }}
                        className="ml-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{defaultBonusPercentage}%</span>
                      <button
                        onClick={() => {
                          setIsEditingBonus(true);
                          setEditBonusValue(defaultBonusPercentage);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Commission Example</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Annual Premium:</span>
                    <span className="text-sm font-medium text-blue-900">$600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Base Commission (50%):</span>
                    <span className="text-sm font-medium text-blue-900">$300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Bonus ({defaultBonusPercentage}%):</span>
                    <span className="text-sm font-medium text-blue-900">${300 * (defaultBonusPercentage / 100)}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Total Commission:</span>
                      <span className="text-sm font-bold text-blue-900">${300 * (defaultBonusPercentage / 100)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Commission Formula</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">The commission is calculated using the following formula:</p>
                <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm">
                  <p>Base Commission = Annual Premium × 0.5</p>
                  <p>Total Commission = Base Commission × (Bonus% ÷ 100)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Commission Tracker</h2>
          <p className="text-sm text-gray-500">Track your earnings and performance</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'overview' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'history' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('projections')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'projections' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Projections
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'settings' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'projections' && renderProjections()}
          {activeTab === 'settings' && renderSettings()}
        </>
      )}

      {showAddSale && (
        <AddCommissionSale
          onClose={() => setShowAddSale(false)}
          onAdd={handleAddCommissionSale}
          defaultBonusPercentage={defaultBonusPercentage}
        />
      )}
    </div>
  );
}