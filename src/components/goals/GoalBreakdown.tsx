import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import type { Goal } from '../../types';

interface GoalBreakdownProps {
  goals: Goal[];
}

export default function GoalBreakdown({ goals }: GoalBreakdownProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedType, setSelectedType] = useState<'revenue' | 'leads' | 'policies'>('revenue');
  
  const revenueGoal = goals.find(goal => goal.type === 'revenue') || goals[0];
  const leadsGoal = goals.find(goal => goal.type === 'leads') || goals[0];
  const policiesGoal = goals.find(goal => goal.type === 'policies') || goals[0];
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 33) return 'bg-red-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
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
  
  const renderGoalComparison = () => {
    const goalData = [
      { 
        name: 'Revenue', 
        type: 'revenue',
        current: revenueGoal.current, 
        target: revenueGoal.target,
        icon: DollarSign,
        color: 'bg-green-500',
        format: (val: number) => `$${val.toLocaleString()}`
      },
      { 
        name: 'Leads', 
        type: 'leads',
        current: leadsGoal.current, 
        target: leadsGoal.target,
        icon: TrendingUp,
        color: 'bg-blue-500',
        format: (val: number) => val.toString()
      },
      { 
        name: 'Policies', 
        type: 'policies',
        current: policiesGoal.current, 
        target: policiesGoal.target,
        icon: Calendar,
        color: 'bg-purple-500',
        format: (val: number) => val.toString()
      }
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goalData.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const progressColor = getProgressColor(progress);
          
          return (
            <div 
              key={goal.name} 
              className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer ${
                selectedType === goal.type ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedType(goal.type as any)}
            >
              <div className="flex items-center mb-4">
                <div className={`${goal.color} p-3 rounded-lg`}>
                  <goal.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedPeriod} Goal</p>
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
                  <span className="font-medium text-gray-900">{goal.format(goal.current)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Target</span>
                  <span className="font-medium text-gray-900">{goal.format(goal.target)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderTrendAnalysis = () => {
    // Mock data for trend analysis
    const trendData = {
      revenue: [42000, 45000, 48250, 52000, 56000, 60000],
      leads: [35, 38, 45, 48, 52, 58],
      policies: [8, 10, 12, 14, 15, 18]
    };
    
    const selectedData = trendData[selectedType];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const getYAxisLabels = () => {
      if (selectedType === 'revenue') {
        const max = Math.max(...selectedData);
        return [
          `$${Math.round(max * 0.2).toLocaleString()}`,
          `$${Math.round(max * 0.4).toLocaleString()}`,
          `$${Math.round(max * 0.6).toLocaleString()}`,
          `$${Math.round(max * 0.8).toLocaleString()}`,
          `$${Math.round(max).toLocaleString()}`
        ];
      } else {
        const max = Math.max(...selectedData);
        return [
          Math.round(max * 0.2).toString(),
          Math.round(max * 0.4).toString(),
          Math.round(max * 0.6).toString(),
          Math.round(max * 0.8).toString(),
          max.toString()
        ];
      }
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Trend Analysis
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'weekly' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'monthly' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSelectedPeriod('yearly')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedPeriod === 'yearly' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex flex-col justify-between pr-2">
            {getYAxisLabels().reverse().map((label, i) => (
              <div key={i} className="text-xs text-gray-500 h-8 flex items-center">
                {label}
              </div>
            ))}
          </div>
          
          <div className="flex-1">
            <div className="relative h-40 flex items-end">
              {selectedData.map((value, i) => {
                const maxValue = Math.max(...selectedData);
                const height = (value / maxValue) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-4/5 ${i === 2 ? 'bg-blue-600' : 'bg-blue-400'} rounded-t transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
              
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="absolute w-full border-t border-gray-200"
                  style={{ bottom: `${i * 20}%` }}
                />
              ))}
            </div>
            
            <div className="flex mt-2">
              {months.map((month, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-xs text-gray-500">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Insights</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span>
                {selectedType === 'revenue' 
                  ? 'Revenue is trending upward by 8.5% month-over-month' 
                  : selectedType === 'leads'
                    ? 'Lead generation has increased by 12.3% since last month'
                    : 'Policy sales are growing steadily at 10% per month'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
              <span>
                {selectedType === 'revenue' 
                  ? 'Current monthly average: $50,208' 
                  : selectedType === 'leads'
                    ? 'Current monthly average: 46 leads'
                    : 'Current monthly average: 13 policies'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGoalDistribution = () => {
    // Mock data for goal distribution
    const distributionData = {
      revenue: [
        { category: 'Term Life', percentage: 35, value: 35000 },
        { category: 'Whole Life', percentage: 25, value: 25000 },
        { category: 'Auto', percentage: 20, value: 20000 },
        { category: 'Home', percentage: 15, value: 15000 },
        { category: 'Other', percentage: 5, value: 5000 }
      ],
      leads: [
        { category: 'Website', percentage: 40, value: 40 },
        { category: 'Referrals', percentage: 30, value: 30 },
        { category: 'Social Media', percentage: 20, value: 20 },
        { category: 'Other', percentage: 10, value: 10 }
      ],
      policies: [
        { category: 'Term Life', percentage: 45, value: 11 },
        { category: 'Whole Life', percentage: 25, value: 6 },
        { category: 'Auto', percentage: 20, value: 5 },
        { category: 'Home', percentage: 10, value: 3 }
      ]
    };
    
    const selectedDistribution = distributionData[selectedType];
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="relative w-full h-48">
              <PieChart className="absolute inset-0 w-full h-full text-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedType === 'revenue' 
                      ? '$100k' 
                      : selectedType === 'leads'
                        ? '100'
                        : '25'}
                  </p>
                  <p className="text-sm text-gray-500">Total Goal</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedDistribution.map((item, i) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
              
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {selectedType === 'revenue' 
                          ? `$${item.value.toLocaleString()}` 
                          : item.value.toString()}
                      </span>
                      <span className="text-xs text-gray-500">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 ${colors[i % colors.length]} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderGoalComparison()}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTrendAnalysis()}
        {renderGoalDistribution()}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Goal Recommendations</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-blue-900">Increase Lead Conversion Rate</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your current lead-to-policy conversion rate is 24.8%. Increasing this to 30% would result in 5 additional policies per month.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-green-900">Focus on High-Value Policies</h4>
                <p className="text-sm text-green-700 mt-1">
                  Whole Life policies generate 2.5x more revenue than Term Life. Shifting your focus could increase revenue by 15%.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-purple-900">Adjust Monthly Targets</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Based on historical performance, consider increasing your monthly revenue target by 8% to challenge your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}