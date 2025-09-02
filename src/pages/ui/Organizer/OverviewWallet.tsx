import { AnimatePresence } from 'framer-motion'
import React from 'react'

function OverviewWallet() {
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
  )
}

export default OverviewWallet