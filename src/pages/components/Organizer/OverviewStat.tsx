import React, { useState } from 'react'
import type { PlatformStats, QuickStats } from './Events/type';
import { Activity, ArrowDownRight, ArrowUpRight, DollarSign, Users } from 'lucide-react';
import StatMatricCard from './StatMatricCard';

function OverviewStat() {
    const [platformStats, setPlatformStats] = useState<PlatformStats>({
      totalEvents: 127,
      activeEvents: 89,
      totalRevenue: 15600000,
      monthlyGrowth: 12.5,
      totalUsers: 2847,
      successRate: 94.2,
      avgContribution: 47500,
      totalTransactions: 3456
    });
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(amount);
    };
  
  const quickStats :QuickStats[] = [
    {
      label: 'Total Revenue',
      value: formatAmount(platformStats.totalRevenue??0),
      change: platformStats.monthlyGrowth??0,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-400 to-emerald-900'
    },
    {
      label: 'Active Events',
      value: (platformStats.activeEvents??0).toString(),
      change: 8.2,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 to-indigo-600'
    },
    {
      label: 'Total Users',
      value: (platformStats.totalUsers??0).toLocaleString(),
      change: 15.3,
      icon: <Users className="w-6 h-6" />,
      color: 'text-red-100',
      bgGradient: 'from-blue-400 to-blue-600'
    },
  ];

  return (
    <div 
      //  {/* Quick Stats Grid */
        className="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        // variants={containerVariants}
      >
        {quickStats.map((stat, index) => (
          <StatMatricCard
            index={index}
            label={stat.label??''}
            value={stat.value??''}
            change={stat.change??0}
            icon={stat.icon}
            // color={stat.color}
            bgGradient={stat.bgGradient??''}       />
        ))}
    </div>

  )
}

export default OverviewStat