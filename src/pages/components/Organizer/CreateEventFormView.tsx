import { AnimatePresence, motion } from 'framer-motion';
import type { EventFormData, FormField } from './Events/type';
import Modal from './Modal';
import { useState } from 'react';
import { CheckCircle, CreditCard, Smartphone, Wallet, ArrowRight, ArrowLeft } from 'lucide-react';

interface EventFormProps {
  formData: EventFormData;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateEventFormView({ formData, setShowPreview, showPreview }: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Use form colors from CreateFormCustomization
  const colors = formData.formColors || {
    primary: '#7c3aed',
    secondary: '#a855f7',
    text: '#1f2937',
    background: '#f9fafb'
  };

  /** validate current step */
  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Validate regular form fields (excluding payment fields)
      formData.fields
        .filter(field => !field.id.startsWith('payment_') && !field.id.startsWith('phone_'))
        .forEach((field) => {
          if (field.required && !formValues[field.id]) {
            newErrors[field.id] = `${field.label} is required`;
          }
        });
    } else if (currentStep === 1) {
      // Validate payment step
      if (!selectedMethod) {
        newErrors['paymentMethod'] = 'Please select a payment method';
      }
      
      // Validate payment amount
      const amountField = formData.fields.find(f => f.id === 'payment_amount');
      if (amountField && !formValues['payment_amount']) {
        newErrors['payment_amount'] = 'Payment amount is required';
      }
      
      // Validate phone numbers for mobile money
      if (selectedMethod === 'momo') {
        const momoPhoneField = formData.fields.find(f => f.id === 'phone_momo');
        if (momoPhoneField && !formValues['phone_momo']) {
          newErrors['phone_momo'] = 'MTN MoMo phone number is required';
        }
      }
      
      if (selectedMethod === 'om') {
        const omPhoneField = formData.fields.find(f => f.id === 'phone_om');
        if (omPhoneField && !formValues['phone_om']) {
          newErrors['phone_om'] = 'Orange Money phone number is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  /** check if a conditional field should display */
  const shouldDisplayField = (field: FormField) => {
    if (field.type !== 'conditional' || !field.condition) return true;
    const targetValue = formValues[field.condition.fieldId];
    return targetValue === field.condition.value;
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'momo':
        return { 
          name: 'MTN MoMo', 
          color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          icon: <Smartphone className="w-5 h-5" />,
          desc: 'Mobile Money Payment'
        };
      case 'om':
        return { 
          name: 'Orange Money', 
          color: 'bg-gradient-to-r from-orange-400 to-orange-600',
          icon: <Smartphone className="w-5 h-5" />,
          desc: 'Mobile Money Payment'
        };
      case 'visa':
        return { 
          name: 'Visa/Mastercard', 
          color: 'bg-gradient-to-r from-blue-400 to-blue-600',
          icon: <CreditCard className="w-5 h-5" />,
          desc: 'Credit/Debit Card'
        };
      case 'app_wallet':
        return { 
          name: 'App Wallet', 
          color: 'bg-gradient-to-r from-purple-400 to-purple-600',
          icon: <Wallet className="w-5 h-5" />,
          desc: 'In-app Balance'
        };
      default:
        return { 
          name: method, 
          color: 'bg-gradient-to-r from-gray-400 to-gray-600',
          icon: <CreditCard className="w-5 h-5" />,
          desc: 'Payment Method'
        };
    }
  };

  const renderFormField = (field: FormField) => {
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
        
        {field.type === 'image' ? (
          <div 
            className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:border-opacity-60"
            style={{ borderColor: colors.secondary }}
          >
            <div className="text-4xl mb-2">📷</div>
            <p style={{ color: colors.text }} className="opacity-70">
              Click to upload image
            </p>
          </div>
        ) : field.type === 'select' ? (
          <select
            className={`w-full p-3 border-2 rounded-xl transition-all focus:ring-4 ${
              hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'focus:ring-opacity-20'
            }`}
            style={{ 
              borderColor: hasError ? undefined : colors.secondary,
              focusBorderColor: colors.primary,
              focusRingColor: colors.primary + '33'
            }}
            value={formValues[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
          >
            <option value="">Select option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
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
              focusBorderColor: colors.primary,
              focusRingColor: colors.primary + '33'
            }}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            readOnly={field.readOnly || false}
            value={formValues[field.id] || field.defaultValue || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            min={field.type === 'number' ? field.min : undefined}
            max={field.type === 'number' ? field.max : undefined}
          />
        )}
        
        {hasError && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm flex items-center space-x-1"
          >
            <span>⚠️</span>
            <span>{hasError}</span>
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div>
      <AnimatePresence>
        <Modal isOpen={showPreview} onClose={() => setShowPreview(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-2xl border-2 max-h-[85vh] overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              color: colors.text,
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-3"
                style={{ color: colors.primary }}
              >
                {formData.eventTitle || formData.eventName || 'Event Form'}
              </motion.h2>
              
              {formData.eventDescription && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg opacity-80 leading-relaxed"
                  style={{ color: colors.text }}
                >
                  {formData.eventDescription}
                </motion.p>
              )}
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-center mb-8 space-x-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-all ${
                    currentStep >= 0 ? 'shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: currentStep >= 0 ? colors.primary : colors.secondary + '50'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  1
                </motion.div>
                <span className="text-sm font-medium" style={{ color: colors.text }}>
                  Form Details
                </span>
              </div>
              
              <div 
                className="w-16 h-1 rounded-full transition-all"
                style={{ backgroundColor: currentStep >= 1 ? colors.primary : colors.secondary + '30' }}
              />
              
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-all ${
                    currentStep >= 1 ? 'shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: currentStep >= 1 ? colors.primary : colors.secondary + '50'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  2
                </motion.div>
                <span className="text-sm font-medium" style={{ color: colors.text }}>
                  Payment
                </span>
              </div>
            </div>

            {/* Step 1: Form Details */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                    📝 Personal Information
                  </h3>
                  <p className="text-sm opacity-70" style={{ color: colors.text }}>
                    Please fill in your details below
                  </p>
                </div>

                {formData.fields
                  .filter(field => !field.id.startsWith('payment_') && !field.id.startsWith('phone_'))
                  .map((field) =>
                    shouldDisplayField(field) ? renderFormField(field) : null
                  )}
              </motion.div>
            )}

            {/* Step 2: Payment Details */}
            {currentStep === 1 && (
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

                {/* Payment Amount Field */}
                {formData.fields
                  .filter(field => field.id === 'payment_amount')
                  .map(field => renderFormField(field))}

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <label 
                    className="block text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    Select Payment Method <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {formData.paymentMethods.map((method) => {
                      const methodInfo = getPaymentMethodInfo(method);
                      const isSelected = selectedMethod === method;
                      
                      return (
                        <motion.div
                          key={method}
                          onClick={() => setSelectedMethod(method)}
                          className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            isSelected ? 'shadow-lg ring-4 ring-opacity-20' : 'hover:shadow-md'
                          }`}
                          style={{
                            borderColor: isSelected ? colors.primary : colors.secondary,
                            backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
                            ringColor: colors.primary + '33'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-12 h-12 rounded-xl ${methodInfo.color} flex items-center justify-center text-white shadow-md`}>
                            {methodInfo.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: colors.text }}>
                              {methodInfo.name}
                            </div>
                            <div className="text-sm opacity-70" style={{ color: colors.text }}>
                              {methodInfo.desc}
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
                      <span>⚠️</span>
                      <span>{errors['paymentMethod']}</span>
                    </motion.p>
                  )}
                </div>

                {/* Phone Number Fields for Mobile Money */}
                <AnimatePresence>
                  {selectedMethod && (selectedMethod === 'momo' || selectedMethod === 'om') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {formData.fields
                        .filter(field => 
                          (selectedMethod === 'momo' && field.id === 'phone_momo') ||
                          (selectedMethod === 'om' && field.id === 'phone_om')
                        )
                        .map(field => renderFormField(field))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: colors.secondary + '30' }}>
              {currentStep > 0 ? (
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
              
              {currentStep < 1 ? (
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
                  onClick={() => {
                    if (validateStep()) {
                      // Show success animation
                      const successDiv = document.createElement('div');
                      successDiv.innerHTML = `
                        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                                    z-index: 9999; text-align: center;">
                          <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                          <h3 style="font-size: 1.5rem; font-weight: bold; color: ${colors.primary}; margin-bottom: 0.5rem;">
                            Form Submitted Successfully!
                          </h3>
                          <p style="color: ${colors.text}; opacity: 0.8;">Thank you for your contribution!</p>
                        </div>
                      `;
                      document.body.appendChild(successDiv);
                      
                      setTimeout(() => {
                        document.body.removeChild(successDiv);
                        setShowPreview(false);
                      }, 2000);
                    }
                  }}
                  className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#10b981' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Contribution</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </Modal>
      </AnimatePresence>
    </div>
  );
}

export default CreateEventFormView;