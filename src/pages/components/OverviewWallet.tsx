import { AnimatePresence, motion, type Variants } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import type { EventWallet } from './Organizer/Events/type';
import { Building2, CreditCard, Eye, Settings, Smartphone } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    name: string;
    role: string;
    exp: number;
}
function OverviewWallet() {
  const [eventWallets, setEventWallets] = useState<EventWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found in localStorage');
      return;
    }
  useEffect(() => {
    const fetchEventWallets = async () => {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded.id;
        
        const response = await fetch(`http://localhost:5000/api/events/wallet-summary/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          // Handle unauthorized (e.g., redirect to login)
          throw new Error('Session expired. Please log in again.');
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch event wallets');
        }
        
        const data = await response.json();
        setEventWallets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEventWallets();
  }, []);

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'locked': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getCategoryColor(wallet.organizerRole)}`} />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{wallet.title}</h3>
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
                    {formatAmount(wallet.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last: {formatDate(wallet.recentActivity)}
                  </p>
                </div>
              </div>

              {/* {wallet.targetAmount && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{wallet.progress}% of {formatAmount(wallet.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(wallet.organizerRole)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${wallet.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              )} */}

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
  )
}

export default OverviewWallet