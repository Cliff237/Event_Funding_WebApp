import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Palette, 
  CreditCard, 
  School, 
  Heart, 
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Share2,
  Copy,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  GraduationCap,
  PartyPopper,
  Flower2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle
} from 'lucide-react';

// Types and Interfaces
type EventType = 'school' | 'wedding' | 'funeral' | 'birthday' | 'business' | 'charity' | 'conference' | 'other';
type FieldType = 'text' | 'number' | 'image' | 'select' | 'email' | 'tel' | 'conditional';
type PaymentMethod = 'momo' | 'om' | 'visa' | 'app_wallet';

interface School {
  id: string;
  name: string;
  logo: string;
  email: string;
  contact: string;
  location: string;
}

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  condition?: {
    fieldId: number | string;
    value: string;
  };
  min?: number;
  max?: number;
  fixedValue?: boolean;
}

interface EventFormData {
  eventType: EventType;
  schoolId?: string;
  organizerName: string;
  organizerPassword: string;
  eventName: string;
  fields: FormField[];
  paymentMethods: PaymentMethod[];
  formColors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  eventTitle: string;
  eventDescription: string;
  walletType: 'app_wallet' | 'bank_account';
  bankAccountId?: string;
  fundraisingGoal: number;
  deadline: string;
  contributorMessage: string;
  receiptConfig?: {
    includeFields: string[];
    includeQR: boolean;
    includeSchoolInfo: boolean;
    additionalFields: Record<string, string>;
  };
  eventCard: {
    image: string;
    title: string;
    description: string;
  };
}

const CreateEventPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [eventNameError, setEventNameError] = useState('');
  const [goalError, setGoalError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  
  const [formData, setFormData] = useState<EventFormData>({
    eventType: 'school',
    organizerName: '',
    organizerPassword: '',
    eventName: '',
    fields: [
      { id: '1', label: 'Payer Name', type: 'text', required: true },
      { id: '2', label: 'Amount', type: 'number', required: true }
    ],
    paymentMethods: ['momo', 'om'],
    formColors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      text: '#1f2937',
      background: '#f9fafb'
    },
    eventTitle: '',
    eventDescription: '',
    walletType: 'app_wallet',
    fundraisingGoal: 0,
    deadline: '',
    contributorMessage: '',
    receiptConfig: {
      includeFields: [],
      includeQR: true,
      includeSchoolInfo: true,
      additionalFields: {}
    },
    eventCard: {
      image: '',
      title: '',
      description: ''
    }
  });

  const schools: School[] = [
    { id: '1', name: 'Université de Yaoundé I', logo: '🎓', email: 'info@uy1.cm', contact: '+237123456789', location: 'Yaoundé' },
    { id: '2', name: 'École Normale Supérieure', logo: '📚', email: 'ens@cameroon.edu', contact: '+237987654321', location: 'Yaoundé' },
    { id: '3', name: 'Collège Vogt', logo: '🏫', email: 'vogt@edu.cm', contact: '+237456789123', location: 'Yaoundé' }
  ];

  const eventTypes = [
    { id: 'school', name: 'School Event', icon: School, color: 'from-blue-500 to-indigo-600' },
    { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { id: 'funeral', name: 'Funeral', icon: Flower2, color: 'from-gray-500 to-slate-600' },
    { id: 'birthday', name: 'Birthday', icon: PartyPopper, color: 'from-yellow-500 to-orange-600' },
    { id: 'business', name: 'Business', icon: Building2, color: 'from-green-500 to-emerald-600' },
    { id: 'charity', name: 'Charity', icon: Users, color: 'from-teal-500 to-cyan-600' },
    { id: 'conference', name: 'Conference', icon: GraduationCap, color: 'from-purple-500 to-violet-600' },
    { id: 'other', name: 'Other', icon: Calendar, color: 'from-gray-500 to-slate-600' }
  ];

  const selectedSchool = schools.find(s => s.id === formData.schoolId);

  // Validate event name
  useEffect(() => {
    if (formData.eventName && formData.eventName.length < 3) {
      setEventNameError('Event name must be at least 3 characters');
    } else {
      setEventNameError('');
    }
  }, [formData.eventName]);

  // Validate fundraising goal
  useEffect(() => {
    if (formData.fundraisingGoal > 0 && formData.fundraisingGoal < 5000) {
      setGoalError('Fundraising goal cannot be less than 5000 FCFA');
    } else {
      setGoalError('');
    }
  }, [formData.fundraisingGoal]);

  // Validate deadline
  useEffect(() => {
    if (formData.deadline) {
      const now = new Date();
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= now) {
        setDeadlineError('Deadline must be in the future');
      } else {
        setDeadlineError('');
      }
    }
  }, [formData.deadline]);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      required: false
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (id: string) => {
    if (formData.fields.length <= 2) return; // Keep minimum 2 fields
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const addConditionalField = (fieldId: string) => {
    const conditionalField: FormField = {
      id: Date.now().toString(),
      label: 'Conditional Field',
      type: 'conditional',
      required: false,
      condition: {
        fieldId: fieldId,
        value: ''
      }
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, conditionalField]
    }));
  };

  const handleConfirmEvent = () => {
    console.log('Complete Event Data:', formData);
    setShowConfirmation(false);
    // Here you would typically submit to your backend
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://shaderlpay.com/event/123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const EventTypeSelector = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Choose Event Type
        </h2>
        <p className="text-gray-600 mt-2">Select the type of event you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {eventTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                formData.eventType === type.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => {
                setFormData(prev => ({ ...prev, eventType: type.id as EventType }));
                if (type.id === 'school') {
                  setShowSchoolModal(true);
                } else {
                  setCurrentStep(2);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{type.name}</h3>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  const SchoolSelectionModal = () => (
    <AnimatePresence>
      {showSchoolModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">School Event Setup</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select School</label>
                <div className="flex items-center space-x-3 mb-2">
                  {selectedSchool && (
                    <div className="text-2xl">{selectedSchool.logo}</div>
                  )}
                  <select
                    className="flex-1 p-3 border rounded-lg"
                    value={formData.schoolId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
                  >
                    <option value="">Choose a school...</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedSchool && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{selectedSchool.logo}</div>
                  <div>
                    <p className="font-medium">{selectedSchool.name}</p>
                    <p className="text-sm text-gray-600">{selectedSchool.location}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Organizer Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={formData.organizerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizerName: e.target.value }))}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg"
                  value={formData.organizerPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizerPassword: e.target.value }))}
                  placeholder="Organizer password"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                onClick={() => setShowSchoolModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                disabled={!formData.schoolId || !formData.organizerName || !formData.organizerPassword}
                onClick={() => {
                  setShowSchoolModal(false);
                  setCurrentStep(2);
                }}
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const CustomEventFields = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Customize Event Fields
        </h2>
        <p className="text-gray-600 mt-2">Add and configure the fields for your event form</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Event Name *</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={formData.eventName}
          onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
          placeholder="Enter unique event name"
        />
        {eventNameError && <p className="text-red-500 text-sm mt-1">{eventNameError}</p>}
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Form Fields</h3>
          <div className="space-x-2">
            <button
              onClick={addField}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
            <button
              onClick={() => addConditionalField(formData.fields[0]?.id || '')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Conditional Field</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {formData.fields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {field.type === 'conditional' ? 'Conditional Field' : `Field ${index + 1}`}
                </span>
                {index >= 2 && (
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Field Label"
                  className="p-2 border rounded"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                />
                <select
                  className="p-2 border rounded"
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="image">Image</option>
                  <option value="select">Select</option>
                  <option value="conditional">Conditional</option>
                </select>
              </div>
              
              {field.type === 'conditional' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Condition Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      className="p-2 border rounded"
                      value={field.condition?.fieldId || ''}
                      onChange={(e) => updateField(field.id, { 
                        condition: { 
                          fieldId: e.target.value,
                          value: field.condition?.value ?? ''
                        } 
                      })}
                    >
                      <option value="">Select field...</option>
                      {formData.fields
                        .filter(f => f.id !== field.id && f.type !== 'conditional')
                        .map(f => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))
                      }
                    </select>
                    <input
                      type="text"
                      placeholder="Expected value"
                      className="p-2 border rounded"
                      value={field.condition?.value || ''}
                      onChange={(e) => updateField(field.id, { 
                        condition: { 
                          fieldId: field.condition?.fieldId ?? '',
                          value: e.target.value 
                        } 
                      })}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    disabled={index < 2}
                  />
                  <span className="text-sm">Required</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'momo', name: 'MTN MoMo', color: 'bg-yellow-500' },
            { id: 'om', name: 'Orange Money', color: 'bg-orange-500' },
            { id: 'visa', name: 'Visa Card', color: 'bg-blue-500' },
            { id: 'app_wallet', name: 'App Wallet', color: 'bg-purple-500' }
          ].map(method => (
            <label key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.paymentMethods.includes(method.id as PaymentMethod)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, paymentMethods: [...prev.paymentMethods, method.id as PaymentMethod] }));
                  } else {
                    setFormData(prev => ({ ...prev, paymentMethods: prev.paymentMethods.filter(m => m !== method.id) }));
                  }
                }}
              />
              <div className={`w-4 h-4 rounded ${method.color}`}></div>
              <span className="text-sm">{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Form</span>
        </button>
      </div>
    </motion.div>
  );

  const PreviewModal = () => (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Form Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Details Section */}
              <div 
                className="p-6 rounded-lg border-2"
                style={{ 
                  backgroundColor: formData.formColors.background,
                  borderColor: formData.formColors.primary 
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: formData.formColors.primary }}
                >
                  {formData.eventTitle || formData.eventName || 'Event Form'}
                </h2>
                
                {formData.eventDescription && (
                  <p className="text-gray-600 mb-6">{formData.eventDescription}</p>
                )}

                <div className="space-y-4">
                  {formData.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'image' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <p className="text-gray-500">Click to upload image</p>
                        </div>
                      ) : field.type === 'select' ? (
                        <select className="w-full p-3 border rounded-lg">
                          <option>Select option...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full p-3 border rounded-lg"
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Payment Method</label>
                  <div className="space-y-3">
                    {formData.paymentMethods.map(method => {
                      let methodInfo;
                      switch(method) {
                        case 'momo':
                          methodInfo = { name: 'MTN MoMo', color: 'bg-yellow-500' };
                          break;
                        case 'om':
                          methodInfo = { name: 'Orange Money', color: 'bg-orange-500' };
                          break;
                        case 'visa':
                          methodInfo = { name: 'Visa/Mastercard', color: 'bg-blue-500' };
                          break;
                        case 'app_wallet':
                          methodInfo = { name: 'App Wallet', color: 'bg-purple-500' };
                          break;
                        default:
                          methodInfo = { name: method, color: 'bg-gray-500' };
                      }
                      
                      return (
                        <div key={method} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                          <div className={`w-5 h-5 rounded-full ${methodInfo.color}`}></div>
                          <span className="font-medium">{methodInfo.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Phone Number (for mobile money)</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <button
                  className="w-full py-3 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: formData.formColors.primary }}
                >
                  Complete Payment
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setCurrentStep(3);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Continue Setup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const FormCustomization = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Customize Form Appearance
        </h2>
        <p className="text-gray-600 mt-2">Personalize the look and feel of your event form</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.eventTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
              placeholder="Display title for the form"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Description</label>
            <textarea
              className="w-full p-3 border rounded-lg h-24"
              value={formData.eventDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
              placeholder="Brief description of the event"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input
                type="color"
                className="w-full h-12 border rounded-lg"
                value={formData.formColors.primary}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  formColors: { ...prev.formColors, primary: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="color"
                className="w-full h-12 border rounded-lg"
                value={formData.formColors.secondary}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  formColors: { ...prev.formColors, secondary: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <input
                type="color"
                className="w-full h-12 border rounded-lg"
                value={formData.formColors.text}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  formColors: { ...prev.formColors, text: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <input
                type="color"
                className="w-full h-12 border rounded-lg"
                value={formData.formColors.background}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  formColors: { ...prev.formColors, background: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Live Preview</h3>
          <div 
            className="p-4 rounded-lg border-2 min-h-[200px]"
            style={{ 
              backgroundColor: formData.formColors.background,
              borderColor: formData.formColors.primary 
            }}
          >
            <h2 
              className="text-xl font-bold mb-2"
              style={{ color: formData.formColors.primary }}
            >
              {formData.eventTitle || 'Event Title'}
            </h2>
            <p 
              className="text-sm mb-4"
              style={{ color: formData.formColors.text }}
            >
              {formData.eventDescription || 'Event description will appear here'}
            </p>
            <div className="space-y-2">
              <div 
                className="h-10 border rounded"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: formData.formColors.secondary
                }}
              ></div>
              <div 
                className="h-10 border rounded"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: formData.formColors.secondary
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const FinalConfiguration = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Final Configuration
        </h2>
        <p className="text-gray-600 mt-2">Set up wallet, goals, and sharing options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Wallet Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.walletType}
              onChange={(e) => setFormData(prev => ({ ...prev, walletType: e.target.value as 'app_wallet' | 'bank_account' }))}
            >
              <option value="app_wallet">App Wallet (Default)</option>
              <option value="bank_account">Bank Account</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fundraising Goal (FCFA)</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={formData.fundraisingGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, fundraisingGoal: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="5000"
            />
            {goalError && <p className="text-red-500 text-sm mt-1">{goalError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
            />
            {deadlineError && <p className="text-red-500 text-sm mt-1">{deadlineError}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contributor Message</label>
            <textarea
              className="w-full p-3 border rounded-lg h-24"
              value={formData.contributorMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, contributorMessage: e.target.value }))}
              placeholder="Thank you message for contributors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Card Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.eventCard.title}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                eventCard: { ...prev.eventCard, title: e.target.value }
              }))}
              placeholder="Card title for sharing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Card Description</label>
            <textarea
              className="w-full p-3 border rounded-lg h-20"
              value={formData.eventCard.description}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                eventCard: { ...prev.eventCard, description: e.target.value }
              }))}
              placeholder="Brief description for the card"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            if (formData.eventType === 'school') {
              setCurrentStep(5);
            } else {
              setShowConfirmation(true);
            }
          }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
          disabled={!!goalError || !!deadlineError}
        >
          <CheckCircle className="w-5 h-5" />
          <span>{formData.eventType === 'school' ? 'Next: Receipt Setup' : 'Create Event'}</span>
        </button>
      </div>
    </motion.div>
  );

  const ReceiptCustomization = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Receipt Customization
        </h2>
        <p className="text-gray-600 mt-2">Customize the payment receipt for your school event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Include Fields on Receipt</h3>
            <div className="space-y-2">
              {formData.fields.map(field => (
                <label key={field.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.receiptConfig?.includeFields?.includes(field.id) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          receiptConfig: {
                            ...prev.receiptConfig!,
                            includeFields: [...(prev.receiptConfig?.includeFields || []), field.id]
                          }
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          receiptConfig: {
                            ...prev.receiptConfig!,
                            includeFields: (prev.receiptConfig?.includeFields || []).filter(id => id !== field.id)
                          }
                        }));
                      }
                    }}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.receiptConfig?.includeQR || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    receiptConfig: {
                      ...prev.receiptConfig!,
                      includeQR: e.target.checked
                    }
                  }))}
                />
                <span>Include QR Code for verification</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.receiptConfig?.includeSchoolInfo || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    receiptConfig: {
                      ...prev.receiptConfig!,
                      includeSchoolInfo: e.target.checked
                    }
                  }))}
                />
                <span>Include School Information</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Receipt Fields</h3>
            <div className="space-y-3">
              {Object.entries(formData.receiptConfig?.additionalFields || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={key}
                    onChange={(e) => {
                      const newFields = {...formData.receiptConfig?.additionalFields};
                      delete newFields[key];
                      newFields[e.target.value] = value;
                      setFormData(prev => ({
                        ...prev,
                        receiptConfig: {
                          ...prev.receiptConfig!,
                          additionalFields: newFields
                        }
                      }));
                    }}
                    placeholder="Field name"
                  />
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      receiptConfig: {
                        ...prev.receiptConfig!,
                        additionalFields: {
                          ...prev.receiptConfig?.additionalFields,
                          [key]: e.target.value
                        }
                      }
                    }))}
                    placeholder="Field value"
                  />
                  <button
                    onClick={() => {
                      const newFields = {...formData.receiptConfig?.additionalFields};
                      delete newFields[key];
                      setFormData(prev => ({
                        ...prev,
                        receiptConfig: {
                          ...prev.receiptConfig!,
                          additionalFields: newFields
                        }
                      }));
                    }}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData(prev => ({
                  ...prev,
                  receiptConfig: {
                    ...prev.receiptConfig!,
                    additionalFields: {
                      ...prev.receiptConfig?.additionalFields,
                      ['New Field']: ''
                    }
                  }
                }))}
                className="flex items-center space-x-2 text-purple-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Receipt Preview</h3>
            <div className="p-4 bg-white border rounded">
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg">Shaderlpay</h4>
                <p className="text-sm text-gray-600">Payment Receipt</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                
                {formData.receiptConfig?.includeSchoolInfo && selectedSchool && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">School:</span>
                      <span>{selectedSchool.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span>{selectedSchool.contact}</span>
                    </div>
                  </>
                )}
                
                {formData.receiptConfig?.includeQR && (
                  <div className="text-center my-4">
                    <div className="inline-block p-2 border">
                      <QrCode className="w-16 h-16 mx-auto" />
                      <p className="text-xs mt-1">Verification QR Code</p>
                    </div>
                  </div>
                )}
                
                <div className="text-center mt-4 text-xs text-gray-500">
                  Generated by Shaderlpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>
    </motion.div>
  );

  const ShareModal = () => (
    <AnimatePresence>
      {showShareModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Share Your Event</h3>
              <p className="text-gray-600">Share your event link with potential contributors</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">https://shaderlpay.com/event/123</span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1 text-purple-600 ml-2"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Share via social media</h4>
              <div className="flex justify-center space-x-4">
                <button className="p-3 bg-blue-600 text-white rounded-full">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-3 bg-blue-400 text-white rounded-full">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-pink-600 text-white rounded-full">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="p-3 bg-green-500 text-white rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Confirm Event Creation</h3>
              <p className="text-gray-600 mb-6">
                Are you ready to create "{formData.eventName}"? 
                This will make your event live and shareable.
              </p>
              
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={() => {
                    handleConfirmEvent();
                    setShowShareModal(true);
                  }}
                >
                  Confirm & Create
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const StepIndicator = () => {
    const steps = [
      { number: 1, title: 'Event Type' },
      { number: 2, title: 'Fields' },
      { number: 3, title: 'Design' },
      { number: 4, title: 'Settings' },
    ];
    
    if (formData.eventType === 'school') {
      steps.push({ number: 5, title: 'Receipt' });
    }

    return (
      <div className="flex justify-center mb-8 ">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => {
                  // Only allow navigation to completed steps
                  const completedSteps = formData.eventType === 'school' ? 
                    (currentStep >= 5 ? 5 : currentStep) : 
                    (currentStep >= 4 ? 4 : currentStep);
                  
                  if (step.number <= completedSteps) {
                    setCurrentStep(step.number);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.number <= currentStep
                    ? 'bg-purple-600 text-white'
                    : step.number <= (formData.eventType === 'school' ? 5 : 4)
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-gray-100 text-gray-400'
                } ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {step.number}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step.number < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const NavigationButtons = () => (
    <div className="flex justify-between mt-8">
      <button
        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        disabled={currentStep === 1}
        className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      {currentStep < (formData.eventType === 'school' ? 5 : 4) && (
        <button
          onClick={() => {
            // Validation for step 2
            if (currentStep === 2) {
              if (!formData.eventName.trim()) {
                setEventNameError('Event name is required');
                return;
              }
              if (formData.eventName.length < 3) {
                setEventNameError('Event name must be at least 3 characters');
                return;
              }
            }
            
            // Validation for step 4
            if (currentStep === 4) {
              if (formData.fundraisingGoal > 0 && formData.fundraisingGoal < 5000) {
                setGoalError('Fundraising goal cannot be less than 5000 FCFA');
                return;
              }
              if (formData.deadline) {
                const now = new Date();
                const deadlineDate = new Date(formData.deadline);
                if (deadlineDate <= now) {
                  setDeadlineError('Deadline must be in the future');
                  return;
                }
              }
            }
            
            setCurrentStep(prev => prev + 1);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br text-gray-700 from-purple-50 to-blue-50 p-4">
      <div className="max-6xl mxauto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600">Set up your event collection in just a few steps</p>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && <EventTypeSelector />}
          {currentStep === 2 && <CustomEventFields />}
          {currentStep === 3 && <FormCustomization />}
          {currentStep === 4 && <FinalConfiguration />}
          {currentStep === 5 && <ReceiptCustomization />}
          
          <NavigationButtons />
        </div>

        <SchoolSelectionModal />
        <PreviewModal />
        <ConfirmationModal />
        <ShareModal />
      </div>
    </div>
  );
};

export default CreateEventPage;