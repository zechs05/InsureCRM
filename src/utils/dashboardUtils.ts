import { WidgetConfig, LayoutConfig } from '../types/dashboard';

/**
 * Generate a unique widget ID
 */
export const generateWidgetId = (): string => {
  return `widget-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format a date
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a time
 */
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });
};

/**
 * Calculate the percentage of a value relative to a maximum
 */
export const calculatePercentage = (value: number, max: number): number => {
  if (max === 0) return 0;
  return Math.min(Math.round((value / max) * 100), 100);
};

/**
 * Get a color based on a percentage value
 */
export const getColorByPercentage = (percentage: number): string => {
  if (percentage < 25) return 'red';
  if (percentage < 50) return 'orange';
  if (percentage < 75) return 'blue';
  return 'green';
};

/**
 * Get a color class based on a status
 */
export const getStatusColor = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800'
  };
  
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Get a color hex code based on a named color
 */
export const getColorHex = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    red: '#ef4444',
    green: '#10b981',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    gray: '#6b7280',
    black: '#111827',
    white: '#ffffff'
  };
  
  return colorMap[color.toLowerCase()] || '#3b82f6';
};

/**
 * Parse a formula string and evaluate it
 */
export const evaluateFormula = (formula: string, context: any): number => {
  try {
    // Replace variables with their values
    let expression = formula;
    Object.keys(context).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expression = expression.replace(regex, context[key]);
    });
    
    // Evaluate the expression
    // Note: This is a simple implementation and not secure for production
    // eslint-disable-next-line no-eval
    return eval(expression);
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
};

/**
 * Find the best position for a new widget
 */
export const findBestWidgetPosition = (
  layouts: { [key: string]: LayoutConfig[] },
  breakpoint: string,
  width: number,
  height: number
): { x: number, y: number } => {
  const layout = layouts[breakpoint] || [];
  
  if (layout.length === 0) {
    return { x: 0, y: 0 };
  }
  
  // Find the maximum y + h value to place the widget below existing ones
  const maxY = Math.max(...layout.map(item => item.y + item.h));
  
  return { x: 0, y: maxY };
};

/**
 * Get default widget data based on widget type
 */
export const getDefaultWidgetData = (widgetType: string): any => {
  switch (widgetType) {
    case 'welcome':
      return {
        userName: 'User'
      };
    case 'stats':
      return {
        metrics: [
          { label: 'Active Leads', value: '0', icon: 'Users', color: 'blue' },
          { label: 'Monthly Goal', value: '0%', icon: 'Target', color: 'green' },
          { label: 'Conversion Rate', value: '0%', icon: 'TrendingUp', color: 'purple' },
          { label: 'Revenue', value: '$0', icon: 'DollarSign', color: 'yellow' }
        ]
      };
    case 'chart':
      return {
        chartType: 'line',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Data',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }
        ]
      };
    case 'activity':
      return {
        activities: []
      };
    case 'calendar':
      return {
        events: []
      };
    case 'table':
      return {
        columns: [
          { id: 'name', header: 'Name', accessor: 'name' },
          { id: 'value', header: 'Value', accessor: 'value' }
        ],
        rows: []
      };
    case 'progress':
      return {
        value: 0,
        max: 100,
        label: 'Progress'
      };
    case 'goal':
      return {
        name: 'Goal',
        current: 0,
        target: 100,
        unit: '%'
      };
    default:
      return {};
  }
};

/**
 * Get default widget settings based on widget type
 */
export const getDefaultWidgetSettings = (widgetType: string): any => {
  switch (widgetType) {
    case 'welcome':
      return {
        showGreeting: true,
        showDate: true
      };
    case 'stats':
      return {
        columns: 2,
        showChange: true
      };
    case 'chart':
      return {
        showLegend: true,
        aspectRatio: 2
      };
    case 'activity':
      return {
        limit: 5,
        showTime: true
      };
    case 'calendar':
      return {
        view: 'month',
        showWeekends: true
      };
    case 'table':
      return {
        pagination: true,
        pageSize: 10,
        sortable: true,
        filterable: true
      };
    case 'progress':
      return {
        showLabel: true,
        showValue: true,
        color: 'blue'
      };
    case 'goal':
      return {
        showProgress: true,
        showRemaining: true,
        color: 'blue'
      };
    default:
      return {};
  }
};