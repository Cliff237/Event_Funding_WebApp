import { AnimatePresence, motion } from 'framer-motion';
import type { EventFormData, FormField } from './Events/type';
import Modal from './Modal';
import { useState } from 'react';

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

  /** validate current step */
  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    if (currentStep === 0) {
      formData.fields.forEach((field) => {
        if (field.required && !formValues[field.id]) {
          newErrors[field.id] = `${field.label} is required`;
        }
      });
    } else if (currentStep === 1) {
      if (!selectedMethod) newErrors['paymentMethod'] = 'Please select a payment method';
      if (!formValues['amount']) newErrors['amount'] = 'Payment amount is required';
      if ((selectedMethod === 'momo' || selectedMethod === 'om') && !formValues['phone']) {
        newErrors['phone'] = 'Phone number is required for mobile money';
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
  };

  /** check if a conditional field should display */
  const shouldDisplayField = (field: FormField) => {
    if (field.type !== 'conditional' || !field.condition) return true;
    const targetValue = formValues[field.condition.fieldId];
    return targetValue === field.condition.value;
  };

  return (
    <div>
      <AnimatePresence>
        <Modal isOpen={showPreview} onClose={() => setShowPreview(false)}>
          <div
            className="p-6 rounded-lg border-2 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: formData.formColors.background || '#fff',
              borderColor: formData.formColors.primary || '#2563eb',
              color: formData.formColors.text || '#111',
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: formData.formColors.primary }}
            >
              {formData.eventTitle || formData.eventName || 'Event Form'}
            </h2>

            {/* Step Navigation */}
            <div className="flex items-center justify-center mb-6 space-x-4">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  currentStep === 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                1
              </div>
              <div className="w-12 h-1 bg-gray-300"></div>
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  currentStep === 1 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                2
              </div>
            </div>

            {/* Step 1: Form Details */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                {formData.fields.map((field) =>
                  shouldDisplayField(field) ? (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-2">
                        {field.label}{' '}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'image' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <p className="text-gray-500">Click to upload image</p>
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          className="w-full p-3 border rounded-lg"
                          required={field.required}
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
                          className="w-full p-3 border rounded-lg"
                          placeholder={
                            field.placeholder || `Enter ${field.label.toLowerCase()}`
                          }
                          required={field.required}
                          readOnly={field.readOnly || false}
                          value={formValues[field.id] || field.defaultValue || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                      )}
                      {errors[field.id] && (
                        <p className="text-red-500 text-sm">{errors[field.id]}</p>
                      )}
                    </div>
                  ) : null
                )}
              </motion.div>
            )}

            {/* Step 2: Payment Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h3 className="text-xl font-bold mb-4">Payment Details</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Select Payment Method
                  </label>
                  <div className="space-y-3">
                    {formData.paymentMethods.map((method) => {
                      let methodInfo;
                      switch (method) {
                        case 'momo':
                          methodInfo = { name: 'MTN MoMo', color: 'bg-yellow-500' };
                          break;
                        case 'om':
                          methodInfo = { name: 'Orange Money', color: 'bg-orange-500' };
                          break;
                        case 'visa':
                          methodInfo = { name: 'Visa/Mastercard', color: 'bg-blue-500' };
                          break;
                        default:
                          methodInfo = { name: method, color: 'bg-gray-500' };
                      }

                      return (
                        <div
                          key={method}
                          onClick={() => setSelectedMethod(method)}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                            selectedMethod === method
                              ? 'border-blue-500 bg-blue-50'
                              : 'bg-white'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full ${methodInfo.color}`}></div>
                          <span className="font-medium">{methodInfo.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  {errors['paymentMethod'] && (
                    <p className="text-red-500 text-sm">{errors['paymentMethod']}</p>
                  )}
                </div>

                {selectedMethod && (
                  <div className="space-y-4">
                    {/* Payment Amount (conditional too) */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payment Amount
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter amount"
                        value={formValues['amount'] || ''}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        required
                      />
                      {errors['amount'] && (
                        <p className="text-red-500 text-sm">{errors['amount']}</p>
                      )}
                    </div>

                    {/* Phone only for MoMo/OM */}
                    {(selectedMethod === 'momo' || selectedMethod === 'om') && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 border rounded-lg"
                          placeholder="Enter your phone number"
                          value={formValues['phone'] || ''}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                        />
                        {errors['phone'] && (
                          <p className="text-red-500 text-sm">{errors['phone']}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {currentStep < 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (validateStep()) {
                      alert('Form submitted successfully 🎉');
                      setShowPreview(false);
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </Modal>
      </AnimatePresence>
    </div>
  );
}

export default CreateEventFormView;
