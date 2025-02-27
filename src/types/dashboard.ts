import { IconName } from '../components/dashboard/DashboardIcon';

// Widget size options
export type WidgetSize = 'small' | 'medium' | 'large' | 'custom';

// Layout configuration for react-grid-layout
export interface LayoutConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

// Widget configuration
export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: WidgetSize;
  data: any;
  settings: any;
}

// Dashboard configuration
export interface DashboardConfig {
  id: string;
  name: string;
  theme: 'light' | 'dark' | 'custom';
  columns: number;
  rowHeight: number;
  backgroundColor: string;
  widgetBackgroundColor: string;
  widgetBorderColor: string;
  textColor: string;
  accentColor: string;
}

// Metric data structure
export interface MetricData {
  label: string;
  value: string;
  change?: string;
  icon?: IconName;
  color?: string;
}

// Chart dataset
export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
}

// Chart data
export interface ChartData {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  labels: string[];
  datasets: ChartDataset[];
}

// Activity item
export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: IconName;
  color?: string;
}

// Calendar event
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  type?: string;
}

// Table column definition
export interface TableColumn {
  id: string;
  header: string;
  accessor: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage' | 'status';
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
}

// Table data
export interface TableData {
  columns: TableColumn[];
  rows: any[];
}

// Progress data
export interface ProgressData {
  value: number;
  max: number;
  label?: string;
  color?: string;
}

// Goal data
export interface GoalData {
  id: string;
  name: string;
  current: number;
  target: number;
  unit?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

// Commission data
export interface CommissionData {
  id: string;
  policyType: string;
  client: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
}

// Forecast data
export interface ForecastData {
  period: string;
  projected: number;
  actual?: number;
}

// Widget library category
export interface WidgetCategory {
  id: string;
  name: string;
  description: string;
  widgets: WidgetDefinition[];
}

// Widget definition for the library
export interface WidgetDefinition {
  type: string;
  name: string;
  description: string;
  icon: IconName;
  defaultSize: WidgetSize;
  defaultData: any;
  defaultSettings: any;
}

// Dashboard preset
export interface DashboardPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  config: DashboardConfig;
  layouts: { [key: string]: LayoutConfig[] };
  widgets: WidgetConfig[];
}

// Theme preset
export interface ThemePreset {
  id: string;
  name: string;
  backgroundColor: string;
  widgetBackgroundColor: string;
  widgetBorderColor: string;
  textColor: string;
  accentColor: string;
}