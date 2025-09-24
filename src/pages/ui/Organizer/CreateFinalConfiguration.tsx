import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Wallet, 
  Target, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users,
  Copy,
  Facebook,
  MessageCircle,
  Share2
} from 'lucide-react';
import type { EventFormData } from '../../components/Organizer/Events/type';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  deadlineError: string | null;
  goalError: string | null;
  showConfirmation?: boolean;
  setShowConfirmation?: React.Dispatch<React.SetStateAction<boolean>>;
  showShareModal?: boolean;
  setShowShareModal?: React.Dispatch<React.SetStateAction<boolean>>;
  ShareModalCard?: boolean;
  setShowShareModalCard?: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateFinalConfiguration({ 
  formData, 
  setFormData, 
  deadlineError, 
  goalError,
  showConfirmation: externalShowConfirmation,
  setShowConfirmation: externalSetShowConfirmation,
  showShareModal: externalShowShareModal,
  setShowShareModal: externalSetShowShareModal,
  ShareModalCard: externalShareModalCard,
  setShowShareModalCard: externalSetShowShareModalCard
}: Props) {
  // Use external state if provided, otherwise use internal state
  const [internalShowConfirmation, setInternalShowConfirmation] = useState(false);
  const [internalShowShareModal, setInternalShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showConfirmation = externalShowConfirmation ?? internalShowConfirmation;
  const setShowConfirmation = externalSetShowConfirmation ?? setInternalShowConfirmation;
  const showShareModal = externalShowShareModal ?? internalShowShareModal;
  const setShowShareModal = externalSetShowShareModal ?? setInternalShowShareModal;
  const ShareModalCard = externalShareModalCard ?? false;
  const setShowShareModalCard = externalSetShowShareModalCard ?? (() => {});

  // Generate event URL (this would be dynamic in real app)
  const eventUrl = `https://shaderpay.com/event/${formData.eventName?.toLowerCase().replace(/\s+/g, '-') || 'my-event'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmEvent = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Complete Event Data:', formData);
    setIsSubmitting(false);
    setShowConfirmation(false);
    setShowShareModal(true);
  };

  const openWhatsApp = () => {
    const text = `Join/support "${formData.eventName}" here: ${eventUrl}`;
    const href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const openFacebook = () => {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const calculateDaysUntilDeadline = () => {
    if (!formData.deadline) return null;
    const deadline = new Date(formData.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = calculateDaysUntilDeadline();

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎯 Final Configuration
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Set up your goals, deadlines, and sharing preferences
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Wallet Configuration */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Payment Setup</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'app_wallet', label: 'App Wallet', icon: '👛', desc: 'Instant access' },
                    { value: 'bank_account', label: 'Bank Account', icon: '🏦', desc: 'Direct transfer' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.walletType === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="walletType"
                        value={option.value}
                        checked={formData.walletType === option.value}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          walletType: e.target.value as 'app_wallet' | 'bank_account' 
                        }))}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fundraising Goal */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Fundraising Goal</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (FCFA) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                    goalError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  } focus:ring-4`}
                  value={formData.fundraisingGoal || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    fundraisingGoal: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="Enter your target amount..."
                  min="5000"
                />
              </div>
              <AnimatePresence>
                {goalError && (
                  <motion.p 
                    className="text-red-500 text-sm mt-2 flex items-center space-x-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{goalError}</span>
                  </motion.p>
                )}
              </AnimatePresence>
              {formData.fundraisingGoal >= 5000 && (
                <motion.div 
                  className="mt-3 p-3 bg-green-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Great! Your goal is {formatCurrency(formData.fundraisingGoal)} FCFA
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Deadline */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Event Deadline</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                    deadlineError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  } focus:ring-4`}
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <AnimatePresence>
                {deadlineError && (
                  <motion.p 
                    className="text-red-500 text-sm mt-2 flex items-center space-x-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{deadlineError}</span>
                  </motion.p>
                )}
              </AnimatePresence>
              {daysUntilDeadline && daysUntilDeadline > 0 && (
                <motion.div 
                  className="mt-3 p-3 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center space-x-2 text-blue-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Your event will run for {daysUntilDeadline} days
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Message & Summary */}
        <div className="space-y-6">
          {/* Contributor Message */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Thank You Message</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message for Contributors
              </label>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 resize-none"
                rows={6}
                value={formData.contributorMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, contributorMessage: e.target.value }))}
                placeholder="Write a heartfelt thank you message for your contributors..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This message will be shown to contributors after they make a payment
              </p>
            </div>
          </motion.div>

          {/* Event Summary */}
          <motion.div 
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Event Summary</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600">Event Name</span>
                <span className="font-semibold text-gray-900">{formData.eventName || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600">Goal Amount</span>
                <span className="font-semibold text-green-600">
                  {formData.fundraisingGoal ? `${formatCurrency(formData.fundraisingGoal)} FCFA` : 'Not set'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600">Form Fields</span>
                <span className="font-semibold text-blue-600">{formData.fields.length} fields</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600">Payment Methods</span>
                <span className="font-semibold text-purple-600">{formData.paymentMethods.length} methods</span>
              </div>
              
              {daysUntilDeadline && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-orange-600">{daysUntilDeadline} days</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Event Button - Only for non-school events */}
      {formData.eventType !== 'school' && (
        <motion.div 
          className="flex justify-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={() => setShowConfirmation(true)}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!formData.eventName || !formData.fundraisingGoal || formData.fundraisingGoal < 5000}
          >
            <CheckCircle className="w-6 h-6" />
            <span>Create Event</span>
          </motion.button>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Confirm Event Creation</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Are you ready to create "<span className="font-semibold text-purple-600">{formData.eventName}</span>"? 
                  This will make your event live and shareable with contributors.
                </p>

                <div className="flex space-x-4">
                  <button
                    className="flex-1 px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setShowConfirmation(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    onClick={handleConfirmEvent}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm & Create</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Share2 className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">🎉 Event Created Successfully!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your event is now live! Share it with potential contributors to start collecting funds.
                </p>
              </div>

              {/* Event URL */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Link</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={eventUrl}
                    readOnly
                    className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                  <motion.button 
                    onClick={handleCopyLink} 
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Share via Social Media</h4>
                <div className="flex justify-center space-x-4">
                  <motion.button 
                    onClick={openFacebook} 
                    className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Share on Facebook"
                  >
                    <Facebook className="w-6 h-6" />
                  </motion.button>
                  <motion.button 
                    onClick={openWhatsApp} 
                    className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>  
  );
}

export default CreateFinalConfiguration;