import React from 'react';
import { Calculator } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';
import { evaluateFormula } from '../../../utils/dashboardUtils';

interface CustomMetricWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function CustomMetricWidget({ widget, dashboardConfig }: CustomMetricWidgetProps) {
  const { data, settings } = widget;
  const result = evaluateFormula(data.formula, data.variables);
  
  const formatValue = (value: number) => {
    switch (data.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: settings.precision || 0,
          maximumFractionDigits: settings.precision || 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(settings.precision || 1)}%`;
      default:
        return value.toFixed(settings.precision || 0);
    }
  };

  return (
    <div className="h-full flex items-center">
      <div className="flex-1">
        <div 
          className="p-2 rounded-lg w-fit mb-2"
          style={{ backgroundColor: `${dashboardConfig.accentColor}22` }}
        >
          <Calculator 
            className="h-5 w-5"
            style={{ color: dashboardConfig.accentColor }}
          />
        </div>
        <p 
          className="text-sm"
          style={{ color: `${dashboardConfig.textColor}99` }}
        >
          {data.label}
        </p>
        <p 
          className="text-2xl font-semibold mt-1"
          style={{ color: dashboardConfig.textColor }}
        >
          {formatValue(result)}
        </p>
        {settings.showFormula && (
          <p 
            className="text-xs mt-2"
            style={{ color: `${dashboardConfig.textColor}99` }}
          >
            Formula: {data.formula}
          </p>
        )}
      </div>
    </div>
  );
}