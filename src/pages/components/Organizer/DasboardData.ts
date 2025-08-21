// services/dashboardData.ts
import type { ActivityItem, MetricCard, QuickAction } from "./dashboard";
import { FaCalendarAlt, FaMoneyBillWave, FaUsers, FaChartLine, FaCalendar, FaFileAlt, FaUserPlus, FaChartPie } from "react-icons/fa";

export const getMetrics = (): MetricCard[] => [
  {
    title: "Active Events",
    value: 5,
    change: 12,
    icon: FaCalendarAlt,
  },
  {
    title: "Total Contributions",
    value: "425,000 XAF",
    change: 8,
    icon: FaMoneyBillWave,
  },
  {
    title: "Participants",
    value: 84,
    change: -2,
    icon: FaUsers,
  },
  {
    title: "Completion Rate",
    value: "68%",
    change: 5,
    icon: FaChartLine,
  },
];
export const getQuickActions = (onCreateEvent: () => void): QuickAction[] => [
  {
    id: 'create-event',
    label: 'Create New Event',
    icon: FaCalendar,
    action: onCreateEvent,
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: FaFileAlt,
    action: () => console.log('Generate report clicked'),
  },
  {
    id: 'invite-member',
    label: 'Invite Team Member',
    icon: FaUserPlus,
    action: () => console.log('Invite member clicked'),
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    icon: FaChartPie,
    action: () => console.log('View analytics clicked'),
  },
];

export const getActivities = (): ActivityItem[] => [
  {
    id: '1',
    type: 'contribution',
    title: 'New Contribution',
    description: 'John Doe contributed to Wedding Fund',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    amount: 50000,
  },
  {
    id: '2',
    type: 'event',
    title: 'Event Created',
    description: 'You created "School Fees Collection"',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '3',
    type: 'contribution',
    title: 'New Contribution',
    description: 'Alice Smith contributed to Funeral Support',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    amount: 25000,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    description: 'New features available in dashboard',
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
  },
];