import { motion, type Variants } from 'framer-motion'
import { ArrowUpRight, BarChart3, FileText, PieChart, Settings, TrendingUp, Zap } from 'lucide-react';
import React, { useState } from 'react'
import type { PlatformStats } from './Events/type';

function OverviewRightSideBar() {
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
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {type: "spring", stiffness: 100, damping: 15  }
    },
    hover: {
      scale: 1.02,
      transition: {type: "spring",stiffness: 400, damping: 10 }
    }
  } satisfies Variants;

  return (
    <motion.div 
    className="space-y-6 mt-9 md:mt-0"
    variants={containerVariants}
  >
    {/* Platform Statistics */}
    <motion.div 
      variants={cardVariants}
      className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Platform Stats</h3>
          <PieChart className="w-6 h-6 opacity-80" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="opacity-90">Total Events</span>
            <span className="font-bold text-lg">{platformStats.totalEvents}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-90">Avg. Contribution</span>
            <span className="font-bold text-lg">{formatAmount(platformStats.avgContribution)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-90">Transactions</span>
            <span className="font-bold text-lg">{platformStats.totalTransactions.toLocaleString()}</span>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Monthly Growth: {platformStats.monthlyGrowth}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Recent Activity */}
    <motion.div 
      variants={cardVariants}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { user: 'Alice Johnson', amount: 50000, event: 'School Fees', time: '2 min ago', type: 'contribution' },
            { user: 'Bob Wilson', amount: 25000, event: 'Wedding Fund', time: '5 min ago', type: 'contribution' },
            { user: 'Carol Brown', amount:40000, event: 'Birthday Party', time: '8 min ago', type: 'event_created' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'contribution' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-xs text-gray-600">
                  {activity.type === 'contribution' 
                    ? `Contributed ${formatAmount(activity.amount)} to ${activity.event}`
                    : `Created new event: ${activity.event}`
                  }
                </p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Quick Actions */}
    <motion.div 
      variants={cardVariants}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {[
            { label: 'View Analytics', icon: <BarChart3 className="w-4 h-4" />, gradient: 'from-blue-500 to-cyan-600' },
            { label: 'Generate Report', icon: <FileText className="w-4 h-4" />, gradient: 'from-green-500 to-emerald-600' },
            { label: 'Send Notifications', icon: <Zap className="w-4 h-4" />, gradient: 'from-yellow-500 to-orange-600' },
            { label: 'Platform Settings', icon: <Settings className="w-4 h-4" />, gradient: 'from-purple-500 to-indigo-600' }
          ].map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-700">{action.label}</span>
              <ArrowUpRight className="w-4 h-4 ml-auto text-gray-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
  )
}

export default OverviewRightSideBar