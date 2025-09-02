import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Target,
  Eye,
  Settings,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart3,
  Zap,
  Star,
  FileText
} from 'lucide-react';

interface EventWallet {
  id: string;
  eventName: string;
  category: 'wedding' | 'school' | 'funeral' | 'birthday';
  balance: number;
  targetAmount?: number;
  totalContributions: number;
  lastActivity: string;
  status: 'active' | 'completed' | 'locked' | 'cancelled';
  progress: number;
  contributorCount: number;
}

interface PlatformStats {
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalUsers: number;
  successRate: number;
  avgContribution: number;
  totalTransactions: number;
}

interface QuickStats {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const Overview: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-900 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitor your events and platform performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-white text-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium border border-purple-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              My Events
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="relative overflow-hidden rounded-2xl shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-10`} />
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
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Wallets Section */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Wallets</h2>
                    <p className="text-gray-600">Track contributions across all events</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    <Wallet className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <AnimatePresence>
                  {eventWallets.map((wallet, index) => (
                    <motion.div
                      key={wallet.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ delay: index * 0.1 }}
                      whileHover="hover"
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getCategoryColor(wallet.category)}`} />
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getCategoryEmoji(wallet.category)}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{wallet.eventName}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wallet.status)}`}>
                                  {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {wallet.contributorCount} contributors
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatAmount(wallet.balance)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Last: {formatDate(wallet.lastActivity)}
                            </p>
                          </div>
                        </div>

                        {wallet.targetAmount && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>{wallet.progress}% of {formatAmount(wallet.targetAmount)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(wallet.category)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${wallet.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-4 h-4" />
                              <span>Mobile: 60%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CreditCard className="w-4 h-4" />
                              <span>Bank: 25%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>Wallet: 15%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            className="space-y-6"
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
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;