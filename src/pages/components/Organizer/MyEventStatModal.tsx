import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, DollarSign, Target, Users, XCircle } from "lucide-react";
import type { EventStats,Events } from "./Events/type";


const EventStatsModal = ({ event, onClose }: { event: Events; onClose: () => void }) => {
  const mockStats: EventStats = {
    totalRevenue: event.currentAmount,
    conversionRate: 73.2,
    dailyContributions: [12000, 25000, 18000, 45000, 32000, 28000, 35000],
    paymentMethodBreakdown: {
      momo: 45,
      om: 30,
      bank: 15,
      wallet: 10
    }
  };
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl md:max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100 relative">
            <div className="flex items-center justify-between ">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{event.title} Statistics</h2>
                <p className="text-gray-600">Detailed analytics and performance metrics</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 absolute right-3 top-5 hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                    +12.3%
                  </span>
                </div>
                <p className="text-2xl  font-bold text-green-900">{formatAmount(mockStats.totalRevenue)}</p>
                <p className="text-sm text-green-700">Total Revenue</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    +8.1%
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{event.contributorCount}</p>
                <p className="text-sm text-blue-700">Contributors</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                    {mockStats.conversionRate}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{event.progress}%</p>
                <p className="text-sm text-purple-700">Goal Progress</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600 bg-orange-200 px-2 py-1 rounded-full">
                    Avg
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{formatAmount(event.avgContribution)}</p>
                <p className="text-sm text-orange-700">Avg Contribution</p>
              </div>
            </div>

            {/* Payment Methods Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(mockStats.paymentMethodBreakdown).map(([method, percentage]) => (
                  <div key={method} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={method === 'momo' ? '#f59e0b' : method === 'om' ? '#ea580c' : method === 'bank' ? '#3b82f6' : '#8b5cf6'}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${percentage * 1.76} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 capitalize">{method}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {event.featuredContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {contributor.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contributor}</p>
                        <p className="text-sm text-gray-600">Contributed {formatAmount(Math.random() * 100000 + 10000)}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{index + 1} min ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default EventStatsModal