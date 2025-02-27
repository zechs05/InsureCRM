import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface CommissionWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function CommissionWidget({ widget, dashboardConfig }: CommissionWidgetProps) {
  const { data } = widget;
  const commissions = data.commissions || [];

  return (
    <div className="space-y-4">
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p 
              className="text-sm"
              style={{ color: `${dashboardConfig.textColor}99` }}
            >
              Total Commissions
            </p>
            <p 
              className="text-2xl font-semibold mt-1"
              style={{ color: dashboardConfig.textColor }}
            >
              ${data.total?.toLocaleString()}
            </p>
          </div>
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
          >
            <DollarSign 
              className="h-6 w-6"
              style={{ color: dashboardConfig.accentColor }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {commissions.map((commission) => (
          <div 
            key={commission.id}
            className="p-3 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
          >
            <div>
              <p 
                className="text-sm font-medium"
                style={{ color: dashboardConfig.textColor }}
              >
                {commission.policyType}
              </p>
              <p 
                className="text-xs mt-0.5"
                style={{ color: `${dashboardConfig.textColor}99` }}
              >
                {commission.client}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-sm font-medium"
                style={{ color: dashboardConfig.textColor }}
              >
                ${commission.amount.toLocaleString()}
              </p>
              <p 
                className="text-xs"
                style={{ color: `${dashboardConfig.textColor}99` }}
              >
                {format(new Date(commission.date), 'MMM d')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.trend && (
        <div 
          className="p-3 rounded-lg flex items-center"
          style={{ backgroundColor: `${dashboardConfig.textColor}11` }}
        >
          <TrendingUp 
            className="h-4 w-4 mr-2"
            style={{ color: dashboardConfig.accentColor }}
          />
          <span 
            className="text-sm"
            style={{ color: dashboardConfig.textColor }}
          >
            {data.trend}% increase from last month
          </span>
        </div>
      )}
    </div>
  );
}