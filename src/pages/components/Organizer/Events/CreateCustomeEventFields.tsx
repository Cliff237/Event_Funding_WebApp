import { Eye, Plus, Trash2, Sparkles, Zap, Settings, GripVertical, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventFormData, FieldType, FormField, PaymentMethod } from './type';
import CreateEventFormView from '../CreateEventFormView';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  eventNameError: string | null;
}

function CreateCustomeEventFields({ formData, eventNameError, setFormData }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);

  // Auto-generate payment fields based on selected payment methods
  useEffect(() => {
    const currentFields = formData.fields;
    const paymentMethods = formData.paymentMethods;
    
    // Remove existing payment fields
    const nonPaymentFields = currentFields.filter(field => 
      !field.id.startsWith('payment_') && !field.id.startsWith('phone_')
    );
    
    let newFields = [...nonPaymentFields];
    
    // Add amount field if any payment method is selected
    if (paymentMethods.length > 0) {
      const amountFieldExists = newFields.some(field => field.id === 'payment_amount');
      if (!amountFieldExists) {
        newFields.push({
          id: 'payment_amount',
          label: 'Contribution Amount (FCFA)',
          type: 'NUMBER',
          required: true,
          readOnly: false,
          min: 100,
          placeholder: 'Enter amount to contribute'
        });
      }
    }
    
    // Add phone number fields for mobile money methods
    if (paymentMethods.includes('MOMO')) {
      const momoPhoneExists = newFields.some(field => field.id === 'phone_momo');
      if (!momoPhoneExists) {
        newFields.push({
          id: 'phone_momo',
          label: 'MTN MoMo Phone Number',
          type: 'TEL',
          required: true,
          readOnly: false,
          placeholder: '6XXXXXXXX'
        });
      }
    }
    
    if (paymentMethods.includes('OM')) {
      const omPhoneExists = newFields.some(field => field.id === 'phone_om');
      if (!omPhoneExists) {
        newFields.push({
          id: 'phone_om',
          label: 'Orange Money Phone Number',
          type: 'TEL',
          required: true,
          readOnly: false,
          placeholder: '6XXXXXXXX'
        });
      }
    }
    
    // Only update if fields have changed
    if (JSON.stringify(currentFields) !== JSON.stringify(newFields)) {
      setFormData(prev => ({
        ...prev,
        fields: newFields
      }));
    }
  }, [formData.paymentMethods, setFormData]);

  // Validation for payment methods
  const hasPaymentMethodError = formData.paymentMethods.length === 0;

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'TEXT',
      required: false,
      readOnly: false,
      options: [],
      min: undefined,
      max: undefined,
      defaultValue: '',
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setActiveField(newField.id);
  };

  const addConditionalField = (fieldId: string) => {
    const conditionalField: FormField = {
      id: Date.now().toString(),
      label: 'Conditional Field',
      type: 'CONDITIONAL',
      required: false,
      readOnly: false,
      condition: {
        fieldId,
        value: '',
      },
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, conditionalField],
    }));
    setActiveField(conditionalField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (id: string) => {
    // Don't allow removal of auto-generated payment fields or minimum required fields
    if (id.startsWith('payment_') || id.startsWith('phone_') || formData.fields.length <= 2) return;
    
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
    if (activeField === id) setActiveField(null);
  };

  const duplicateField = (field: FormField) => {
    const duplicatedField: FormField = {
      ...field,
      id: Date.now().toString(),
      label: `${field.label} (Copy)`,
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, duplicatedField],
    }));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...formData.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFormData((prev) => ({ ...prev, fields: newFields }));
  };

  const fieldTypeOptions = [
    { value: 'TEXT', label: 'Text Input', icon: '📝', desc: 'Single line text' },
    { value: 'NUMBER', label: 'Number', icon: '🔢', desc: 'Numeric input with validation' },
    { value: 'EMAIL', label: 'Email', icon: '📧', desc: 'Email address validation' },
    { value: 'TEL', label: 'Phone', icon: '📱', desc: 'Phone number input' },
    { value: 'IMAGE', label: 'Image Upload', icon: '🖼️', desc: 'File upload for images' },
    { value: 'SELECT', label: 'Dropdown', icon: '📋', desc: 'Multiple choice selection' },
    { value: 'CONDITIONAL', label: 'Conditional', icon: '🔗', desc: 'Shows based on other field' },
  ];

  const paymentMethods = [
    { id: 'MOMO', name: 'MTN MoMo', color: 'from-yellow-400 to-yellow-600', icon: '💳', desc: 'Mobile Money' },
    { id: 'OM', name: 'Orange Money', color: 'from-orange-400 to-orange-600', icon: '🟠', desc: 'Mobile Payment' },
    { id: 'CARD', name: 'Card', color: 'from-blue-400 to-blue-600', icon: '💎', desc: 'Credit/Debit Card' },
    { id: 'BANK', name: 'Bank Transfer', color: 'from-purple-400 to-purple-600', icon: '👛', desc: 'Bank Account' },
  ];

  const getFieldIcon = (type: FieldType) => {
    const option = fieldTypeOptions.find(opt => opt.value === type);
    return option?.icon || '📝';
  };

  const isPaymentField = (fieldId: string) => {
    return fieldId.startsWith('payment_') || fieldId.startsWith('phone_');
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string, index: number) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', fieldId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedField) return;
    
    const dragIndex = formData.fields.findIndex(f => f.id === draggedField);
    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      moveField(dragIndex, dropIndex);
    }
    setDraggedField(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✨ Customize Event Fields
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Design the perfect form for your contributors
        </motion.p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content - Event Name & Fields */}
        <div className="xl:col-span-3 space-y-6">
          {/* Event Name Section */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
                <p className="text-sm text-gray-500">Set up your event name and basic information</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 text-lg ${
                    eventNameError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  } focus:ring-4`}
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, eventName: e.target.value }))
                  }
                  placeholder="Enter a memorable event name..."
                />
                {formData.eventName && !eventNameError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
              <AnimatePresence>
                {eventNameError && (
                  <motion.div 
                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{eventNameError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {formData.eventName && !eventNameError && (
                <motion.div 
                  className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Perfect! Your event name looks great.</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Fields Section */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Form Fields</h3>
                  <p className="text-sm text-gray-500">Customize the information you want to collect</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    showAdvanced 
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' 
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4" />
                  <span>Advanced</span>
                </motion.button>
                
                <motion.button
                  onClick={addField}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Field</span>
                </motion.button>
              </div>
            </div>

            {/* Payment Fields Notice */}
            {formData.paymentMethods.length > 0 && (
              <motion.div 
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2 text-blue-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Payment fields automatically added based on selected payment methods</span>
                </div>
              </motion.div>
            )}

            {/* Fields List */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <AnimatePresence>
                {formData.fields.map((field, index) => {
                  const isDraggable = !isPaymentField(field.id);
                  return (
                  <div
                    key={field.id}
                    className={`group relative p-5 rounded-xl border-2 transition-all duration-200 ${
                      activeField === field.id 
                        ? 'border-purple-300 bg-purple-50 shadow-lg' 
                        : isPaymentField(field.id)
                        ? 'border-green-200 bg-green-50 hover:border-green-300'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    } ${isDraggable ? 'cursor-move' : ''}`}
                    draggable={isDraggable}
                    onDragStart={(e) => handleDragStart(e, field.id, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {/* Field Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                            isPaymentField(field.id) ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-gray-400 to-gray-500' 
                          }`}>
                            {index + 1} 
                          </div>
                          {!isPaymentField(field.id) && <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFieldIcon(field.type)}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{field.label}</span>
                              {isPaymentField(field.id) && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  Auto-generated
                                </span>
                              )}
                              {field.required && (
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                  Required
                                </span>
                              )}
                              {field.readOnly && (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                  Read Only
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 capitalize">
                              {field.type === 'CONDITIONAL' ? '🔗 Conditional Field' : `${field.type.toLowerCase()} field`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveField(activeField === field.id ? null : field.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {activeField === field.id ? (
                            <ChevronUp className="w-5 h-5 text-purple-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </motion.button>
                        
                        {!isPaymentField(field.id) && formData.fields.length > 0 && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Field Settings */}
                    <AnimatePresence>
                      {activeField === field.id && !isPaymentField(field.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 space-y-6"
                        >
                          {/* Basic Settings */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field Label
                              </label>
                              <input
                                type="text"
                                placeholder="Enter field label..."
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                value={field.label}
                                onChange={(e) =>
                                  updateField(field.id, { label: e.target.value })
                                }
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field Type
                              </label>
                              <select
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                value={field.type}
                                onChange={(e) =>
                                  updateField(field.id, { type: e.target.value as FieldType })
                                }
                              >
                                {fieldTypeOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Field Type Specific Settings */}
                          <AnimatePresence>
                            {/* Number field settings */} 
                            {field.type === 'NUMBER' && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                              >
                                <h4 className="font-medium text-blue-800 mb-3 flex items-center space-x-2">
                                  <span>🔢</span>
                                  <span>Number Field Settings</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Min Value</label>
                                    <input
                                      type="number"
                                      placeholder="Minimum"
                                      className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 bg-white"
                                      value={field.min ?? ''}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          min: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Max Value</label>
                                    <input
                                      type="number"
                                      placeholder="Maximum"
                                      className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 bg-white"
                                      value={field.max ?? ''}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          max: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Default Value</label>
                                    <input
                                      type="number"
                                      placeholder="Default"
                                      className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 bg-white"
                                      value={field.defaultValue ?? ''}
                                      onChange={(e) =>
                                        updateField(field.id, { defaultValue: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Select field options */}
                            {field.type === 'SELECT' && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-green-50 rounded-xl border border-green-200"
                              >
                                <h4 className="font-medium text-green-800 mb-3 flex items-center space-x-2">
                                  <span>📋</span>
                                  <span>Dropdown Options</span>
                                </h4>
                                <div className="space-y-3">
                                  <AnimatePresence>
                                    {(field.options ?? []).map((opt, i) => (
                                      <motion.div 
                                        key={i} 
                                        className="flex items-center space-x-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                      >
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-xs">
                                          {i + 1}
                                        </div>
                                        <input
                                          type="text"
                                          className="flex-1 p-2 border border-green-200 rounded-lg focus:border-green-500 bg-white"
                                          value={opt}
                                          onChange={(e) => {
                                            const newOptions = [...(field.options ?? [])];
                                            newOptions[i] = e.target.value;
                                            updateField(field.id, { options: newOptions });
                                          }}
                                          placeholder={`Option ${i + 1}`}
                                        />
                                        <motion.button
                                          onClick={() => {
                                            const newOptions = (field.options ?? []).filter(
                                              (_, idx) => idx !== i
                                            );
                                            updateField(field.id, { options: newOptions });
                                          }}
                                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                  <motion.button
                                    onClick={() =>
                                      updateField(field.id, {
                                        options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`],
                                      })
                                    }
                                    className="w-full p-3 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Option</span>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            {/* Conditional field settings */}
                            {field.type === 'CONDITIONAL' && showAdvanced && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-indigo-50 rounded-xl border border-indigo-200"
                              >
                                <h4 className="font-medium text-indigo-800 mb-3 flex items-center space-x-2">
                                  <span>🔗</span>
                                  <span>Conditional Logic</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-indigo-700 mb-1">Depends on Field</label>
                                    <select
                                      className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 bg-white"
                                      value={field.condition?.fieldId || ''}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          condition: {
                                            fieldId: e.target.value,
                                            value: '',
                                          },
                                        })
                                      }
                                    >
                                      <option value="">Select field...</option>
                                      {formData.fields
                                        .filter((f) => f.id !== field.id && f.type === 'SELECT')
                                        .map((f) => (
                                          <option key={f.id} value={f.id}>
                                            {f.label}
                                          </option>
                                        ))}
                                    </select>
                                  </div>

                                  {field.condition?.fieldId && (
                                    <div>
                                      <label className="block text-sm font-medium text-indigo-700 mb-1">When Value Is</label>
                                      <select
                                        className="w-full p-2 border border-indigo-200 rounded-lg focus:border-indigo-500 bg-white"
                                        value={field.condition?.value || ''}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            condition: {
                                              fieldId: field.condition?.fieldId ?? '',
                                              value: e.target.value,
                                            },
                                          })
                                        }
                                      >
                                        <option value="">Select option...</option>
                                        {formData.fields
                                          .find((f) => f.id === field.condition?.fieldId)
                                          ?.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Field Options */}
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-6">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) =>
                                    updateField(field.id, { required: e.target.checked })
                                  }
                                  disabled={index < 2}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Required Field</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.readOnly}
                                  onChange={(e) =>
                                    updateField(field.id, { readOnly: e.target.checked })
                                  }
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Read Only</span>
                              </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() => duplicateField(field)}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Duplicate
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )})}
              </AnimatePresence> 
            </div>

            {/* Add Conditional Field Button */}
            <AnimatePresence>
              {showAdvanced && formData.fields.some(f => f.type === 'SELECT' && !isPaymentField(f.id)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <motion.button
                    onClick={() => addConditionalField(formData.fields.find(f => f.type === 'SELECT' && !isPaymentField(f.id))?.id || '')}
                    className="w-full p-4 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Add Conditional Field</span>
                    <span className="text-sm text-indigo-500">(Shows based on other field values)</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Add Buttons */}
            <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <motion.button
                  onClick={addField}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Field</span>
                </motion.button>
                
                {showAdvanced && formData.fields.some(f => f.type === 'SELECT' && !isPaymentField(f.id)) && (
                  <motion.button
                    onClick={() => addConditionalField(formData.fields.find(f => f.type === 'SELECT' && !isPaymentField(f.id))?.id || '')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Add Conditional Field</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Payment Methods & Preview */}
        <div className="xl:col-span-1 space-y-6">
          {/* Payment Methods */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">💳</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <p className="text-xs text-gray-500">Select accepted payment options</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <motion.label
                  key={method.id}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.paymentMethods.includes(method.id as PaymentMethod)
                      ? 'border-purple-300 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(method.id as PaymentMethod)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethods: [...prev.paymentMethods, method.id as PaymentMethod],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.filter((m) => m !== method.id),
                        }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white text-sm shadow-sm`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.desc}</div>
                  </div>
                </motion.label>
              ))}
            </div>

            {/* Payment Method Error */}
            <AnimatePresence>
              {hasPaymentMethodError && (
                <motion.div 
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Please select at least one payment method</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview Button */}
            <motion.button
              onClick={() => setShowPreview(true)}
              className="w-full mt-6 flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-5 h-5" />
              <span>Preview Form</span>
            </motion.button>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Wand2 className="w-4 h-4" />
                <span>Form Summary</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fields:</span>
                  <span className="font-semibold text-gray-900">{formData.fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Fields:</span>
                  <span className="font-semibold text-gray-900">{formData.fields.filter(f => f.required).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Methods:</span>
                  <span className="font-semibold text-gray-900">{formData.paymentMethods.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Fields:</span>
                  <span className="font-semibold text-green-600">{formData.fields.filter(f => isPaymentField(f.id)).length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Preview Modal */}
      <CreateEventFormView
        formData={formData}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      />
    </motion.div>
  );
}

export default CreateCustomeEventFields;