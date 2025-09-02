import { motion, type Variants } from 'framer-motion';
import { Activity, Calendar, DollarSign, Plus, Target, Users } from 'lucide-react';
import React, { useState } from 'react'
import { type EventWallet, type PlatformStats, type QuickStats } from '../../components/Organizer/Events/type'
import OverviewStat from '../../components/Organizer/overviewStat';
import OverviewWallet from './OverviewWallet';
function OverviewPage() {
  
  const [eventWallets] = useState<EventWallet[]>([
    {
      id: '1',
      eventName: 'AICS School Fees 2024',
      category: 'school',
      balance: 2500000,
      targetAmount: 5000000,
      totalContributions: 2500000,
      lastActivity: '2024-01-15T10:30:00Z',
      status: 'active',
      progress: 50,
      contributorCount: 45
    },
    {
      id: '2',
      eventName: 'Marie & Paul Wedding',
      category: 'wedding',
      balance: 850000,
      targetAmount: 1000000,
      totalContributions: 850000,
      lastActivity: '2024-01-14T14:20:00Z',
      status: 'active',
      progress: 85,
      contributorCount: 32
    },
    {
      id: '3',
      eventName: 'Papa Joseph Memorial',
      category: 'funeral',
      balance: 1200000,
      totalContributions: 1200000,
      lastActivity: '2024-01-13T16:45:00Z',
      status: 'completed',
      progress: 100,
      contributorCount: 67
    },
    {
      id: '4',
      eventName: 'Emma\'s Sweet 16',
      category: 'birthday',
      balance: 450000,
      targetAmount: 600000,
      totalContributions: 450000,
      lastActivity: '2024-01-12T09:15:00Z',
      status: 'active',
      progress: 75,
      contributorCount: 28
    }
  ]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'school':
        return 'from-blue-500 to-indigo-600';
      case 'wedding':
        return 'from-pink-500 to-rose-600';
      case 'funeral':
        return 'from-gray-500 to-slate-600';
      case 'birthday':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'school': return '🎓';
      case 'wedding': return '💍';
      case 'funeral': return '🕊️';
      case 'birthday': return '🎂';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'locked': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
    {
      label: 'Success Rate',
      value: `${platformStats.successRate}%`,
      change: 2.1,
      icon: <Target className="w-6 h-6" />,
      color: 'text-orange-600',
      bgGradient: 'from-orange-400 to-red-600'
    }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {y: 0,opacity: 1,
      transition: { type: "spring", stiffness: 100
      }
    }
  }satisfies Variants;


  return (
    
    <div className="h-screen overflow-y-auto w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 z-0 ">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between mb-8 rounded-xl bg-gray-100 shadow-lg"
          variants={itemVariants}
        >
          <div className='p-3'>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-900 bg-clip-text text-transparent">
              Welcome Mr Bitom to Your Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitor your events and platform performance</p>
          </div>

        </motion.div>
        {/* Quick Stats  */}
        <OverviewStat/>

        {/* Event Wallet Section  */}
        <motion.div 
          className="flex items-center justify-between mb-8 rounded-xl bg-gray-100 shadow-lg"
          variants={itemVariants}
        >
          
          <OverviewWallet/>
        </motion.div>

      </motion.div>
      
    </div>
  )
}

export default OverviewPage
