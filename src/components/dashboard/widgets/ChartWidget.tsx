import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function ChartWidget({ widget, dashboardConfig }: ChartWidgetProps) {
  const { data, settings } = widget;
  const { chartType, labels, datasets } = data;

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: settings.aspectRatio || 2,
    plugins: {
      legend: {
        display: settings.showLegend,
        position: 'top' as const,
        labels: {
          color: dashboardConfig.textColor
        }
      }
    },
    scales: chartType === 'line' || chartType === 'bar' ? {
      x: {
        grid: {
          color: `${dashboardConfig.textColor}22`
        },
        ticks: {
          color: dashboardConfig.textColor
        }
      },
      y: {
        grid: {
          color: `${dashboardConfig.textColor}22`
        },
        ticks: {
          color: dashboardConfig.textColor
        }
      }
    } : undefined
  };

  const chartData: ChartData = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || dashboardConfig.accentColor,
      backgroundColor: dataset.backgroundColor || `${dashboardConfig.accentColor}22`
    }))
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      {renderChart()}
    </div>
  );
}