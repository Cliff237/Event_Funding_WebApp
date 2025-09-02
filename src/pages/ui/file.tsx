import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  Lock,
  Unlock,
  Eye,
  Settings,
  Edit,
  Share2,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreHorizontal,
  Copy,
  Download,
  Pause,
  Play,
  Trash2,
  Star
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'wedding' | 'school' | 'funeral' | 'birthday';
  status: 'active' | 'completed' | 'cancelled' | 'locked' | 'paused';
  targetAmount?: number;
  currentAmount: number;
  contributorCount: number;
  createdDate: string;
  deadline: string;
  duration: number; // in days
  isLocked: boolean;
  progress: number;
  totalTransactions: number;
  avgContribution: number;
  lastActivity: string;
  completionRate: number;
  featuredContributors: string[];
}

interface EventStats {
  totalRevenue: number;
  conversionRate: number;
  dailyContributions: number[];
  paymentMethodBreakdown: {
    momo: number;
    om: number;
    bank: number;
    wallet: number;
  };
}

const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'AICS School Fees 2024',
      description: 'Collect school fees for academic year 2024-2025',
      category: 'school',
      status: 'active',
      targetAmount: 5000000,
      currentAmount: 2500000,
      contributorCount: 45,
      createdDate: '2024-01-01',
      deadline: '2024-03-31',
      duration: 90,
      isLocked: false,
      progress: 50,
      totalTransactions: 78,
      avgContribution: 55555,
      lastActivity: '2024-01-15T10:30:00Z',
      completionRate: 85.2,
      featuredContributors: ['Alice J.', 'Bob W.', 'Carol B.']
    },
    {
      id: '2',
      title: 'Marie & Paul Wedding',
      description: 'Help us celebrate our special day',
      category: 'wedding',
      status: 'active',
      targetAmount: 1000000,
      currentAmount: 850000,
      contributorCount: 32,
      createdDate: '2023-12-15',
      deadline: '2024-02-14',
      duration: 60,
      isLocked: false,
      progress: 85,
      totalTransactions: 45,
      avgContribution: 26562,
      lastActivity: '2024-01-14T14:20:00Z',
      completionRate: 91.4,
      featuredContributors: ['David L.', 'Emma M.', 'Frank T.']
    },
    {
      id: '3',
      title: 'Papa Joseph Memorial',
      description: 'Memorial service contributions',
      category: 'funeral',
      status: 'completed',
      currentAmount: 1200000,
      contributorCount: 67,
      createdDate: '2023-11-20',
      deadline: '2023-12-20',
      duration: 30,
      isLocked: true,
      progress: 100,
      totalTransactions: 89,
      avgContribution: 17910,
      lastActivity: '2023-12-19T16:45:00Z',
      completionRate: 100,
      featuredContributors: ['Grace H.', 'Henry K.', 'Ivy N.']
    },
    {
      id: '4',
      title: 'Emma\'s Sweet 16',
      description: 'Birthday celebration fund',
      category: 'birthday',
      status: 'paused',
      targetAmount: 600000,
      currentAmount: 450000,
      contributorCount: 28,
      createdDate: '2024-01-05',
      deadline: '2024-02-28',
      duration: 54,
      isLocked: false,
      progress: 75,
      totalTransactions: 35,
      avgContribution: 16071,
      lastActivity: '2024-01-12T09:15:00Z',
      completionRate: 68.8,
      featuredContributors: ['Jack R.', 'Kate S.', 'Leo P.']
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'locked': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      case 'paused': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const toggleEventLock = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isLocked: !event.isLocked, status: event.isLocked ? 'active' : 'locked' }
        : event
    ));
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const EventStatsModal = ({ event, onClose }: { event: Event; onClose: () => void }) => {
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
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{event.title} Statistics</h2>
                  <p className="text-gray-600">Detailed analytics and performance metrics</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      +12.3%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{formatAmount(mockStats.totalRevenue)}</p>
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }satisfies Variants;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }satisfies Variants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0"
          variants={cardVariants}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-900 bg-clip-text text-transparent">
              My Events
            </h1>
            <p className="text-gray-600 mt-2">Manage and monitor your event campaigns</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </motion.button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8"
          variants={cardVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
              >
                <option value="all">All Events</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="locked">Locked</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                whileHover="hover"
                layout
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Event Header */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(event.category)}`} />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getCategoryEmoji(event.category)}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{event.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Status and Lock */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleEventLock(event.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        event.isLocked 
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {event.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </motion.button>
                  </div>

                  {/* Progress Bar */}
                  {event.targetAmount && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full bg-gradient-to-r ${getCategoryColor(event.category)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${event.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">{formatAmount(event.currentAmount)}</span>
                        <span className="text-gray-600">of {formatAmount(event.targetAmount || 0)}</span>
                      </div>
                    </div>
                  )}

                  {/* Event Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{event.contributorCount}</p>
                      <p className="text-xs text-gray-600">Contributors</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{getDaysRemaining(event.deadline)}</p>
                      <p className="text-xs text-gray-600">Days Left</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowStatsModal(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Stats
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Create your first event to start collecting contributions</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Modal */}
      {showStatsModal && selectedEvent && (
        <EventStatsModal 
          event={selectedEvent} 
          onClose={() => {
            setShowStatsModal(false);
            setSelectedEvent(null);
          }} 
        />
      )}
    </div>
  );
};

export default MyEventsPage;