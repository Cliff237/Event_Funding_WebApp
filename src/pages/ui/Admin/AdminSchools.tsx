import React, { useState, useEffect } from 'react';
import { Search, School, CheckCircle, XCircle, Eye, Mail, Upload, X, User, Key, MessageSquare, FileText, AlertTriangle, Send, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSchoolRequest from '../../components/Admin/AdminSchoolRequest';
import type { SchoolRequest, ApprovedSchool, ValidationForm, RejectionForm } from '../../components/Organizer/Events/type';
import { 
  fetchAllSchoolApplications, 
  fetchAllSchools, 
  approveSchoolApplication, 
  rejectSchoolApplication 
} from '../../../utils/schoolApplicationApi';

// Types

const SuperAdminSchools = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'schools' | 'rejected'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<SchoolRequest | ApprovedSchool | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [validationForm, setValidationForm] = useState<ValidationForm>({
    logo: null,
    schoolAdminName: '',
    password: '',
    customMessage: ''
  });
  
  const [rejectionForm, setRejectionForm] = useState<RejectionForm>({
    reason: '',
    customMessage: ''
  });

  // School requests data from backend
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([]);

  // Approved schools data from backend
  const [approvedSchools, setApprovedSchools] = useState<ApprovedSchool[]>([]);

  // Rejected schools data from backend
  const [rejectedSchools, setRejectedSchools] = useState<(SchoolRequest & { rejectionReason: string; rejectionDate: string })[]>([]);

  // Fetch data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch pending applications
      const pendingApplications = await fetchAllSchoolApplications('pending');
      setSchoolRequests(pendingApplications);

      // Fetch rejected applications
      const rejectedApplications = await fetchAllSchoolApplications('rejected');
      setRejectedSchools(rejectedApplications.map((app: any) => ({
        ...app,
        rejectionReason: 'Reason not specified', // You might want to store this in your DB
        rejectionDate: app.requestDate
      })));

      // Fetch approved schools
      const schools = await fetchAllSchools();
      setApprovedSchools(schools);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleViewDetails = (item: SchoolRequest | ApprovedSchool) => {
    setSelectedRequest(item);
    setShowDetailsModal(true);
  };

  const handleValidateRequest = (request: SchoolRequest) => {
    setSelectedRequest(request);
    setValidationForm({
      logo: null,
      schoolAdminName: '',
      password: generatePassword(),
      customMessage: `Dear ${request.organizerName},\n\nCongratulations! Your request to add "${request.schoolName}"
       to our platform has been approved.

Your school admin credentials:
Username: ${request.organizerEmail}
Password: [PASSWORD]
       

You can now log in to manage your school's events.

Best regards,
Platform Admin Team`
    });
    setShowValidationModal(true);
  };

  const handleRejectRequest = (request: SchoolRequest) => {
    setSelectedRequest(request);
    setRejectionForm({
      reason: '',
      customMessage: `Dear ${request.organizerName},\n\nThank you for your interest in joining our platform. Unfortunately, we cannot approve your request for "
      ${request.schoolName}" at this time.\n\nReason: [REASON]\n\nYou may resubmit your request after addressing the mentioned concerns.\n\nBest regards,\nPlatform Admin Team`
    });
    setShowRejectionModal(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setValidationForm(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const submitValidation = async () => {
    try {
      setLoading(true);
      const approvalData = {
        customMessage: validationForm.customMessage,
        logo: validationForm.logo ? URL.createObjectURL(validationForm.logo) : null,
        schoolAdminName: validationForm.schoolAdminName
      };

      await approveSchoolApplication((selectedRequest as SchoolRequest).id, approvalData);
      
      // Reload data after approval
      await loadData();
      
      setShowValidationModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving school:', error);
      setError('Failed to approve school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitRejection = async () => {
    try {
      setLoading(true);
      const rejectionData = {
        reason: rejectionForm.reason,
        customMessage: rejectionForm.customMessage
      };

      await rejectSchoolApplication((selectedRequest as SchoolRequest).id, rejectionData);
      
      // Reload data after rejection
      await loadData();
      
      setShowRejectionModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting school:', error);
      setError('Failed to reject school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = schoolRequests.filter(request =>
    request.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchools = approvedSchools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejectedSchools = rejectedSchools.filter(school =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination logic
  const getCurrentData = () => {
    switch (activeTab) {
      case 'requests':
        return filteredRequests;
      case 'schools':
        return filteredSchools;
      case 'rejected':
        return filteredRejectedSchools;
      default:
        return [];
    }
  };

  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);
  const currentRequests: SchoolRequest[] = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const currentSchools: ApprovedSchool[] = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const currentRejectedSchools = filteredRejectedSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen w-full overflow-y-scroll  overflow-x-hidden p-6">

      {/* Header */}
      <div className="mb-8 rounded-xl bg-gray-100 shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 text-transparent bg-clip-text">Schools Management</h1>
            <p className="text-gray-600 mt-1">Manage school requests and approved institutions.</p>
            {loading && <p className="text-blue-600 mt-1">Loading...</p>}
            {error && <p className="text-red-600 mt-1">{error}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('requests');
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm  ${
                activeTab === 'requests'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Requests
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {schoolRequests.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('schools');
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schools'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved Schools      
              <span className="ml-2 bg-green-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {approvedSchools.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('rejected');
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected Schools      
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {rejectedSchools.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={activeTab === 'requests' ? "Search requests..." : "Search schools..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg md:grid grid-cols-1 gap-4 p-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'requests' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                ) : activeTab === 'schools' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejection Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'requests'
                ? currentRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <School className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.schoolName}</div>
                              <div className="text-sm text-gray-500">{item.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.organizerName}</div>
                          <div className="text-sm text-gray-500">{item.organizerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.schoolType}</div>
                          <div className="text-sm text-gray-500">{item.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.studentsCount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(item.requestDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleValidateRequest(item)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Validate"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(item)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    </tr>
                  ))
                : activeTab === 'schools'
                ? currentSchools.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.name}`}
                              alt={item.name}
                              className="h-10 w-10  rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.adminName}</div>
                          <div className="text-sm text-gray-500">{item.adminEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.type}</div>
                          <div className="text-sm text-gray-500">{item.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.studentsCount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.eventsCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    </tr>
                  ))
                : currentRejectedSchools.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.schoolName}</div>
                              <div className="text-sm text-gray-500">{item.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.organizerName}</div>
                          <div className="text-sm text-gray-500">{item.organizerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.schoolType}</div>
                          <div className="text-sm text-gray-500">{item.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.studentsCount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600 font-medium">{item.rejectionReason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            REJECTED
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* Empty State */}
          {getCurrentData().length === 0 && (
            <div className="text-center py-12">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'requests' ? 'No pending requests' : 
                 activeTab === 'schools' ? 'No approved schools' : 'No rejected schools'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'requests' 
                  ? 'All school requests have been processed.' 
                  : activeTab === 'schools'
                  ? 'Schools will appear here after validation.'
                  : 'Rejected schools will appear here.'
                }
              </p>
            </div>
          )}
        </div>
      
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <p>
                {`Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, getCurrentData().length)} of ${getCurrentData().length} results`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 text-gray-500 bg-purple-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 bg-purple-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <AdminSchoolRequest
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          activeTab={activeTab}
          selectedRequest={selectedRequest}
          setShowDetailsModal={setShowDetailsModal}
          handleRejectRequest={handleRejectRequest}
          handleValidateRequest={handleValidateRequest}
          formatDate={formatDate}
        />
        
      )}

      {/* Validation Modal */}
      {showValidationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <button
                onClick={() => setShowValidationModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Approve School Request</h2>
                  <p className="text-green-100 mt-1">{(selectedRequest as SchoolRequest).schoolName}</p>
                  <div className="flex items-center mt-2">
                    <div className="px-3 py-1 bg-green-500/20 rounded-full">
                      <span className="text-xs font-medium text-green-100">Ready for Approval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - School Setup */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-green-600" />
                      School Logo
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                      >
                        Click to upload school logo
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                      {validationForm.logo && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">✓ Logo uploaded successfully</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Admin Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Admin Name
                        </label>
                        <input
                          type="text"
                          value={validationForm.schoolAdminName}
                          onChange={(e) => setValidationForm(prev => ({
                            ...prev,
                            schoolAdminName: e.target.value
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter admin name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Key className="w-4 h-4 mr-1" />
                          Generated Password
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={validationForm.password}
                            onChange={(e) => setValidationForm(prev => ({
                              ...prev,
                              password: e.target.value
                            }))}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                          />
                          <button
                            onClick={() => setValidationForm(prev => ({
                              ...prev,
                              password: generatePassword()
                            }))}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Generate New
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Email Message */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                      Approval Email Message
                    </h3>
                    <div className="space-y-4">
                      <textarea
                        value={validationForm.customMessage}
                        onChange={(e) => setValidationForm(prev => ({
                          ...prev,
                          customMessage: e.target.value
                        }))}
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="Customize the approval email message..."
                      />
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-900">Email Preview</p>
                            <p className="text-xs text-green-700 mt-1">
                              This message will be sent to {(selectedRequest as SchoolRequest).organizerEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Review all details before approving the school request.
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowValidationModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitValidation}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Send Email
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-rose-600 text-white p-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Reject School Request</h2>
                  <p className="text-red-100 mt-1">{(selectedRequest as SchoolRequest).schoolName}</p>
                  <div className="flex items-center mt-2">
                    <div className="px-3 py-1 bg-red-500/20 rounded-full">
                      <span className="text-xs font-medium text-red-100">Requires Rejection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Rejection Details */}
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Rejection Reason
                    </h3>
                    <div className="space-y-4">
                      <select
                        value={rejectionForm.reason}
                        onChange={(e) => setRejectionForm(prev => ({
                          ...prev,
                          reason: e.target.value
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select a reason...</option>
                        <option value="Incomplete documentation">Incomplete documentation</option>
                        <option value="Invalid school credentials">Invalid school credentials</option>
                        <option value="Duplicate request">Duplicate request</option>
                        <option value="Does not meet requirements">Does not meet requirements</option>
                        <option value="Other">Other</option>
                      </select>
                      
                      {rejectionForm.reason && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Selected Reason</p>
                              <p className="text-sm text-red-700 mt-1">{rejectionForm.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      School Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Organizer:</span>
                        <span className="font-medium text-gray-900">{(selectedRequest as SchoolRequest).organizerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{(selectedRequest as SchoolRequest).organizerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900">{(selectedRequest as SchoolRequest).schoolType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">{(selectedRequest as SchoolRequest).location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Email Message */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                      Rejection Email Message
                    </h3>
                    <div className="space-y-4">
                      <textarea
                        value={rejectionForm.customMessage}
                        onChange={(e) => setRejectionForm(prev => ({
                          ...prev,
                          customMessage: e.target.value
                        }))}
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Customize the rejection email message..."
                      />
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">Email Preview</p>
                            <p className="text-xs text-red-700 mt-1">
                              This rejection message will be sent to {(selectedRequest as SchoolRequest).organizerEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Please provide a clear reason for rejection to help the organizer understand.
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRejection}
                    disabled={!rejectionForm.reason}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject & Send Email
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSchools;