import type { SchoolRequest, ApprovedSchool } from '../Organizer/Events/type';
import { motion } from 'framer-motion';
import { XCircle, MapPin, Phone, Globe, Building, User, Calendar, FileText, CheckCircle, X, School, Mail, Download, ExternalLink, Users, Award, Clock } from 'lucide-react';
import { useState } from 'react';

interface AdminSchoolRequestProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'requests' | 'schools' | 'rejected';
  selectedRequest: SchoolRequest | ApprovedSchool;
  setShowDetailsModal: (show: boolean) => void;
  handleRejectRequest: (request: SchoolRequest) => void;
  handleValidateRequest: (request: SchoolRequest) => void;
  formatDate: (dateString: string) => string;
}

export default function AdminSchoolRequest({
  isOpen,
  onClose,
  activeTab,
  selectedRequest,
  setShowDetailsModal,
  handleRejectRequest,
  handleValidateRequest,
  formatDate
}: AdminSchoolRequestProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen) return null;

  const schoolName = (activeTab === 'requests' || activeTab === 'rejected')
    ? (selectedRequest as SchoolRequest).schoolName 
    : (selectedRequest as ApprovedSchool).name;
  
  const schoolType = (activeTab === 'requests' || activeTab === 'rejected')
    ? (selectedRequest as SchoolRequest).schoolType 
    : (selectedRequest as ApprovedSchool).type;

  const handleApprove = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const response = await fetch(`http://localhost:5000/api/school-applications/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customMessage: 'Congratulations! Your school has been approved and added to our platform.',
          logo: null
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to approve application');
      }

      console.log('Application approved successfully:', result.data);
      alert(`School approved successfully! Access code: ${result.data.schoolCode}`);
      
      setShowDetailsModal(false);
      handleValidateRequest(selectedRequest as SchoolRequest);
      
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      setIsProcessing(true);
      
      const response = await fetch(`http://localhost:5000/api/school-applications/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reason,
          customMessage: `We regret to inform you that your school application has been rejected. Reason: ${reason}`
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to reject application');
      }

      console.log('Application rejected successfully');
      alert('Application rejected successfully.');
      
      setShowDetailsModal(false);
      handleRejectRequest(selectedRequest as SchoolRequest);
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <School className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{schoolName}</h2>
              <p className="text-purple-100 mt-1">{schoolType}</p>
              {activeTab === 'requests' && (
                <div className="flex items-center mt-2 space-x-2">
                  <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
                    <span className="text-xs font-medium text-yellow-100">Pending Review</span>
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate((selectedRequest as SchoolRequest).requestDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  School Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{selectedRequest.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{selectedRequest.phone}</p>
                    </div>
                  </div>
                  
                  {selectedRequest.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Website</p>
                        <a
                          href={`https://${selectedRequest.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          {selectedRequest.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Students</p>
                      <p className="text-sm text-gray-600">{selectedRequest.studentsCount.toLocaleString()} students</p>
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === 'requests' && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Organizer Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{(selectedRequest as SchoolRequest).organizerName}</p>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-600">{(selectedRequest as SchoolRequest).organizerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Request submitted</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate((selectedRequest as SchoolRequest).requestDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schools' && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    School Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-gray-900">Total Events</span>
                      <span className="text-lg font-bold text-purple-600">{(selectedRequest as ApprovedSchool).eventsCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-gray-900">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {(selectedRequest as ApprovedSchool).status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-gray-900">Approved Date</span>
                      <span className="text-sm text-gray-600">{formatDate((selectedRequest as ApprovedSchool).approvedDate)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-gray-900">Admin</span>
                      <span className="text-sm text-gray-600">{(selectedRequest as ApprovedSchool).adminName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Description & Documents */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'requests' && (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      School Description
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">{(selectedRequest as SchoolRequest).description}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Submitted Documents
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {(selectedRequest as SchoolRequest).documents.length} files
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedRequest as SchoolRequest).documents.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500 uppercase font-medium">{doc.type} file</p>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="View">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'schools' && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">School Management</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Admin Contact</h4>
                      <p className="text-blue-800">{(selectedRequest as ApprovedSchool).adminEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Mail className="w-5 h-5 text-gray-400 mb-2" />
                        <p className="font-medium text-gray-900">Send Email</p>
                        <p className="text-sm text-gray-500">Contact school admin</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <FileText className="w-5 h-5 text-gray-400 mb-2" />
                        <p className="font-medium text-gray-900">View Events</p>
                        <p className="text-sm text-gray-500">See all school events</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {activeTab === 'requests' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Review the school information and documents before making a decision.
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Reject Request'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Approve Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
