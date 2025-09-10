import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiSmartphone,
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiShield,
  FiLock
} from "react-icons/fi";
import type { EventConfig,PaymentMethod,FormField  } from "../components/Organizer/Events/type";

const ContributorView = ({ event }: { event: EventConfig }) => {
  const [formData, setFormData] = useState<Record<string, any>>(()=>{
     const initialData: Record<string, any> = {};
     event.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    return initialData;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define form steps
  const steps = [
    {
      name: "Event Details",
      fields: event.fields.filter(field => !field.conditional?.fieldId.includes('payment'))
    },
    {
      name: "Payment",
      fields: [
        {
          id: 'payment-method',
          label: 'Payment Method',
          type: 'select',
          required: true,
          options: event.paymentMethods?.map(method => ({
            value: method,
            label: method.toUpperCase()
          })) || []
        },
        ...event.fields.filter(field => field.id.includes('payment-'))
      ]
    }
  ];

  const isFieldVisible = (field: any) => {
    if (!field.conditional) return true;
    const dependentValue = formData[field.conditional.fieldId];
    return field.conditional.values.includes(dependentValue);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    steps[step].fields.forEach(field => {
      if (field.required && !formData[field.id] && isFieldVisible(field)) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)){
      if (currentStep < steps.length - 1) {
        handleNext();
      } else {
        // Form submission logic here
        console.log("Form submitted:", formData);
      }
    }
  };

 
  const renderFieldInput = (field: FormField) => {
  const hasDefaultValue = field.defaultValue !== undefined;
  const isFixed = hasDefaultValue || field.fixedValue;
  const value = hasDefaultValue ? field.defaultValue : formData[field.id] || '';

  const commonProps = {
    value: value,
    className: `w-full p-3 border rounded-lg ${isFixed ? 'bg-gray-100 cursor-not-allowed' : ''}`,
    required: field.required,
    disabled: field.readOnly,
    placeholder: field.label,
    readOnly: field.readOnly,
  };

  switch(field.type) {
    case 'file': // ADD FILE INPUT CASE
      return (
        <div className="space-y-2">
          <input
            type="file"
            accept={field.accept || '*'}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleChange(field.id, file);
                
                // Preview the image if it's an image file
                if (file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setFormData(prev => ({
                      ...prev,
                      [`${field.id}-preview`]: e.target?.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="w-full p-2 border rounded-lg"
          />
          {formData[`${field.id}-preview`] && (
            <div className="mt-2">
              <img 
                src={formData[`${field.id}-preview`]} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    [field.id]: null,
                    [`${field.id}-preview`]: null
                  }));
                }}
                className="mt-1 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      );
       case 'select':
         return (
           <div className="relative">
             <select 
               {...commonProps}
               onChange={(e) => !isFixed && handleChange(field.id, e.target.value)}
             >
               <option value="">Select an option</option>
               {field.options?.map(opt => (
                 <option key={opt} value={opt}>{opt}</option>
               ))}
             </select>
             {isFixed && (
               <FiLock 
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                 size={16}
               />
             )}
           </div>
         );
       case 'radio':
       case 'checkbox':
         return (
           <div className="space-y-2">
             {field.options?.map(opt => (
               <label key={opt} className="flex items-center space-x-2">
                 <input
                   type={field.type}
                   name={field.id}
                   value={opt}
                   checked={value === opt}
                   onChange={(e) => !isFixed && handleChange(field.id, e.target.value)}
                   className={`h-4 w-4 ${isFixed ? 'cursor-not-allowed' : ''}`}
                   disabled={isFixed || field.readOnly}
                 />
                 <span>{opt}</span>
                 {isFixed && <FiLock className="text-gray-400 ml-1" size={14} />}
               </label>
             ))}
           </div>
         );
       default:
         return (
           <div className="relative">
             <input
             key={field.id}
               type={field.type}
               {...commonProps}
               onChange={(e) => !isFixed && handleChange(field.id, e.target.value)}
               min={field.type === 'number' ? field.min : undefined}
               max={field.type === 'number' ? field.max : undefined}
             />
             {isFixed && (
               <FiLock 
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                 size={16}
               />
             )}
           </div>
         );
     }
   };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch(method) {
      case 'momo': return <FiSmartphone className="text-2xl" />;
      case 'om': return <FiPhone className="text-2xl" />;
      case 'bank': return <FiCreditCard className="text-2xl" />;
      default: return <FiDollarSign className="text-2xl" />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div 
      style={{backgroundColor: event.theme.bgColor}}
      className="md:w-xl md:mx-auto p-6 w-[90%] text-gray-700 rounded-lg shadow-lg">
        {/* Event Header */}
        {(event.title||event.description!='') &&(
          <div 
            className="p-3 rounded-xl mb-5  shadow-md"
            style={{ 
              backgroundColor: event.theme.secondaryColor,
              borderColor: event.theme.primaryColor
            }}
          >
            <h2 className="text-2xl text-center font-bold mb-2" style={{ color: event.theme.primaryColor }}>
              {event.title}
            </h2>
            <p className="text-gray-600">{event.description}</p>
          
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${currentStep >= index ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                style={{ backgroundColor: currentStep >= index ? event.theme.primaryColor : undefined }}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${currentStep >= index ? 'font-medium' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Event Details Step */}
              {currentStep === 0 && steps[0].fields
                .filter(field => isFieldVisible(field as FormField))
                .map(field => (
                  <div key={field.id} className="mb-6">
                    <label className="block font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldInput(field as FormField)}
                    {errors[field.id] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                    )}
                    
                    {/* Add image preview for file fields
                    {field.type === 'file' && formData[field.id] && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-green-600">
                          ✓ Image ready for upload
                        </p>
                      </div>
                    )} */}
                  </div>
                ))}

              {/* Payment Step */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Select Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {event.paymentMethods?.map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => handleChange('payment-method', method)}
                          className={`p-3 border-2 rounded-lg flex flex-col items-center transition-all
                            ${formData['payment-method'] === method
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'}`}
                        >
                          {getPaymentMethodIcon(method)}
                          <span className="mt-2 font-medium">
                            {method.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment-specific fields */}
                  <AnimatePresence>
                    {steps[1].fields
                      .filter(field => field.id !== 'payment-method' && isFieldVisible(field as FormField))
                      .map(field => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mb-4"
                        >
                          <label className="block font-medium mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderFieldInput(field as FormField)}
                          {errors[field.id] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>

                  {/* Security Assurance */}
                  <div className="p-4 bg-gray-100 rounded-lg flex items-start">
                    <FiShield className="text-purple-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Secure Payment</h4>
                      <p className="text-sm text-gray-600">
                        Your payment information is encrypted and processed securely.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                <FiChevronLeft className="mr-1" />
                Previous
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center shadow-md hover:shadow-lg transition-shadow"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Continue to Payment <FiChevronRight className="ml-1" />
                </>
              ) : (
                <>
                  Pay Now <FiDollarSign className="ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributorView;