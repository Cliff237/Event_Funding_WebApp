import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Download,
  ExternalLink,
  AlertCircle,
  School,
  Heart,
  Flower2,
  PartyPopper,
  Building2,
  Users,
  GraduationCap,
  Calendar
} from 'lucide-react';
import type { EventFormData, FormField, PaymentMethod } from '../components/Organizer/Events/type';

// Mock event data - in real app, this would come from API
const getMockEventData = (slug: string): EventFormData => {
  return {
    eventType: 'school',
    organizerName: 'Marie Tchinda',
    organizerPassword: '',
    eventName: 'Support Our School Library Project',
    eventTitle: 'Help Us Build a Better Future Through Education',
    eventDescription: 'We are raising funds to renovate our school library and purchase new books and computers for our students. Your contribution will directly impact the education of over 500 students.',
    fields: [
      { id: '1', label: 'Full Name', type: 'text', required: true, readOnly: false },
      { id: '2', label: 'Email Address', type: 'email', required: true, readOnly: false },
      { id: '3', label: 'Phone Number', type: 'tel', required: false, readOnly: false },
      { id: '4', label: 'Relationship to School', type: 'select', required: false, readOnly: false, options: ['Parent', 'Alumni', 'Teacher', 'Community Member', 'Other'] },
      { id: '5', label: 'Message of Support', type: 'text', required: false, readOnly: false },
      { id: 'payment_amount', label: 'Contribution Amount (FCFA)', type: 'number', required: true, readOnly: false, min: 500 },
      { id: 'phone_momo', label: 'MTN MoMo Phone Number', type: 'tel', required: true, readOnly: false, placeholder: '6XXXXXXXX' },
      { id: 'phone_om', label: 'Orange Money Phone Number', type: 'tel', required: true, readOnly: false, placeholder: '6XXXXXXXX' }
    ],
    paymentMethods: ['momo', 'om', 'visa'],
    formColors: { primary: '#10b981', secondary: '#34d399', text: '#064e3b', background: '#f0fdf4'
    },
    walletType: 'app_wallet',
    fundraisingGoal: 500000,
    deadline: '2024-12-31T23:59:59Z',
    contributorMessage: 'Thank you so much for your generous contribution to our school library project! Your support means the world to our students and will help create a brighter future for education in our community. We will keep you updated on our progress.',
    receiptConfig: {
      includeFields: ['1', '2', 'payment_amount'],
      includeQR: true,
      additionalFields: {},
      school: {
        name: 'École Primaire de Yaoundé',
        link: 'https://school-website.com',
        contact: '+237 699 123 456',
        logoUrl: '/public/A1.jpg',
      },
      layout: 'one',
      align: 'left',
    },
    eventCard: {
      image: '',
      title: '',
      description: ''
    }
  };
};

