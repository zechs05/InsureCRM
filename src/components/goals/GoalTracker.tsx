import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, BarChart3, PieChart, Calendar, ChevronDown, Plus, Edit2, Save, X } from 'lucide-react';
import type { Goal } from '../../types';
import AddGoal from './AddGoal';
import GoalBreakdown from './GoalBreakdown';

const mockGoals: Goal[] = [
  {
    id: '1',
    type: 'revenue',
    target: 100000,
    current: 48250,
    period: 'monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  },
  {
    id: '2',
    type: 'leads',
    target: 100,
    current: 45,
    period: 'monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  },
  {
    id: '3',
    type: 'policies',
    target: 25,
    current: 12,
    period: 'monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  }
];

const goalIcons = {
  revenue: DollarSign,
  leads: Target,
  policies: TrendingUp
};

const goalColors = {
  revenue: 'bg-green-500',
  leads: 'bg-blue-500',
  policies: 'bg-purple-500'
};

const progressColors = {
  low: 'bg-red-500',
  medium: 'bg-yellow-500',
  high: 'bg-green-500'
};

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'breakdown'>('current');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleAddGoal = (newGoal: Goal) => {
    setGoals([...goals, newGoal]);
  };

  const toggleDetails = (goalId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 33) return progressColors.low;
    if (percentage < 66) return progressColors.medium;
    return progressColors.high;
  };

  const handleEditGoal = (goalId: string, currentValue: number) => {
    setEditingGoal(goalId);
    setEditValue(currentValue);
  };

  const handleSaveGoalProgress = (goalId: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, current: editValue } : goal
    );
    setGoals(updatedGoals);
    setEditingGoal(null);
  };

  const formatValue = (type: string, value: number) => {
    if (type === 'revenue') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toString();
  };

  const renderCurrentGoals = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const Icon = goalIcons[goal.type];
          const progress = getProgressPercentage(goal.current, goal.target);
          const color = goalColors[goal.type];
          const progressColor = getProgressColor(progress);
          
          return (
            <div 
              key={goal.id} 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="flex items-center mb-4">
                <div className={`${color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {goal.period} Goal
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Progress</span>
                  <span className="font-medium text-gray-900">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${progressColor} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Current</span>
                  {editingGoal === goal.id ? (
                    <div className="flex items-center">
                      {goal.type === 'revenue' && <span className="text-gray-500 mr-1">$</span>}
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveGoalProgress(goal.id);
                        }}
                        className="ml-2 p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGoal(null);
                        }}
                        className="ml-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{formatValue(goal.type, goal.current)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGoal(goal.id, goal.current);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Target</span>
                  <span className="font-medium text-gray-900">{formatValue(goal.type, goal.target)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(goal.id);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View Details
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails[goal.id] ? 'transform rotate-180' : ''}`} />
                </button>
                
                {showDetails[goal.id] && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Daily Average</span>
                        <span className="font-medium text-gray-900">
                          {formatValue(goal.type, Math.round(goal.current / 20))}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining</span>
                        <span className="font-medium text-gray-900">
                          {formatValue(goal.type, goal.target - goal.current)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Daily Goal</span>
                        <span className="font-medium text-gray-900">
                          {formatValue(goal.type, Math.round((goal.target - goal.current) / 10))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderHistoricalGoals = () => {
    // Mock historical data
    const historicalData = [
      { month: 'January', revenue: 92000, leads: 95, policies: 22 },
      { month: 'February', revenue: 88000, leads: 90, policies: 20 },
      { month: 'March', revenue: 48250, leads: 45, policies: 12 }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Goal History</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historicalData.map((month, index) => {
                  const revenuePercentage = (month.revenue / 100000) * 100;
                  const leadsPercentage = (month.leads / 100) * 100;
                  const policiesPercentage = (month.policies / 25) * 100;
                  const avgPercentage = (revenuePercentage + leadsPercentage + policiesPercentage) / 3;
                  
                  return (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">${month.revenue.toLocaleString()}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                            <div 
                              className={`h-2 ${getProgressColor(revenuePercentage)} rounded-full`}
                              style={{ width: `${revenuePercentage}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{Math.round(revenuePercentage)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{month.leads}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                            <div 
                              className={`h-2 ${getProgressColor(leadsPercentage)} rounded-full`}
                              style={{ width: `${leadsPercentage}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{Math.round(leadsPercentage)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{month.policies}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                            <div 
                              className={`h-2 ${getProgressColor(policiesPercentage)} rounded-full`}
                              style={{ width: `${policiesPercentage}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{Math.round(policiesPercentage)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white bg-gray-200">
                            <div 
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${getProgressColor(avgPercentage)}`}
                            >
                              {Math.round(avgPercentage)}%
                            </div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {avgPercentage >= 90 ? 'Excellent' : 
                             avgPercentage >= 75 ? 'Good' : 
                             avgPercentage >= 50 ? 'Average' : 'Needs Improvement'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Quarterly Performance</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-end h-64 space-x-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, i) => (
                  <div key={quarter} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full h-full flex items-end">
                      <div 
                        className={`w-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-300'} rounded-t`}
                        style={{ height: `${i === 0 ? 75 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {quarter}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-700">Current Year</span>
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
          <h2 className="text-xl font-semibold text-gray-900">Goal Tracker</h2>
          <p className="text-sm text-gray-500">Track your performance against targets</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'current' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Current Goals
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
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'breakdown' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Breakdown
            </button>
          </div>
          <button 
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Set New Goal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'current' && renderCurrentGoals()}
          {activeTab === 'history' && renderHistoricalGoals()}
          {activeTab === 'breakdown' && <GoalBreakdown goals={goals} />}
        </>
      )}

      {showAddGoal && (
        <AddGoal
          onClose={() => setShowAddGoal(false)}
          onAdd={handleAddGoal}
        />
      )}

      {selectedGoal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedGoal.type.charAt(0).toUpperCase() + selectedGoal.type.slice(1)} Goal Details
                </h3>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getProgressPercentage(selectedGoal.current, selectedGoal.target)}%
                    </span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-4 ${getProgressColor(getProgressPercentage(selectedGoal.current, selectedGoal.target))} rounded-full transition-all duration-500`}
                      style={{ width: `${getProgressPercentage(selectedGoal.current, selectedGoal.target)}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Current</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatValue(selectedGoal.type, selectedGoal.current)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Target</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatValue(selectedGoal.type, selectedGoal.target)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Period</span>
                  <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                    {selectedGoal.period}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedGoal.startDate).toLocaleDateString()} - {new Date(selectedGoal.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Remaining to Target</span>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatValue(selectedGoal.type, selectedGoal.target - selectedGoal.current)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Daily Goal to Reach Target</span>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatValue(selectedGoal.type, Math.round((selectedGoal.target - selectedGoal.current) / 10))}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on 10 working days remaining
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}