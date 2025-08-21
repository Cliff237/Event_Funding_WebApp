import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiLink, FiDollarSign, FiLock } from 'react-icons/fi';
import ContributorView from '../ContributorView';
import FieldConfigurationPanel from '../../components/Organizer/FieldConfigPanel';
import GlobalConfigPanel from '../../components/Organizer/GlobalConfigPanel';
import EventLinkCardEditor from '../../components/Organizer/Events/EventLinkCardEditor';

import type { EventConfig, FormField, PaymentMethod, FieldType } from '../../components/Organizer/Events/type';

const EventBuilder = () => {
const [creationPhase, setCreationPhase] = useState<'building' | 'publishing'>('building');
  const [event, setEvent] = useState<EventConfig>({
    id: '',
    title: '',
    description: '',
    category: 'school',
    subType: 'defense-fees',
    fields: [
      {
        id: 'Custom Field',
        label: 'Custom Field',
        type: 'text',
        required: true,
        readOnly: true
      },
    ],
    theme: {
      primaryColor: '#7C3AED',
      secondaryColor: '#EDE9FE',
      bgColor: '#FFFFFF'
    }
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);


  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: `New ${type} Field`,
      type,
      required: false,
      readOnly: false
    };
    if (type === 'select') newField.options = ['Option 1', 'Option 2'];
    setEvent(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedFieldId(newField.id);
  };

  const deleteField = (fieldId: string) => {
    setEvent(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
    setSelectedFieldId(null);
  };
    // Updated payment method handler
  const togglePaymentMethod = (method: PaymentMethod) => {
    setEvent(prev => {
      const paymentMethods = prev.paymentMethods ?? [];
      const newMethods = paymentMethods.includes(method)
        ? paymentMethods.filter(m => m !== method)
        : [...paymentMethods, method];
      
      // Update conditional fields based on payment methods
      let updatedFields = [...prev.fields];
      
      // Remove any existing payment fields if method is disabled
      if (!newMethods.includes(method)) {
        updatedFields = updatedFields.filter(
          f => !f.id.includes(`payment-${method}`)
        );
      }
      return {
        ...prev,
        paymentMethods: newMethods,
        fields: updatedFields
      };
    });
  }
  
  // Add payment-specific fields when a method is selected
  const addPaymentFields = (method: PaymentMethod) => {
    const fieldId = `payment-${method}`;
    
    if (event.fields.some(f => f.id === fieldId)) return;
    
    const newField: FormField = {
      id: fieldId,
      label: `${method.charAt(0).toUpperCase() + method.slice(1)} Details`,
      type: 'text',
      required: true,
      readOnly: false,
      conditional: {
        fieldId: 'payment-method',
        values: [method]
      }
    };
    
    setEvent(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  // Theme customization
  const updateTheme = (property: keyof EventConfig['theme'], value: string) => {
    setEvent(prev => ({
      ...prev,
      theme: { ...prev.theme, [property]: value }
    }));
  };

  // Render the actual form fields
  const renderField = (field: FormField) => {
    const commonProps = {
      key: field.id,
      className: `w-full p-3 rounded-lg border ${field.readOnly ? 'bg-gray-100' : 'bg-white'}`,
      required: field.required,
      readOnly: field.readOnly,
      placeholder: field.label,
      defaultValue: field.defaultValue
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'number':
        return <input type="number" min={field.min} max={field.max} {...commonProps} />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-black">
    {creationPhase === 'building' ? 
    (
      // Your existing form builder UI
      <div className="flex-1 flex overflow-hidden">

        
      {/* Left Sidebar - Field Palette */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
        <button onClick={() => addField('text')} className="p-2 rounded-lg hover:bg-purple-100">
          <FiEdit2 className="text-purple-600" />
        </button>
        <button onClick={() => addField('number')} className="p-2 rounded-lg hover:bg-purple-100">
          <FiDollarSign className="text-purple-600" />
        </button>
        <button onClick={() => addField('select')} className="p-2 rounded-lg hover:bg-purple-100">
          <FiLink className="text-purple-600" />
        </button>
      </div>


      {/* Main Form Builder Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Canvas */}
        <div 
          ref={formRef}
          className={`flex-1 p-8 overflow-y-auto transition-colors duration-300`}
          style={{ backgroundColor: event.theme.bgColor }}
        >
          {previewMode ? (
            <ContributorView event={event} />
          ) 
          : (
            <>
              <div className="max-w-2xl mx-auto">
                {/* <h1 className="text-3xl font-bold mb-4" style={{ color: event.theme.primaryColor }}>
                  {event.title || 'Event Title'}
                </h1>
                <p className="text-gray-600 mb-8">{event.description}</p> */}
                
                <div className="space-y-4">
                  {event.fields.map(field => (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-lg border-2 ${selectedFieldId === field.id ? 'border-purple-500 bg-purple-50' : 'border-transparent'}`}
                      onClick={() => setSelectedFieldId(field.id)}
                    >
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                      <div className="mt-2 flex space-x-2">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                        >
                          <FiTrash2 />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiLock className={field.readOnly ? 'text-purple-600' : ''} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Field Configuration */}
        <div className="w-80 bg-white border-l overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Configuration</h3>
            <button 
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center text-sm text-purple-600"
            >
              <FiEye className="mr-1" /> {previewMode ? 'Exit Preview' : 'Preview'}
            </button>

           </div>

      {selectedFieldId ? (
    <FieldConfigurationPanel
        field={event.fields.find(f => f.id === selectedFieldId)!}
        allFields={event.fields}
        onUpdate={(updates) => {
        setEvent(prev => ({
            ...prev,
            fields: prev.fields.map(f => 
            f.id === selectedFieldId ? { ...f, ...updates } : f
            )
        }));
        }}
        onAddCondition={(fieldId, dependsOn, values) => {
        setEvent(prev => ({
            ...prev,
            fields: prev.fields.map(f => 
            f.id === fieldId 
                ? { ...f, conditional: { fieldId: dependsOn, values } }
                : f
            )
        }));
        }}
    />
    ) : (  
      <>
        <GlobalConfigPanel
        event={event}
        onUpdate={setEvent}
        onThemeUpdate={updateTheme}
        onPaymentMethodToggle={togglePaymentMethod}
        />
        
      {/* Payment Methods Section */}
 <div className="mb-6">
    <h4 className="font-medium mb-3">Payment Methods</h4>
    <div className="space-y-3">
      {(['momo','om','bank'] as PaymentMethod[]).map(method => (
        <label key={method} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={event.paymentMethods?.includes(method) || false}
            onChange={() => {
              togglePaymentMethod(method);
              if (!event.paymentMethods?.includes(method)) {
                addPaymentFields(method);
              }
            }}
            className="rounded text-purple-600"
          />
          <span className="flex items-center">
            {method === 'momo'}
            {method === 'om'}
            {method.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </label>
      ))}
    </div>
    </div>
        <button
        onClick={() => setCreationPhase('publishing')}
        className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
        Publish Event
        </button>
        </>
        )}
        </div>
      </div>

      </div>
    ) : (
      <EventLinkCardEditor 
        event={event}
        onSave={(cardData) => {
          // Save the card data to your backend
          console.log('Saving card:', cardData);
          // Then you might navigate to dashboard or show success message
        }}
        onBack={() => setCreationPhase('building')}
      />
    )}



    </div>
  );
};


export default EventBuilder;