const ContributorView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // State management
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);

  // Load event data on mount
  useEffect(() => {
    if (slug) {
      // Simulate API call
      const mockData = getMockEventData(slug);
      setEventData(mockData);
    }
  }, [slug]);

  // Event type configuration
  const eventTypeConfig = {
    school: { icon: School, name: 'School Event', color: 'from-blue-500 to-indigo-600' },
    wedding: { icon: Heart, name: 'Wedding', color: 'from-pink-500 to-rose-600' },
    funeral: { icon: Flower2, name: 'Funeral', color: 'from-gray-500 to-slate-600' },
    birthday: { icon: PartyPopper, name: 'Birthday', color: 'from-yellow-500 to-orange-600' },
    business: { icon: Building2, name: 'Business', color: 'from-green-500 to-emerald-600' },
    charity: { icon: Users, name: 'Charity', color: 'from-teal-500 to-cyan-600' },
    conference: { icon: GraduationCap, name: 'Conference', color: 'from-purple-500 to-violet-600' },
    other: { icon: Calendar, name: 'Other', color: 'from-gray-500 to-slate-600' }
  };

  // Payment method configuration
  const paymentMethodConfig = {
    momo: { name: 'MTN MoMo', icon: <Smartphone className="w-5 h-5" />, color: 'from-yellow-400 to-yellow-600' },
    om: { name: 'Orange Money', icon: <Smartphone className="w-5 h-5" />, color: 'from-orange-400 to-orange-600' },
    visa: { name: 'Visa/Mastercard', icon: <CreditCard className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
    app_wallet: { name: 'App Wallet', icon: <Wallet className="w-5 h-5" />, color: 'from-purple-400 to-purple-600' }
  };

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const colors = eventData.formColors;
  const eventTypeInfo = eventTypeConfig[eventData.eventType as keyof typeof eventTypeConfig];
  const EventIcon = eventTypeInfo.icon;

  // Form validation
  const validateStep = (step: number) => {
    let newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validate personal information fields
      eventData.fields
        .filter(field => !field.id.startsWith('payment_') && !field.id.startsWith('phone_'))
        .forEach(field => {
          if (field.required && !formValues[field.id]?.trim()) {
            newErrors[field.id] = `${field.label} is required`;
          }
          
          // Email validation
          if (field.type === 'email' && formValues[field.id]) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues[field.id])) {
              newErrors[field.id] = 'Please enter a valid email address';
            }
          }
          
          // Phone validation
          if (field.type === 'tel' && formValues[field.id]) {
            const phoneRegex = /^[6-9]\d{8}$/;
            if (!phoneRegex.test(formValues[field.id].replace(/\s+/g, ''))) {
              newErrors[field.id] = 'Please enter a valid phone number';
            }
          }
        });
    } else if (step === 2) {
      // Validate payment information
      if (!selectedPaymentMethod) {
        newErrors['paymentMethod'] = 'Please select a payment method';
      }
      
      const amountField = eventData.fields.find(f => f.id === 'payment_amount');
      if (amountField && !formValues['payment_amount']) {
        newErrors['payment_amount'] = 'Contribution amount is required';
      } else if (amountField && formValues['payment_amount']) {
        const amount = Number(formValues['payment_amount']);
        if (amount < (amountField.min || 500)) {
          newErrors['payment_amount'] = `Minimum contribution is ${amountField.min || 500} FCFA`;
        }
      }
      
      // Validate phone numbers for mobile money
      if (selectedPaymentMethod === 'momo' && !formValues['phone_momo']) {
        newErrors['phone_momo'] = 'MTN MoMo phone number is required';
      }
      if (selectedPaymentMethod === 'om' && !formValues['phone_om']) {
        newErrors['phone_om'] = 'Orange Money phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  // Check if conditional field should be displayed
  const shouldDisplayField = (field: FormField) => {
    if (field.type !== 'conditional' || !field.condition) return true;
    const targetValue = formValues[field.condition.fieldId];
    return targetValue === field.condition.value;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Collect all contribution data
    const contribution = {
      eventSlug: slug,
      eventType: eventData.eventType,
      eventName: eventData.eventName,
      contributorInfo: formValues,
      paymentMethod: selectedPaymentMethod,
      amount: formValues['payment_amount'],
      timestamp: new Date().toISOString(),
      receiptId: `RCP-${Date.now()}`
    };
    
    setContributionData(contribution);
    console.log('Contribution submitted:', contribution);
    
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // Generate receipt download
  const handleDownloadReceipt = () => {
    // In real app, this would generate and download a PDF receipt
    const { receiptConfig } = eventData;
    if (!receiptConfig) {
      console.warn('Receipt configuration is missing; cannot generate receipt.');
      alert('Receipt configuration is missing; cannot generate receipt.');
      return;
    }

    const receiptData = {
      ...contributionData,
      school: receiptConfig.school,
      fields: (receiptConfig.includeFields ?? []).map(fieldId => {
        const field = eventData.fields.find(f => f.id === fieldId);
        return {
          label: field?.label,
          value: formValues[fieldId]
        };
      })
    };
    
    console.log('Receipt data:', receiptData);
    alert('Receipt download started! (Simulated)');
  };

  // Render form field
  const renderField = (field: FormField) => {
    if (!shouldDisplayField(field)) return null;
    
    const hasError = errors[field.id];
    
    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <label 
          className="block text-sm font-medium"
          style={{ color: colors.text }}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'select' ? (
          <select
            className={`w-full p-3 border-2 rounded-xl transition-all focus:ring-4 ${
              hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'focus:ring-opacity-20'
            }`}
            style={{ 
              borderColor: hasError ? undefined : colors.secondary,
            }}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          >
            <option value="">Select {field.label.toLowerCase()}...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className={`w-full p-3 border-2 rounded-xl transition-all focus:ring-4 ${
              hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'focus:ring-opacity-20'
            }`}
            style={{ 
              borderColor: hasError ? undefined : colors.secondary,
            }}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formValues[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            min={field.type === 'number' ? field.min : undefined}
            max={field.type === 'number' ? field.max : undefined}
            readOnly={field.readOnly}
          />
        )}
        
        {hasError && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm flex items-center space-x-1"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{hasError}</span>
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Event Type Badge */}
          <div className="flex justify-center mb-4">
            <div 
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${eventTypeInfo.color} text-white shadow-lg`}
            >
              <EventIcon className="w-5 h-5" />
              <span className="font-medium">{eventTypeInfo.name}</span>
            </div>
          </div>
          
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            {eventData.eventTitle || eventData.eventName}
          </h1>
          
          {eventData.eventDescription && (
            <p 
              className="text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: colors.text }}
            >
              {eventData.eventDescription}
            </p>
          )}
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-all ${
                  currentStep >= 1 ? 'shadow-lg' : ''
                }`}
                style={{ backgroundColor: currentStep >= 1 ? colors.primary : colors.secondary + '50' }}
              >
                1
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Information
              </span>
            </div>
            
            <div 
              className="w-16 h-1 rounded-full transition-all"
              style={{ backgroundColor: currentStep >= 2 ? colors.primary : colors.secondary + '30' }}
            />
            
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-all ${
                  currentStep >= 2 ? 'shadow-lg' : ''
                }`}
                style={{ backgroundColor: currentStep >= 2 ? colors.primary : colors.secondary + '50' }}
              >
                2
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Payment
              </span>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                  📝 Your Information
                </h3>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  Please fill in your details below
                </p>
              </div>

              {eventData.fields
                .filter(field => !field.id.startsWith('payment_') && !field.id.startsWith('phone_'))
                .map(field => renderField(field))}
            </motion.div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                  💳 Payment Details
                </h3>
                <p className="text-sm opacity-70" style={{ color: colors.text }}>
                  Choose your payment method and enter the amount
                </p>
              </div>

              {/* Contribution Amount */}
              {eventData.fields
                .filter(field => field.id === 'payment_amount')
                .map(field => renderField(field))}

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label 
                  className="block text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Select Payment Method <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 gap-3">
                  {eventData.paymentMethods.map(method => {
                    const methodInfo = paymentMethodConfig[method as keyof typeof paymentMethodConfig];
                    const isSelected = selectedPaymentMethod === method;
                    
                    return (
                      <motion.div
                        key={method}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'shadow-lg ring-4 ring-opacity-20' : 'hover:shadow-md'
                        }`}
                        style={{
                          borderColor: isSelected ? colors.primary : colors.secondary,
                          backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
                          ...(isSelected ? ({ ['--tw-ring-color' as any]: colors.primary + '33' } as React.CSSProperties) : {}),
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${methodInfo.color} flex items-center justify-center text-white shadow-md`}>
                          {methodInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold" style={{ color: colors.text }}>
                            {methodInfo.name}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {errors['paymentMethod'] && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors['paymentMethod']}</span>
                  </motion.p>
                )}
              </div>

              {/* Phone Number Fields for Mobile Money */}
              <AnimatePresence>
                {selectedPaymentMethod && (selectedPaymentMethod === 'momo' || selectedPaymentMethod === 'om') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {eventData.fields
                      .filter(field => 
                        (selectedPaymentMethod === 'momo' && field.id === 'phone_momo') ||
                        (selectedPaymentMethod === 'om' && field.id === 'phone_om')
                      )
                      .map(field => renderField(field))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: colors.secondary + '30' }}>
            {currentStep > 1 ? (
              <motion.button
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: colors.secondary + '20',
                  color: colors.text
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 2 ? (
              <motion.button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                style={{ backgroundColor: '#10b981' }}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Contribution</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
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
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Thank You!</h3>
                
                <div className="text-gray-600 mb-6 leading-relaxed">
                  {eventData.contributorMessage}
                </div>

                <div className="space-y-4">
                  {/* Download Receipt for School Events */}
                  {eventData.eventType === 'school' && (
                    <motion.button
                      onClick={handleDownloadReceipt}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Receipt</span>
                    </motion.button>
                  )}

                  {/* Join Application Link */}
                  <motion.button
                    onClick={() => navigate('/signup')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Create Your Own Event</span>
                  </motion.button>

                  <button
                    onClick={() => setShowSuccess(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContributorView;