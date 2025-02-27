import React from 'react';
import * as Icons from 'lucide-react';

// Define all available icon names
export type IconName = keyof typeof Icons;

interface DashboardIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export default function DashboardIcon({ name, ...props }: DashboardIconProps) {
  const Icon = Icons[name];
  return Icon ? <Icon {...props} /> : null;
}