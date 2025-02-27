import React from 'react';
import { WidgetConfig, DashboardConfig } from '../../types/dashboard';
import WelcomeWidget from './widgets/WelcomeWidget';
import StatsWidget from './widgets/StatsWidget';
import ChartWidget from './widgets/ChartWidget';
import ActivityWidget from './widgets/ActivityWidget';
import CalendarWidget from './widgets/CalendarWidget';
import TableWidget from './widgets/TableWidget';
import ProgressWidget from './widgets/ProgressWidget';
import GoalWidget from './widgets/GoalWidget';
import CommissionWidget from './widgets/CommissionWidget';
import NumberWidget from './widgets/NumberWidget';
import CustomMetricWidget from './widgets/CustomMetricWidget';
import EmptyWidget from './widgets/EmptyWidget';

interface WidgetContentProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function WidgetContent({ widget, dashboardConfig }: WidgetContentProps) {
  // Render the appropriate widget based on type
  switch (widget.type) {
    case 'welcome':
      return <WelcomeWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'stats':
      return <StatsWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'chart':
      return <ChartWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'activity':
      return <ActivityWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'calendar':
      return <CalendarWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'table':
      return <TableWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'progress':
      return <ProgressWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'goal':
      return <GoalWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'commission':
      return <CommissionWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'number':
      return <NumberWidget widget={widget} dashboardConfig={dashboardConfig} />;
    case 'custom-metric':
      return <CustomMetricWidget widget={widget} dashboardConfig={dashboardConfig} />;
    default:
      return <EmptyWidget widget={widget} dashboardConfig={dashboardConfig} />;
  }
}