import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  Search,
  Calendar,
  CreditCard,
  Users,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  User,
  School,
  Heart,
  PartyPopper,
  MessageSquare,
  TrendingUp,
  UserCheck,
  FileText,
  Gift,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

// Enhanced Types
type NotificationType = 
  | 'payment_received' 
  | 'payment_failed' 
  | 'event_milestone' 
  | 'event_deadline' 
  | 'new_contributor' 
  | 'event_completed'
  | 'system_update' 
  | 'account_verification'
  | 'withdrawal_processed'
  | 'contributor_message'
  | 'event_shared'
  | 'goal_achieved';

type NotificationPriority = 'urgent' | 'high' | 'medium' | 'low';
type NotificationStatus = 'unread' | 'read';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  detailedMessage?: string;
  timestamp: Date;
  actionUrl?: string;
  eventId?: string;
  eventName?: string;
  amount?: number;
  contributorName?: string;
  contributorAvatar?: string;
  metadata?: {
    transactionId?: string;
    goalPercentage?: number;
    totalContributors?: number;
    daysRemaining?: number;
    withdrawalMethod?: string;
    verificationStatus?: string;
    shareCount?: number;
  };
}

const NotificationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | 'all'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Enhanced notifications data with more realistic scenarios
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment_received',
      priority: 'high',
      status: 'unread',
      title: 'New Payment Received! 🎉',
      message: 'Marie Tchinda contributed 25,000 FCFA to your School Fees Collection event',
      detailedMessage: 'Great news! Marie Tchinda has successfully contributed 25,000 FCFA to your "School Fees Collection" event. This brings your total collected amount to 125,000 FCFA. The payment was processed via Mobile Money and has been added to your event balance.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      eventId: 'evt-001',
      eventName: 'School Fees Collection',
      amount: 25000,
      contributorName: 'Marie Tchinda',
      contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
      metadata: {
        transactionId: 'TXN-2024-001',
        goalPercentage: 62
      }
    },
    {
      id: '2',
      type: 'event_milestone',
      priority: 'medium',
      status: 'unread',
      title: 'Milestone Achieved! 🚀',
      message: 'Your Wedding Contribution event has reached 80% of its goal',
      detailedMessage: 'Congratulations! Your "Wedding Contribution" event has successfully reached 80% of its fundraising goal. You\'ve collected 400,000 FCFA out of your 500,000 FCFA target with contributions from 15 generous supporters. Keep sharing to reach your goal!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      eventId: 'evt-002',
      eventName: 'Wedding Contribution',
      metadata: {
        goalPercentage: 80,
        totalContributors: 15
      }
    },
    {
      id: '3',
      type: 'new_contributor',
      priority: 'medium',
      status: 'unread',
      title: 'New Supporter Joined! 👥',
      message: 'Jean Baptiste just joined your Defense Project event',
      detailedMessage: 'Jean Baptiste has joined your "Defense Project" event as a new contributor. They haven\'t made a contribution yet, but showing interest in your cause. Consider sending them a welcome message to encourage their support.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      eventId: 'evt-003',
      eventName: 'Defense Project',
      contributorName: 'Jean Baptiste',
      contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
      metadata: {
        totalContributors: 8
      }
    },
    {
      id: '4',
      type: 'event_deadline',
      priority: 'urgent',
      status: 'unread',
      title: 'Urgent: Event Expiring Soon! ⏰',
      message: 'Your Birthday Celebration event expires in 2 days',
      detailedMessage: 'Your "Birthday Celebration" event is set to expire in just 2 days. You\'ve currently collected 75,000 FCFA towards your 100,000 FCFA goal. Consider extending the deadline or sharing the event more widely to reach your target before it expires.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      eventId: 'evt-004',
      eventName: 'Birthday Celebration',
      metadata: {
        daysRemaining: 2,
        goalPercentage: 75
      }
    },
    {
      id: '5',
      type: 'payment_failed',
      priority: 'urgent',
      status: 'read',
      title: 'Payment Failed ❌',
      message: 'A payment attempt of 20,000 FCFA failed for Charity Drive',
      detailedMessage: 'A payment attempt by Paul Mballa for 20,000 FCFA to your "Charity Drive" event has failed. The failure was due to insufficient funds in the contributor\'s mobile money account. The contributor has been notified and can retry the payment.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      eventId: 'evt-005',
      eventName: 'Charity Drive',
      amount: 20000,
      contributorName: 'Paul Mballa',
      metadata: {
        transactionId: 'TXN-2024-FAILED-002'
      }
    },
    {
      id: '6',
      type: 'contributor_message',
      priority: 'medium',
      status: 'unread',
      title: 'New Message from Contributor 💬',
      message: 'Sandra Mballa sent you a message about your event',
      detailedMessage: 'Sandra Mballa left a heartfelt message on your "Community Garden Project" event: "Thank you so much for organizing this amazing initiative! Our community really needs this garden. I\'ve shared it with my family and friends. Keep up the great work!" - This message was posted publicly on your event page.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      contributorName: 'Sandra Mballa',
      contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sandra',
      eventName: 'Community Garden Project'
    },
    {
      id: '7',
      type: 'withdrawal_processed',
      priority: 'high',
      status: 'read',
      title: 'Withdrawal Processed ✅',
      message: 'Your withdrawal of 150,000 FCFA has been processed successfully',
      detailedMessage: 'Your withdrawal request for 150,000 FCFA from your "School Infrastructure" event has been successfully processed. The funds have been transferred to your Mobile Money account ending in ***789. Transaction reference: WD-2024-001. The funds should reflect in your account within 24 hours.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      amount: 150000,
      metadata: {
        transactionId: 'WD-2024-001',
        withdrawalMethod: 'Mobile Money'
      }
    },
    {
      id: '8',
      type: 'goal_achieved',
      priority: 'high',
      status: 'read',
      title: 'Goal Achieved! 🎯',
      message: 'Congratulations! Your Medical Emergency event reached its goal',
      detailedMessage: 'Amazing news! Your "Medical Emergency" event has successfully reached and exceeded its fundraising goal of 300,000 FCFA. You\'ve collected 325,000 FCFA with the help of 23 generous contributors. The event will remain active for 7 more days to collect additional support if needed.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      eventName: 'Medical Emergency',
      amount: 325000,
      metadata: {
        goalPercentage: 108,
        totalContributors: 23
      }
    },
    {
      id: '9',
      type: 'event_shared',
      priority: 'low',
      status: 'read',
      title: 'Event Shared 📤',
      message: 'Your Graduation Party event was shared 5 times today',
      detailedMessage: 'Great engagement! Your "Graduation Party" event has been shared 5 times today across social media platforms. This increased visibility has resulted in 3 new event views and 1 new contributor. Keep encouraging your supporters to share for maximum reach.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      eventName: 'Graduation Party',
      metadata: {
        shareCount: 5
      }
    },
    {
      id: '10',
      type: 'account_verification',
      priority: 'medium',
      status: 'read',
      title: 'Account Verified ✅',
      message: 'Your account has been successfully verified',
      detailedMessage: 'Congratulations! Your ShaderPay account has been successfully verified. You now have access to all premium features including higher withdrawal limits, priority customer support, and advanced analytics. Your verified status will be displayed on all your events to build trust with contributors.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metadata: {
        verificationStatus: 'verified'
      }
    }
  ]);

  // Enhanced notification type configurations
  const notificationTypeConfig = {
    payment_received: { 
      icon: CreditCard, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-200',
      label: 'Payment Received',
      emoji: '💰'
    },
    payment_failed: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100', 
      borderColor: 'border-red-200',
      label: 'Payment Failed',
      emoji: '❌'
    },
    event_milestone: { 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100', 
      borderColor: 'border-purple-200',
      label: 'Milestone',
      emoji: '🚀'
    },
    event_deadline: { 
      icon: Clock, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100', 
      borderColor: 'border-orange-200',
      label: 'Deadline Alert',
      emoji: '⏰'
    },
    new_contributor: { 
      icon: UserCheck, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100', 
      borderColor: 'border-blue-200',
      label: 'New Supporter',
      emoji: '👥'
    },
    event_completed: { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-200',
      label: 'Event Completed',
      emoji: '✅'
    },
    system_update: { 
      icon: Settings, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100', 
      borderColor: 'border-gray-200',
      label: 'System Update',
      emoji: '⚙️'
    },
    account_verification: { 
      icon: CheckCircle, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-100', 
      borderColor: 'border-indigo-200',
      label: 'Account Update',
      emoji: '✅'
    },
    withdrawal_processed: { 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-100', 
      borderColor: 'border-emerald-200',
      label: 'Withdrawal',
      emoji: '💸'
    },
    contributor_message: { 
      icon: MessageSquare, 
      color: 'text-cyan-600', 
      bgColor: 'bg-cyan-100', 
      borderColor: 'border-cyan-200',
      label: 'Message',
      emoji: '💬'
    },
    event_shared: { 
      icon: Share2, 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-100', 
      borderColor: 'border-pink-200',
      label: 'Event Shared',
      emoji: '📤'
    },
    goal_achieved: { 
      icon: Gift, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100', 
      borderColor: 'border-yellow-200',
      label: 'Goal Achieved',
      emoji: '🎯'
    }
  };

  // Priority configurations
  const priorityConfig = {
    urgent: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'Urgent', pulse: true },
    high: { color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'High', pulse: false },
    medium: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Medium', pulse: false },
    low: { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Low', pulse: false }
  };

  // Filter and search logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (notification.contributorName && notification.contributorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (notification.eventName && notification.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchTerm, selectedType, selectedStatus]);

  // Utility functions
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, status: 'read' as NotificationStatus } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, status: 'read' as NotificationStatus }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const openNotificationDetail = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  const getUnreadCount = () => notifications.filter(n => n.status === 'unread').length;
  const getUrgentCount = () => notifications.filter(n => n.priority === 'urgent' && n.status === 'unread').length;

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const config = notificationTypeConfig[notification.type];
    const priorityConf = priorityConfig[notification.priority];
    const Icon = config.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.01 }}
        className={`relative p-4 border-l-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
          notification.status === 'unread' 
            ? `bg-white border-l-blue-500 shadow-md` 
            : 'bg-gray-50 border-l-gray-300'
        } ${config.borderColor}`}
        onClick={() => openNotificationDetail(notification)}
      >
        {/* Priority indicator */}
        {notification.priority === 'urgent' && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"
          />
        )}

        <div className="flex items-start space-x-4">
          {/* Icon with avatar overlay for contributor notifications */}
          <div className="relative flex-shrink-0">
            <div className={`p-3 rounded-full ${config.bgColor}`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            {notification.contributorAvatar && (
              <img
                src={notification.contributorAvatar}
                alt={notification.contributorName}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`font-semibold text-lg ${
                    notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </h3>
                  {notification.status === 'unread' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
                
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {notification.message}
                </p>

                {/* Enhanced metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(notification.timestamp)}</span>
                  </span>
                  
                  {notification.eventName && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{notification.eventName}</span>
                    </span>
                  )}
                  
                  {notification.amount && (
                    <span className="flex items-center space-x-1 font-medium text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{notification.amount.toLocaleString()} FCFA</span>
                    </span>
                  )}
                  
                  {notification.contributorName && (
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{notification.contributorName}</span>
                    </span>
                  )}

                  {notification.metadata?.goalPercentage && (
                    <span className="flex items-center space-x-1 text-purple-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{notification.metadata.goalPercentage}% of goal</span>
                    </span>
                  )}

                  {notification.metadata?.daysRemaining && (
                    <span className="flex items-center space-x-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{notification.metadata.daysRemaining} days left</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Priority badge */}
              {(notification.priority === 'urgent' || notification.priority === 'high') && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConf.bgColor} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Click indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="w-4 h-4 text-gray-400" />
        </div>
      </motion.div>
    );
  };

  // Notification Detail Modal
  const NotificationDetailModal = () => {
    if (!selectedNotification) return null;

    const config = notificationTypeConfig[selectedNotification.type];
    const Icon = config.icon;

    return (
      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 ${config.bgColor} border-b`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-white/20`}>
                      <Icon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedNotification.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {config.label} • {formatTimeAgo(selectedNotification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Detailed message */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedNotification.detailedMessage || selectedNotification.message}
                    </p>
                  </div>

                  {/* Event information */}
                  {selectedNotification.eventName && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Event Information
                      </h4>
                      <p className="text-gray-700">{selectedNotification.eventName}</p>
                      {selectedNotification.metadata?.goalPercentage && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{selectedNotification.metadata.goalPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(selectedNotification.metadata.goalPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contributor information */}
                  {selectedNotification.contributorName && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Contributor
                      </h4>
                      <div className="flex items-center space-x-3">
                        {selectedNotification.contributorAvatar && (
                          <img
                            src={selectedNotification.contributorAvatar}
                            alt={selectedNotification.contributorName}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{selectedNotification.contributorName}</p>
                          {selectedNotification.amount && (
                            <p className="text-green-600 font-medium">
                              Contributed {selectedNotification.amount.toLocaleString()} FCFA
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction details */}
                  {selectedNotification.metadata?.transactionId && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Transaction Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-mono text-gray-900">{selectedNotification.metadata.transactionId}</span>
                        </div>
                        {selectedNotification.metadata.withdrawalMethod && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="text-gray-900">{selectedNotification.metadata.withdrawalMethod}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              {/* Actions */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <div className="flex space-x-3">
                  {selectedNotification.actionUrl && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Event</span>
                    </button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                      closeDetailModal();
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-10 h-10 text-purple-600" />
                  {getUnreadCount() > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {getUnreadCount()}
                    </motion.div>
                  )}
                </div>
                <span>Notifications</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Stay updated with your events and contributions</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {getUnreadCount() > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-6 py-3 text-purple-600 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <CheckCheck className="w-5 h-5" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick stats */}
          {(getUnreadCount() > 0 || getUrgentCount() > 0) && (
            <div className="flex items-center space-x-6 mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              {getUnreadCount() > 0 && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <BellRing className="w-5 h-5" />
                  <span className="font-medium">{getUnreadCount()} unread</span>
                </div>
              )}
              {getUrgentCount() > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">{getUrgentCount()} urgent</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as NotificationType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="payment_received">Payment Received</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="event_milestone">Milestones</option>
                <option value="event_deadline">Deadlines</option>
                <option value="new_contributor">New Supporters</option>
                <option value="contributor_message">Messages</option>
                <option value="withdrawal_processed">Withdrawals</option>
                <option value="goal_achieved">Goals Achieved</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as NotificationStatus | 'all')}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No notifications found</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                    ? "Try adjusting your filters or search terms to find what you're looking for."
                    : "You're all caught up! New notifications will appear here when there's activity on your events."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Detail Modal */}
        <NotificationDetailModal />
      </div>
    </div>
  );
};

export default NotificationPage;