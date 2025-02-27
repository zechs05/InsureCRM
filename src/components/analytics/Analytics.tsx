import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const metrics = [
  {
    label: 'Total Revenue',
    value: '$248,500',
    change: '+12.5%',
    chart: [65, 45, 85, 55, 75, 95, 70]
  },
  {
    label: 'Lead Conversion',
    value: '24.8%',
    change: '+4.3%',
    chart: [35, 55, 45, 65, 45, 75, 65]
  },
  {
    label: 'Active Policies',
    value: '1,248',
    change: '+8.2%',
    chart: [45, 65, 55, 75, 65, 85, 75]
  },
  {
    label: 'Team Performance',
    value: '92.4%',
    change: '+2.1%',
    chart: [75, 85, 95, 85, 95, 85, 95]
  }
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
          <p className="text-sm text-gray-500">Track your team's performance and growth</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {metric.change}
              </span>
            </div>
            <div className="h-16">
              <div className="flex items-end justify-between h-full">
                {metric.chart.map((value, i) => (
                  <div
                    key={i}
                    className="w-8 bg-blue-100 rounded-t"
                    style={{ height: `${value}%` }}
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-4">
            {[
              { source: 'Referrals', value: 35, color: 'bg-blue-500' },
              { source: 'Website', value: 28, color: 'bg-green-500' },
              { source: 'Social Media', value: 22, color: 'bg-purple-500' },
              { source: 'Direct', value: 15, color: 'bg-yellow-500' }
            ].map((source) => (
              <div key={source.source}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-500">{source.source}</span>
                  <span className="text-sm font-medium text-gray-900">{source.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 ${source.color} rounded-full`}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', policies: 45, revenue: 125000 },
              { name: 'Michael Chen', policies: 38, revenue: 98000 },
              { name: 'Emily Davis', policies: 32, revenue: 85000 }
            ].map((performer) => (
              <div key={performer.name} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-500">{performer.policies} policies</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${performer.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}