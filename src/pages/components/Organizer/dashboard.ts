import type {  IconType } from "react-icons";

// types/dashboard.ts
export interface MetricCard {
  title: string;
  value: string | number;
  change?: number; // percentage change
  icon: IconType;
  loading?: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'contribution' | 'event' | 'system' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  read?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: IconType;
  action: () => void;
}