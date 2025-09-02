import {  type Variants } from 'framer-motion'
import React, { useState } from 'react'
import type { PlatformStats, QuickStats } from './Events/type';
import { Activity, ArrowDownRight, ArrowUpRight, DollarSign, Target, Users } from 'lucide-react';

function OverviewStat() {
    const [platformStats] = useState<PlatformStats>({
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
  
  const quickStats: QuickStats[] = [
    {
      label: 'Total Revenue',
      value: formatAmount(platformStats.totalRevenue),
      change: platformStats.monthlyGrowth,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-400 to-emerald-600'
    },
    {
      label: 'Active Events',
      value: platformStats.activeEvents.toString(),
      change: 8.2,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 to-indigo-600'
    },
    {
      label: 'Total Users',
      value: platformStats.totalUsers.toLocaleString(),
      change: 15.3,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-400 to-cyan-600'
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const cardVariants = {
    // hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { stiffness: 100,  }
    },
    hover: {
      scale: 1.02,
      transition: {stiffness: 400, }
    }
  } satisfies Variants;
  return (
    <div 
      //  {/* Quick Stats Grid */
        className="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        // variants={containerVariants}
      >
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="sm:relative overflow-hidden rounded-2xl shadow-lg"
          >
            <div className={`absolute bg-gradient-to-br ${stat.bgGradient} opacity-10`} />
            <div className="relative bg-white/80 backdrop-blur-sm p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
    </div>

  )
}

export default OverviewStat