import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText, Image, School, User, Mail, Phone, MapPin, Globe, Building, Users, FileCheck } from 'lucide-react';
import type { SchoolRequest, RequestDocument } from './Events/type';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schoolData: Omit<SchoolRequest, 'id' | 'requestDate' | 'status'>) => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerEmail: '',
    schoolName: '',
    schoolType: '',
    location: '',
    phone: '',
    website: '',
    studentsCount: 0,
    description: '',
  });
  
  const [documents, setDocuments] = useState<RequestDocument[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schoolTypes = [
    'Public Primary School',
    'Private Primary School',
    'Public Secondary School',
    'Private Secondary School',
    'Public High School',
    'Private High School',
    'Technical College',
    'University',
    'Professional Institute',
    'Vocational School',
    'Other'
  ];

  const requiredDocuments = [
    { name: 'School Registration Certificate', required: true },
    { name: 'Tax Clearance Certificate', required: true },
    { name: 'Director/Principal ID Card', required: true },
    { name: 'School Infrastructure Report', required: false },
    { name: 'Academic License', required: false },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
      if (!formData.organizerEmail.trim()) newErrors.organizerEmail = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.organizerEmail)) newErrors.organizerEmail = 'Invalid email format';
      if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
      if (!formData.schoolType) newErrors.schoolType = 'School type is required';
    }

    if (step === 2) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.studentsCount <= 0) newErrors.studentsCount = 'Student count must be greater than 0';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (step === 3) {
      const requiredDocs = requiredDocuments.filter(doc => doc.required);
      const uploadedRequiredDocs = documents.filter(doc => 
        requiredDocs.some(reqDoc => reqDoc.name === doc.name)
      );
      if (uploadedRequiredDocs.length < requiredDocs.length) {
        newErrors.documents = 'Please upload all required documents';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, documentName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [`file_${documentName}`]: 'File size must be less than 5MB' }));
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [`file_${documentName}`]: 'Only PDF, JPG, and PNG files are allowed' }));
        return;
      }

      // Clear any previous errors for this file
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`file_${documentName}`];
        return newErrors;
      });

      // Add to documents array
      const newDocument: RequestDocument = {
        name: documentName,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        url: URL.createObjectURL(file) // In real app, this would be uploaded to server
      };

      setDocuments(prev => {
        const filtered = prev.filter(doc => doc.name !== documentName);
        return [...filtered, newDocument];
      });

      setUploadedFiles(prev => {
        const filtered = prev.filter((_, index) => documents[index]?.name !== documentName);
        return [...filtered, file];
      });
    }
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      try {
        const schoolData = {
          organizerName: formData.organizerName,
          organizerEmail: formData.organizerEmail,
          schoolName: formData.schoolName,
          schoolType: formData.schoolType,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
          studentsCount: formData.studentsCount,
          description: formData.description,
          documents
        };

        console.log('Submitting school application:', schoolData);

        const response = await fetch('http://localhost:5000/api/school-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schoolData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to submit school application');
        }

        console.log('School application submitted successfully:', result.data);
        
        // Show success message
        alert('School application submitted successfully! You will receive an email notification once reviewed.');
        
        onSubmit(schoolData);
        onClose();
        
        // Reset form
        setFormData({
          organizerName: '',
          organizerEmail: '',
          schoolName: '',
          schoolType: '',
          location: '',
          phone: '',
          website: '',
          studentsCount: 0,
          description: '',
        });
        setDocuments([]);
        setUploadedFiles([]);
        setCurrentStep(1);
        setErrors({});
        
      } catch (error) {
        console.error('Error submitting school application:', error);
        alert('Failed to submit school application. Please try again.');
      }
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {index < 2 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
       <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-200">Add Your School</h2>
              <p className="text-gray-400">Submit your school information for approval</p>
            </div>
          </div>
        
        </div>

        <div className="p-6">
          <StepIndicator />

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Your Name (Organizer)
                  </label>
                  <input
                    type="text"
                    value={formData.organizerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizerName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.organizerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizerEmail: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.organizerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.organizerEmail && <p className="text-red-500 text-sm mt-1">{errors.organizerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.schoolName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter school name"
                  />
                  {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    School Type
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolType: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.schoolType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select school type</option>
                    {schoolTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.schoolType && <p className="text-red-500 text-sm mt-1">{errors.schoolType}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City, Region"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+237 XXX XXX XXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="https://www.yourschool.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Students
                  </label>
                  <input
                    type="number"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentsCount: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.studentsCount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="1"
                  />
                  {errors.studentsCount && <p className="text-red-500 text-sm mt-1">{errors.studentsCount}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  School Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Provide a brief description of your school, its mission, and educational programs..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              
              {errors.documents && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm">{errors.documents}</p>
                </div>
              )}

              <div className="space-y-4">
                {requiredDocuments.map((doc) => {
                  const isUploaded = documents.some(d => d.name === doc.name);
                  const fileError = errors[`file_${doc.name}`];
                  
                  return (
                    <div key={doc.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FileCheck className={`w-5 h-5 ${isUploaded ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className="font-medium text-gray-900">{doc.name}</span>
                          {doc.required && <span className="text-red-500 text-sm">*</span>}
                        </div>
                        {isUploaded && (
                          <span className="text-green-600 text-sm font-medium">Uploaded</span>
                        )}
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, doc.name)}
                          className="hidden"
                          id={`file-${doc.name}`}
                        />
                        <label
                          htmlFor={`file-${doc.name}`}
                          className="cursor-pointer text-purple-600 hover:text-purple-700"
                        >
                          Click to upload {doc.name}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                      </div>
                      
                      {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• All documents must be clear and legible</li>
                  <li>• Documents marked with * are required for approval</li>
                  <li>• Your request will be reviewed within 2-3 business days</li>
                  <li>• You will receive an email notification once your school is approved</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddSchoolModal;