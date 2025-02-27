import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { WidgetConfig, DashboardConfig } from '../../../types/dashboard';

interface TableWidgetProps {
  widget: WidgetConfig;
  dashboardConfig: DashboardConfig;
}

export default function TableWidget({ widget, dashboardConfig }: TableWidgetProps) {
  const { data, settings } = widget;
  const { columns, rows } = data;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y" style={{ borderColor: dashboardConfig.widgetBorderColor }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: `${dashboardConfig.textColor}99` }}
              >
                <div className="flex items-center">
                  {column.header}
                  {settings.sortable && (
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: dashboardConfig.widgetBorderColor }}>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-3 py-2 text-sm whitespace-nowrap"
                  style={{ color: dashboardConfig.textColor }}
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}