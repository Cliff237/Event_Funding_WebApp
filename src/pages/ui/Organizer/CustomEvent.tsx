import { useRef, useState } from "react";
import { FiArrowLeft, FiEye,  FiPlusCircle, FiTrash2,  } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import type { EventConfig, FieldType, FormField, PaymentMethod } from "../../components/Organizer/Events/type";
import { motion } from "framer-motion";
import FieldConfigurationPanel from "../../components/Organizer/FieldConfigPanel";
import ContributorView from "../ContributorView";
import GlobalConfigPanel from "../../components/Organizer/GlobalConfigPanel";
import { ChevronsLeftIcon, X } from "lucide-react";
import { PaymentGetSetup } from "./CustomePay_receipt_page";



function CustomEvent() {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [ isFieldConfig, setIsFieldConfig] = useState(true)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [creationPhase, setCreationPhase] = useState<'building' | 'publishing'>('building');
    const [previewMode, setPreviewMode] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const handleBack = () => {
    navigate('/createEvent'); // Navigate to createEvent page
  };

    const [event, setEvent] = useState<EventConfig>({
      id: '',
      title: 'Event Contribution',
      description: '',
      category: 'school',
      subType: '',
      fields: [
        {
          id: 'custom Field',
          label: 'Custom Field',
          type: 'text',
          required: true,
          readOnly: false
        },
      ],
      theme: {
        primaryColor: '#7C3AED',
        secondaryColor: '#EDE9FE',
        bgColor: '#FFFFFF'
      }
    });
    
    const addPaymentFields = (method: PaymentMethod) => {
    const fieldId = `payment-${method}`;
    
    if (event.fields.some(f => f.id === fieldId)) return;
    
    const newField: FormField = {
        id: fieldId,
        label: `${method.charAt(0).toUpperCase() + method.slice(1)}  Number`,
        type: 'text',
        required: true,
        readOnly: true,
        // conditional: {
        // fieldId: 'payment-method',
        // values: [method]
        // }
    };
    
    setEvent(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
    }));
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
    // Render The selected field 
    const renderField = (field: FormField) => {
        const commonProps = {
          
          className: `w-full p-3 rounded-lg border ${field.readOnly ? 'bg-blue-100' : 'bg-white'}`,
          required: field.required,
          readOnly: field.readOnly,
          placeholder: field.label,
        //   defaultValue: field.defaultValue
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
            return <input type="number" value={field.min}  min={field.min} max={field.max} {...commonProps} />;
          default:
            return <input key={field.id} type={field.type} {...commonProps} />;
        }
     };
    const deleteField = (fieldId: string) => {
        setEvent(prev => ({
        ...prev,
        fields: (prev.fields ?? []).filter(f => f.id !== fieldId)
        }));
        setSelectedFieldId(null);
    };
    const addField = (type: FieldType) => {
        const newField: FormField = {
          id: `field-${Date.now()}`,
          label: `New Field`,
          type,
          required: true,
          readOnly: false
        };
        if (type === 'select') newField.options = ['Option 1', 'Option 2'];
        setEvent(prev => ({ ...prev, fields: [...prev.fields, newField] }));
        setSelectedFieldId(newField.id);
      };
        // Theme customization
    const updateTheme = (property: keyof EventConfig['theme'], value: string) => {
        setEvent(prev => ({
            ...prev,
            theme: {
                primaryColor: property === 'primaryColor' ? value : prev.theme.primaryColor,
                secondaryColor: property === 'secondaryColor' ? value : prev.theme.secondaryColor,
                bgColor: property === 'bgColor' ? value : prev.theme.bgColor
            }
        }));
    };
  return (
    <div className="h-screen w-full flex-col md:flex-row flex text-gray-100 bg-gray-700/30">
        {
            creationPhase === 'building'?
            (
                 <>
                 
                     {/* left side */}
                    <section className="md:w-[70%] h-screen w-full flex flex-col ">
                        <nav className=" h-14 py-2 flex w-full  justify-between ">
                            <div className="flex  justify-start">
                            <button
                            onClick={handleBack}
                            className="px-3 ml-2 text-purple-700 border  flex items-center"
                            >
                            <FiArrowLeft className="mr-1 " />
                                Go Back
                            </button>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                onClick={()=>{setPreviewMode(!previewMode);setIsFieldConfig(!isFieldConfig)
                                }}
                                className=" md:px-5 px-2 text-gray-100 font-semibold rounded bg-purple-700 flex items-center mr-4 hover:cursor-pointer hover:bg-purple-800">
                                    <FiEye className="mr-1" /> {previewMode ? 'Exit Preview' : 'Preview'}
                                </button>
                                <button
                                onClick={() => setCreationPhase('publishing')}
                                className="px-5 text-gray-100 font-semibold rounded bg-purple-700 flex items-center mr-1 hover:cursor-pointer hover:bg-purple-800">
                                    Publish Event
                                </button>
                            </div>
                        </nav>

                        {
                            previewMode ?(
                             <div className="h-full w-full overflow-y-scroll py-2">
                                <div className="flex justify-end pr-1">
                                    <button className=" bg-purple-800 px-4 rounded md:hidden"
                                        onClick={()=>{setIsSidebarCollapsed(!isSidebarCollapsed);}}>
                                        <ChevronsLeftIcon size={40}/>
                                    </button>
                                </div>
                                   <ContributorView event={event}/>
                             </div>
                            )
                            :(
                                <div
                                ref={formRef}
                                className={`flex-1 px-8  overflow-y-auto   transition-colors duration-300 bg-gray-700/50` }
                                >
                                    <div className="flex w-full justify-between py-2">
                                        <button
                                            onClick={() => addField('text')}
                                            className="flex space-x-2 h-fit w-fit py-2 px-4 items-center text-gray-100 bg-purple-800 rounded hover:cursor-pointer"
                                            >
                                            <FiPlusCircle/> <span>Add Field</span>
                                        </button>
                                        <button className=" bg-purple-800 px-4 rounded md:hidden"
                                        onClick={()=>{setIsSidebarCollapsed(!isSidebarCollapsed);}}>
                                            <ChevronsLeftIcon size={40}/>
                                        </button>
                                    </div>
                                    {
                                        event.fields.map(field=>(
                                        <motion.div
                                        key={field.id}
                                        layout
                                        initial={{opacity:0}} animate={{opacity:1}}
                                        className={`space-y-1 mb-4 w-full px-4 py-2 rounded bg-gray-100/10 
                                            ${selectedFieldId === field.id ? 'border-2 border-purple-500 ':'border-l-8  border-purple-800 '}
                                            h-fit`}
                                        onClick={() => {setSelectedFieldId(field.id); setIsSidebarCollapsed(!isSidebarCollapsed); console.log('click')}}>
                                            <label className="block text-sm font-medium mb-1">
                                                {field.label}
                                            </label>

                                            {renderField(field)}    
                                            
                                            <div className="w-full  flex justify-end space-x-3">
                                                <button 
                                                onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                                className="flex space-x-2 h-fit w-fit py-2 px-4 items-center text-gray-100 bg-red-500 rounded cursor-pointer">
                                                    <FiTrash2/> <span>Delete</span>
                                                </button>
                                                <button
                                                onClick={() => addField('text')}
                                                className="flex space-x-2 h-fit w-fit py-2 px-4 items-center text-gray-100 bg-purple-800 rounded hover:cursor-pointer"
                                                >
                                                <FiPlusCircle/> <span>Add Field</span>
                                                </button>

                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )
                        }
                        
                    </section>

                    {/* rightside  for pc*/}
                    <section className="md:flex hidden w-[30%] p-5 pt-8  overflow-y-scroll shadow-xl  shadow-white/30 flex-1 justify-center">
                      
                        
                        {
                            selectedFieldId ? (
                          
                                <div>
                                    {isFieldConfig &&(
                                        <div>
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
                                                <div className="mb-6 text-gray-100 border-t-1 mt-6 ">
                                                    <h4 className="font-medium mb-3 text-gray-100 ">Payment Methods</h4>
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
                                        </div>
                                    )}
                                </div>
                            ) :  
                            (!previewMode) && (
                                    <div className="mb-6 text-gray-100 border-t-1">
                                        <h4 className="font-medium mb-3 text-gray-100">Payment Methods</h4>
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
                                        
                                        {/* ADD THIS CHECKBOX FOR IMAGE UPLOAD */}
                                        <label className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-400">
                                            <input
                                            type="checkbox"
                                            checked={event.allowImageUpload || false}
                                            onChange={(e) => {
                                                setEvent(prev => ({
                                                ...prev,
                                                allowImageUpload: e.target.checked
                                                }));
                                                if (e.target.checked) {
                                                // Add image upload field if checked
                                                if (!event.fields.some(f => f.id === 'contributor-image')) {
                                                    setEvent(prev => ({
                                                    ...prev,
                                                    fields: [
                                                        ...prev.fields,
                                                        {
                                                            id: 'contributor-image',
                                                            label: 'Upload Your Photo',
                                                            type: 'file',
                                                            required: false,
                                                            readOnly: false,
                                                            accept: 'image/*'
                                                        } as unknown as FormField
                                                    ]
                                                    }));
                                                }
                                                } else {
                                                // Remove image upload field if unchecked
                                                setEvent(prev => ({
                                                    ...prev,
                                                    fields: prev.fields.filter(f => f.id !== 'contributor-image')
                                                }));
                                                }
                                            }}
                                            className="rounded text-purple-600"
                                            />
                                            <span className="flex items-center text-xl">
                                            Allow contributors to upload images
                                            </span>
                                        </label>
                                        </div>
                                    </div>
                                )
                               }
                             {
                                !isFieldConfig &&(
                                    <GlobalConfigPanel
                                    event={event}
                                    onUpdate={setEvent}
                                    onThemeUpdate={updateTheme}
                                    onPaymentMethodToggle={togglePaymentMethod}
                                />)
                            
                            }
                       
                    </section>

                    {/* right side bar for phone */}
                    {
                        isSidebarCollapsed &&(
                            <>
                                <motion.div className=" md:hidden fixed inset-0 bg-black/20 z-40"
                                onClick={()=>setIsSidebarCollapsed(!isSidebarCollapsed)}>
                                    <motion.div
                                    initial={{x:'100%'}}
                                    animate={{x: 0}}
                                    exit={{x: '100%'}}
                                    transition={{type:'tween', duration:0.3}}
                                    className=" md:hidden top-0 right-0 h-full fixed w-80 bg-gray-900 shadow-lg z-50 p-6 space-y-10 "
                                    onClick={(e)=>e.stopPropagation()}
                                    >
                                        <div className="flex justify-end">
                                            <button onClick={()=>setIsSidebarCollapsed(!isSidebarCollapsed)} ><X size={30}/></button>
                                        </div>

                                    <div className="flex flex-col">
                                         {
                                            selectedFieldId ? (
                                                <div>
                                                    {isFieldConfig &&(
                                                        <div>
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
                                                                <div className="mb-6 text-gray-100 border-t-1 mt-6 ">
                                                                    <h4 className="font-medium mb-3 text-gray-100 ">Payment Methods</h4>
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
                                                        </div>
                                                    )}
                                                </div>
                                            ) :  
                                            (!previewMode) && (

                                                    <div className="mb-6 text-gray-100 border-t-1 ">
                                                        <h4 className="font-medium mb-3 text-gray-100 ">Payment Methods</h4>
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
                                                    )
                                        }
                                        {
                                            !isFieldConfig &&(
                                                <GlobalConfigPanel
                                                event={event}
                                                onUpdate={setEvent}
                                                onThemeUpdate={updateTheme}
                                                onPaymentMethodToggle={togglePaymentMethod}
                                            />)
                                    
                                         }
                                    </div>    
                                    </motion.div>
                                </motion.div>
                            </>
                        )
                    }
                </>
            )
            :(
                <PaymentGetSetup/>
               
            )
        }

    </div>
  )
}

export default CustomEvent
