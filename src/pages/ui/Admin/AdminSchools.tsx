import React, { useState } from 'react';
import { Search, School, CheckCircle, XCircle, Eye, Mail, Upload, X, User, Key, MessageSquare, FileText, AlertTriangle, Send, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSchoolRequest from '../../components/Admin/AdminSchoolRequest';
import type { SchoolRequest, ApprovedSchool, ValidationForm, RejectionForm } from '../../components/Organizer/Events/type';

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

  // Mock school requests data
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([
    {
      id: 1,
      organizerName: "Marie Tchinda",
      organizerEmail: "marie.tchinda@gmail.com",
      schoolName: "Institut Saint-Joseph Douala",
      schoolType: "Private Catholic School",
      location: "Douala, Littoral",
      phone: "+237 672 345 678",
      website: "www.saintjoseph-douala.edu.cm",
      studentsCount: 850,
      description: "Established Catholic institution providing quality bilingual education from kindergarten to high school.",
      documents: [
        { name: "School Registration Certificate", type: "pdf", url: "#" },
        { name: "Tax Clearance Certificate", type: "pdf", url: "#" },
        { name: "Director's ID Card", type: "jpg", url: "#" }
      ],
      requestDate: "2024-08-28T10:30:00Z",
      status: "pending",
    },
    {
      id: 2,
      organizerName: "Paul Ngono",
      organizerEmail: "paul.ngono@yahoo.com",
      schoolName: "Collège Technique de Yaoundé",
      schoolType: "Public Technical College",
      location: "Yaoundé, Centre",
      phone: "+237 699 123 456",
      website: "",
      studentsCount: 1200,
      description: "Technical college specializing in engineering and computer science programs.",
      documents: [
        { name: "Government Authorization Letter", type: "pdf", url: "#" },
        { name: "School Infrastructure Report", type: "pdf", url: "#" }
      ],
      requestDate: "2024-08-25T14:15:00Z",
      status: "pending",
    },
    {
      id: 3,
      organizerName: "Dr. Amina Hassan",
      organizerEmail: "amina.hassan@education.cm",
      schoolName: "École Primaire Bilingue de Bamenda",
      schoolType: "Public Primary School",
      location: "Bamenda, North West",
      phone: "+237 678 901 234",
      website: "www.epb-bamenda.edu.cm",
      studentsCount: 450,
      description: "Bilingual primary school committed to providing quality education in both English and French to children in the North West region.",
      documents: [
        { name: "School Registration Certificate", type: "pdf", url: "#" },
        { name: "Tax Clearance Certificate", type: "pdf", url: "#" },
        { name: "Director's ID Card", type: "jpg", url: "#" },
        { name: "Academic License", type: "pdf", url: "#" }
      ],
      requestDate: "2024-08-30T09:15:00Z",
      status: "pending",
    },
    {
      id: 4,
      organizerName: "Jean-Baptiste Mvondo",
      organizerEmail: "jb.mvondo@lycee-ebolowa.edu.cm",
      schoolName: "Lycée Classique d'Ebolowa",
      schoolType: "Public High School",
      location: "Ebolowa, South",
      phone: "+237 655 432 109",
      website: "",
      studentsCount: 980,
      description: "Classical high school offering comprehensive secondary education with focus on sciences and humanities.",
      documents: [
        { name: "School Registration Certificate", type: "pdf", url: "#" },
        { name: "Government Authorization Letter", type: "pdf", url: "#" },
        { name: "Director's ID Card", type: "jpg", url: "#" },
        { name: "School Infrastructure Report", type: "pdf", url: "#" }
      ],
      requestDate: "2024-09-01T16:45:00Z",
      status: "pending",
    }
  ]);

  // Mock approved schools data
  const [approvedSchools, setApprovedSchools] = useState<ApprovedSchool[]>([
    {
      id: 1,
      name: "Lycée Bilingue de Yaoundé",
      type: "Public Bilingual High School",
      location: "Yaoundé, Centre",
      adminName: "Jean Mballa",
      adminEmail: "jean.mballa@lycee-yaounde.edu.cm",
      studentsCount: 1500,
      eventsCount: 25,
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=LyceeYaounde",
      approvedDate: "2024-01-15T10:30:00Z",
      status: "active",
      phone: "+237 677 123 456",
      website: "www.lycee-yaounde.edu.cm"
    },
    {
      id: 2,
      name: "Collège Français de Douala",
      type: "Private French School",
      location: "Douala, Littoral",
      adminName: "Marie Dupont",
      adminEmail: "marie.dupont@college-douala.edu.cm",
      studentsCount: 800,
      eventsCount: 18,
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=CollegeDouala",
      approvedDate: "2024-02-20T14:20:00Z",
      status: "active",
      phone: "+237 699 987 654",
      website: "www.college-francais-douala.edu.cm"
    }
  ]);

  // Mock rejected schools data
  const [rejectedSchools, setRejectedSchools] = useState<(SchoolRequest & { rejectionReason: string; rejectionDate: string })[]>([
    {
      id: 5,
      organizerName: "Samuel Nkomo",
      organizerEmail: "samuel.nkomo@gmail.com",
      schoolName: "Institut Privé de Bertoua",
      schoolType: "Private Institute",
      location: "Bertoua, East",
      phone: "+237 654 321 987",
      website: "",
      studentsCount: 300,
      description: "Private institute focusing on technical education and vocational training.",
      documents: [
        { name: "School Registration Certificate", type: "pdf", url: "#" },
        { name: "Director's ID Card", type: "jpg", url: "#" }
      ],
      requestDate: "2024-08-20T11:30:00Z",
      status: "rejected",
      rejectionReason: "Incomplete documentation",
      rejectionDate: "2024-08-22T14:30:00Z"
    },
    {
      id: 6,
      organizerName: "Grace Mbeki",
      organizerEmail: "grace.mbeki@yahoo.com",
      schoolName: "Académie Moderne de Garoua",
      schoolType: "Private Academy",
      location: "Garoua, North",
      phone: "+237 698 765 432",
      website: "www.academie-garoua.com",
      studentsCount: 200,
      description: "Modern academy providing bilingual education with focus on technology and innovation.",
      documents: [
        { name: "School Registration Certificate", type: "pdf", url: "#" }
      ],
      requestDate: "2024-08-18T09:15:00Z",
      status: "rejected",
      rejectionReason: "Does not meet requirements",
      rejectionDate: "2024-08-21T16:45:00Z"
    }
  ]);

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
       to our platform has been approved.\n\nYour school admin credentials:\nUsername: ${request.organizerEmail}\nPassword: [PASSWORD]
       \n\nYou can now log in to manage your school's events.\n\nBest regards,\nPlatform Admin Team`
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

  const submitValidation = () => {
    const newSchool: ApprovedSchool = {
      id: Date.now(),
      name: (selectedRequest as SchoolRequest).schoolName,
      type: (selectedRequest as SchoolRequest).schoolType,
      location: (selectedRequest as SchoolRequest).location,
      adminName: validationForm.schoolAdminName,
      adminEmail: (selectedRequest as SchoolRequest).organizerEmail,
      studentsCount: (selectedRequest as SchoolRequest).studentsCount,
      eventsCount: 0,
      logo: validationForm.logo ? URL.createObjectURL(validationForm.logo) : `https://api.dicebear.com/7.x/shapes/svg?seed=${(selectedRequest as SchoolRequest).schoolName}`,
      approvedDate: new Date().toISOString(),
      status: "active",
      phone: (selectedRequest as SchoolRequest).phone,
      website: (selectedRequest as SchoolRequest).website
    };

    setApprovedSchools(prev => [...prev, newSchool]);
    setSchoolRequests(prev => prev.filter(req => req.id !== (selectedRequest as SchoolRequest).id));
    setShowValidationModal(false);
    setSelectedRequest(null);
  };

  const submitRejection = () => {
    const rejectedSchool = {
      ...(selectedRequest as SchoolRequest),
      rejectionReason: rejectionForm.reason,
      rejectionDate: new Date().toISOString(),
      status: "rejected" as const
    };

    setRejectedSchools(prev => [...prev, rejectedSchool]);
    setSchoolRequests(prev => prev.filter(req => req.id !== (selectedRequest as SchoolRequest).id));
    setShowRejectionModal(false);
    setSelectedRequest(null);
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