import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Calendar, Flower2, GraduationCap, Heart, PartyPopper, School, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { EventType,EventFormData, SchoolInfo } from "../../components/Organizer/Events/type";
import Modal from "../../components/Organizer/Modal";
import CreateCustomeEventFields from "../../components/Organizer/Events/CreateCustomeEventFields";
import CreateFormCustomization from "../../components/Organizer/Events/CreateFormCustomization";
import CreateFinalConfiguration from "./CreateFinalConfiguration";
import CreateReceiptCustomization from "./CreateReceiptCustomization";

function CreateEvents() {
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [eventNameError, setEventNameError] = useState('');
  const [goalError, setGoalError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [SchoolData, setSchoolData] = useState({
    name: '',
    password: '',
  });
  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
  }
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
  const [formData, setFormData] = useState<EventFormData>({
    eventType: 'school',
    organizerName: '',
    organizerPassword: '',
    eventName: '',
    fields: [
      { id: '1', label: 'Name', type: 'text', required: true ,readOnly:false},
      { id: '2', label: 'Amount', type: 'number', required: true,readOnly:false }
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
      additionalFields: {},
      school: {
        name: '',
        link: '',
        contact: '',
        logoUrl: '',
      },
      layout: 'one',
      align: 'left',
    },
    eventCard: {
      image: '',
      title: '',
      description: ''
    }
  });
  const schools: SchoolInfo[] = [
    { id: '1', name: 'Université de Yaoundé I', logo: 'public/A1 (1).jpg' },
    { id: '2', name: 'École Normale Supérieure', logo: 'public/A1.jpg', email: 'ens@cameroon.edu', contact: '+237987654321', location: 'Yaoundé' },
    { id: '3', name: 'Collège Vogt', logo: 'public/F1 (1).jpg' }
  ]

  const selectedSchool = schools.find(s => s.id === formData.schoolId)  ;

  const StepIndicator = () => {
    const steps = [
      { number: 1, title: 'Fields' },
      { number: 2, title: 'Design' },
      { number: 3, title: 'Settings' },
    ];
    
    if (formData.eventType === 'school') {
      steps.push({ number: 4, title: 'Receipt' });
    }

    return (
      <div className="flex w-full justify-center mb-8 ">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => {
                  // Only allow navigation to completed steps
                  const completedSteps = formData.eventType === 'school' ? 
                    (currentStep >= 4 ? 4 : currentStep) : 
                    (currentStep >= 3 ? 3 : currentStep);
                  
                  if (step.number <= completedSteps) {
                    setCurrentStep(step.number);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.number <= currentStep
                    ? 'bg-purple-600 text-white'
                    : step.number <= (formData.eventType === 'school' ? 4 : 3)
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-gray-100 text-gray-400'
                } ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {step.number}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`md:w-16 w-6 h-1 mx-2 ${
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

  const NavigationButtons = () => (
    <div className="flex justify-between lg:justify-around jus mt-8">
      <button
        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        disabled={currentStep === 1}
        className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      {currentStep < (formData.eventType === 'school' ? 4 : 3) && (
        <button
          onClick={() => {
            // Validation for step 2
            if (currentStep === 1) {
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
            if (currentStep === 3) {
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
    <motion.div 
    className="h-full relative w-[100vw] md:w-full bg-gradient-to-br text-gray-700  "
    >
      <div className=" overflow-y-scroll h-screen p-4 ">
        <div className="text-center p-4">
          <h1 className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Event Type
          </h1>
          <p className="text-gray-600 text-2xl mt-2">Select the type of event you want to create</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {eventTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  formData.eventType === type.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                }`}
                onClick={() => {

                  setFormData(prev => ({ ...prev, eventType: type.id as EventType }));
                 (type.id === 'school') ? setShowSchoolModal(true) : setCurrentStep(1);
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
      </div>
      {currentStep != 0 && 
       <div className="h-screen w-full  absolute inset-0 overflow-y-scroll bg-gradient-to-br text-gray-700 from-purple-50 to-blue-50 p-4">
        <StepIndicator/>
          {currentStep === 1 && <CreateCustomeEventFields formData={formData} setFormData={setFormData} eventNameError={eventNameError}/>} 
          {currentStep === 2 && <CreateFormCustomization formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <CreateFinalConfiguration formData={formData} setFormData={setFormData} goalError={goalError} deadlineError={deadlineError}/>}
          {currentStep === 4 && <CreateReceiptCustomization formData={formData} setFormData={setFormData}/>} 
          <NavigationButtons />
       </div>
      }

      {/* School Event Modal */}
      <Modal isOpen={showSchoolModal} onClose={() => setShowSchoolModal(false)}>
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* School Logo Preview */}
          {selectedSchool &&(
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-2 flex flex-col  w-full justify-center items-center "
          >
          <div className="w-18 h-18 bg-gray-100 rounded-full flex  items-center justify-center overflow-hidden mr-3">
              {/* Logo will appear here when school is selected */}
              <img 
              src={selectedSchool.logo }
              className="w-full h-full object-contain"
              />
          </div>
          <span id="school-name" className="font-medium text-gray-700">{selectedSchool.name}</span>
          </motion.div>
          )}
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2">Select School</label>
              <div className="flex items-center space-x-3 mb-2">
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
                  setCurrentStep(1);
                }}
              >
                Proceed
              </button>
            </div>
            <small className="mt-10">
              not seeing your school? <a href="" className="text-purple-900 hover:cursor-pointer hover:text-purple-700">Add My School</a>
            </small>
            </form>

          </div>
        </motion.div>
      </Modal>
    </motion.div>
  )
}

export default CreateEvents