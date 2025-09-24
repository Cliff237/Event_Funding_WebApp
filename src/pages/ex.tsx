// import React, { useState } from 'react';
// import { Search, School, CheckCircle, XCircle, Eye, Mail, Upload, User, Calendar, MapPin, Phone, Globe, Building, FileText, ExternalLink } from 'lucide-react';
// import AdminSchoolRequest from '../../components/Admin/AdminSchoolRequest';
// import type { SchoolRequest, ApprovedSchool, ValidationForm, RejectionForm } from '../../components/Organizer/Events/type';

// // Types

// const SuperAdminSchools = () => {
//   const [activeTab, setActiveTab] = useState<'requests' | 'schools'>('requests');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRequest, setSelectedRequest] = useState<SchoolRequest | ApprovedSchool | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showValidationModal, setShowValidationModal] = useState(false);
//   const [showRejectionModal, setShowRejectionModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
  
//   const [validationForm, setValidationForm] = useState<ValidationForm>({
//     logo: null,
//     schoolAdminName: '',
//     password: '',
//     customMessage: ''
//   });
  
//   const [rejectionForm, setRejectionForm] = useState<RejectionForm>({
//     reason: '',
//     customMessage: ''
//   });

//   // Mock school requests data
//   const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([
//     {
//       id: 1,
//       organizerName: "Marie Tchinda",
//       organizerEmail: "marie.tchinda@gmail.com",
//       schoolName: "Institut Saint-Joseph Douala",
//       schoolType: "Private Catholic School",
//       location: "Douala, Littoral",
//       phone: "+237 672 345 678",
//       website: "www.saintjoseph-douala.edu.cm",
//       studentsCount: 850,
//       description: "Established Catholic institution providing quality bilingual education from kindergarten to high school.",
//       documents: [
//         { name: "School Registration Certificate", type: "pdf", url: "#" },
//         { name: "Tax Clearance Certificate", type: "pdf", url: "#" },
//         { name: "Director's ID Card", type: "jpg", url: "#" }
//       ],
//       requestDate: "2024-08-28T10:30:00Z",
//       status: "pending",
//     },
//     {
//       id: 2,
//       organizerName: "Paul Ngono",
//       organizerEmail: "paul.ngono@yahoo.com",
//       schoolName: "Collège Technique de Yaoundé",
//       schoolType: "Public Technical College",
//       location: "Yaoundé, Centre",
//       phone: "+237 699 123 456",
//       website: "",
//       studentsCount: 1200,
//       description: "Technical college specializing in engineering and computer science programs.",
//       documents: [
//         { name: "Government Authorization Letter", type: "pdf", url: "#" },
//         { name: "School Infrastructure Report", type: "pdf", url: "#" }
//       ],
//       requestDate: "2024-08-25T14:15:00Z",
//       status: "pending",
//     }
//   ]);

//   // Mock approved schools data
//   const [approvedSchools, setApprovedSchools] = useState<ApprovedSchool[]>([
//     {
//       id: 1,
//       name: "Lycée Bilingue de Yaoundé",
//       type: "Public Bilingual High School",
//       location: "Yaoundé, Centre",
//       adminName: "Jean Mballa",
//       adminEmail: "jean.mballa@lycee-yaounde.edu.cm",
//       studentsCount: 1500,
//       eventsCount: 25,
//       logo: "https://api.dicebear.com/7.x/shapes/svg?seed=LyceeYaounde",
//       approvedDate: "2024-01-15T10:30:00Z",
//       status: "active",
//       phone: "+237 677 123 456",
//       website: "www.lycee-yaounde.edu.cm"
//     },
//     {
//       id: 2,
//       name: "Collège Français de Douala",
//       type: "Private French School",
//       location: "Douala, Littoral",
//       adminName: "Marie Dupont",
//       adminEmail: "marie.dupont@college-douala.edu.cm",
//       studentsCount: 800,
//       eventsCount: 18,
//       logo: "https://api.dicebear.com/7.x/shapes/svg?seed=CollegeDouala",
//       approvedDate: "2024-02-20T14:20:00Z",
//       status: "active",
//       phone: "+237 699 987 654",
//       website: "www.college-francais-douala.edu.cm"
//     }
//   ]);

//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
//     let password = '';
//     for (let i = 0; i < 12; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return password;
//   };

//   const handleViewDetails = (item: SchoolRequest | ApprovedSchool) => {
//     setSelectedRequest(item);
//     setShowDetailsModal(true);
//   };

//   const handleValidateRequest = (request: SchoolRequest) => {
//     setSelectedRequest(request);
//     setValidationForm({
//       logo: null,
//       schoolAdminName: '',
//       password: generatePassword(),
//       customMessage: `Dear ${request.organizerName},\n\nCongratulations! Your request to add "${request.schoolName}"
//        to our platform has been approved.\n\nYour school admin credentials:\nUsername: ${request.organizerEmail}\nPassword: [PASSWORD]
//        \n\nYou can now log in to manage your school's events.\n\nBest regards,\nPlatform Admin Team`
//     });
//     setShowValidationModal(true);
//   };

//   const handleRejectRequest = (request: SchoolRequest) => {
//     setSelectedRequest(request);
//     setRejectionForm({
//       reason: '',
//       customMessage: `Dear ${request.organizerName},\n\nThank you for your interest in joining our platform. Unfortunately, we cannot approve your request for "
//       ${request.schoolName}" at this time.\n\nReason: [REASON]\n\nYou may resubmit your request after addressing the mentioned concerns.\n\nBest regards,\nPlatform Admin Team`
//     });
//     setShowRejectionModal(true);
//   };

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       setValidationForm(prev => ({
//         ...prev,
//         logo: file
//       }));
//     }
//   };

//   const submitValidation = () => {
//     const newSchool: ApprovedSchool = {
//       id: Date.now(),
//       name: (selectedRequest as SchoolRequest).schoolName,
//       type: (selectedRequest as SchoolRequest).schoolType,
//       location: (selectedRequest as SchoolRequest).location,
//       adminName: validationForm.schoolAdminName,
//       adminEmail: (selectedRequest as SchoolRequest).organizerEmail,
//       studentsCount: (selectedRequest as SchoolRequest).studentsCount,
//       eventsCount: 0,
//       logo: validationForm.logo ? URL.createObjectURL(validationForm.logo) : `https://api.dicebear.com/7.x/shapes/svg?seed=${(selectedRequest as SchoolRequest).schoolName}`,
//       approvedDate: new Date().toISOString(),
//       status: "active",
//       phone: (selectedRequest as SchoolRequest).phone,
//       website: (selectedRequest as SchoolRequest).website
//     };

//     setApprovedSchools(prev => [...prev, newSchool]);
//     setSchoolRequests(prev => prev.filter(req => req.id !== (selectedRequest as SchoolRequest).id));
//     setShowValidationModal(false);
//     setSelectedRequest(null);
//   };

//   const submitRejection = () => {
//     setSchoolRequests(prev => prev.filter(req => req.id !== (selectedRequest as SchoolRequest).id));
//     setShowRejectionModal(false);
//     setSelectedRequest(null);
//   };

//   const filteredRequests = schoolRequests.filter(request =>
//     request.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     request.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     request.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredSchools = approvedSchools.filter(school =>
//     school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     school.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     school.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );


//   const getStatusBadge = (status: string) => {
//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//         status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//       }`}>
//         {status.toUpperCase()}
//       </span>
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Pagination logic
//   const totalPages = Math.ceil((activeTab === 'requests' ? filteredRequests : filteredSchools).length / itemsPerPage);
//   const currentRequests: SchoolRequest[] = filteredRequests.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const currentSchools: ApprovedSchool[] = filteredSchools.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="h-screen w-full overflow-y-scroll  overflow-x-hidden p-6">

//       {/* Header */}
//       <div className="mb-8 rounded-xl bg-gray-100 shadow-lg p-3">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 text-transparent bg-clip-text">Schools Management</h1>
//             <p className="text-gray-600 mt-1">Manage school requests and approved institutions.</p>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => {
//                 setActiveTab('requests');
//                 setCurrentPage(1);
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm  ${
//                 activeTab === 'requests'
//                   ? 'border-purple-500 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Pending Requests
//               <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
//               {schoolRequests.length}
//               </span>
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab('schools');
//                 setCurrentPage(1);
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'schools'
//                   ? 'border-purple-500 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Approved Schools      
//               <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
//               {schoolRequests.length}
//               </span>
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <input
//             type="text"
//             placeholder={activeTab === 'requests' ? "Search requests..." : "Search schools..."}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-lg md:grid grid-cols-1 gap-4 p-4 shadow-xl">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {activeTab === 'requests' ? (
//                   <>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       School Information
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Organizer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type & Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Students
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Request Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </>
//                 ) : (
//                   <>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       School
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Admin
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type & Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Students
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Events
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {activeTab === 'requests'
//                 ? currentRequests.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
//                               <School className="h-5 w-5 text-purple-600" />
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{item.schoolName}</div>
//                               <div className="text-sm text-gray-500">{item.phone}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{item.organizerName}</div>
//                           <div className="text-sm text-gray-500">{item.organizerEmail}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{item.schoolType}</div>
//                           <div className="text-sm text-gray-500">{item.location}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{item.studentsCount.toLocaleString()}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{formatDate(item.requestDate)}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleViewDetails(item)}
//                               className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
//                               title="View Details"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleValidateRequest(item)}
//                               className="p-1 text-gray-400 hover:text-green-600 transition-colors"
//                               title="Validate"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleRejectRequest(item)}
//                               className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                               title="Reject"
//                             >
//                               <XCircle className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     </tr>
//                   ))
//                 : currentSchools.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <img
                              
//                               alt={item.name}
//                               className="h-10 w-10  rounded-lg object-cover mr-3"
//                             />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{item.name}</div>
//                               <div className="text-sm text-gray-500">{item.phone}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{item.adminName}</div>
//                           <div className="text-sm text-gray-500">{item.adminEmail}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{item.type}</div>
//                           <div className="text-sm text-gray-500">{item.location}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{item.studentsCount.toLocaleString()}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{item.eventsCount}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {getStatusBadge(item.status)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleViewDetails(item)}
//                               className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
//                               title="View Details"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             <button
//                               className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
//                               title="Send Email"
//                             >
//                               <Mail className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     </tr>
//                   ))}
//             </tbody>
//           </table>

//           {/* Empty State */}
//           {(activeTab === 'requests' ? currentRequests.length === 0 : currentSchools.length === 0) && (
//             <div className="text-center py-12">
//               <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {activeTab === 'requests' ? 'No pending requests' : 'No approved schools'}
//               </h3>
//               <p className="text-gray-500">
//                 {activeTab === 'requests' 
//                   ? 'All school requests have been processed.' 
//                   : 'Schools will appear here after validation.'
//                 }
//               </p>
//             </div>
//           )}
//         </div>
      
//         {/* Pagination */}
//         <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center text-sm text-gray-700">
//               <p>
//                 {activeTab==='requests' ? 
//                  `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredRequests.length)} of ${filteredRequests.length} results`
//                  :
//                  `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredSchools.length)} of ${filteredSchools.length} results`
//                  }
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 const page = i + 1;
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-3 py-1 border rounded text-sm ${
//                       currentPage === page
//                         ? 'bg-purple-600 text-white border-purple-600'
//                         : 'border-gray-300 text-gray-500 bg-purple-100'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               })}
              
//               <button
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 bg-purple-700"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Details Modal */}
//       {showDetailsModal && selectedRequest && (
//         <AdminSchoolRequest
//           isOpen={showDetailsModal}
//           onClose={() => setShowDetailsModal(false)}
//           activeTab={activeTab}
//           selectedRequest={selectedRequest}
//           setShowDetailsModal={setShowDetailsModal}
//           handleRejectRequest={handleRejectRequest}
//           handleValidateRequest={handleValidateRequest}
//           formatDate={formatDate}
//         />
        
//       )}

//       {/* Validation Modal */}
//       {showValidationModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Validate School Request
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 {(selectedRequest as SchoolRequest).schoolName}
//               </p>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Logo Upload */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   School Logo
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//                   <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoUpload}
//                     className="hidden"
//                     id="logo-upload"
//                   />
//                   <label
//                     htmlFor="logo-upload"
//                     className="cursor-pointer text-purple-600 hover:text-purple-700"
//                   >
//                     Click to upload logo
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
//                 </div>
//               </div>

//               {/* School Admin Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   School Admin Name
//                 </label>
//                 <input
//                   type="text"
//                   value={validationForm.schoolAdminName}
//                   onChange={(e) => setValidationForm(prev => ({
//                     ...prev,
//                     schoolAdminName: e.target.value
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter admin name"
//                 />
//               </div>

//               {/* Generated Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Generated Password
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={validationForm.password}
//                     onChange={(e) => setValidationForm(prev => ({
//                       ...prev,
//                       password: e.target.value
//                     }))}
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                   />
//                   <button
//                     onClick={() => setValidationForm(prev => ({
//                       ...prev,
//                       password: generatePassword()
//                     }))}
//                     className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                   >
//                     Generate New
//                   </button>
//                 </div>
//               </div>

//               {/* Custom Message */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Validation Message
//                 </label>
//                 <textarea
//                   value={validationForm.customMessage}
//                   onChange={(e) => setValidationForm(prev => ({
//                     ...prev,
//                     customMessage: e.target.value
//                   }))}
//                   rows={6}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                   placeholder="Customize the validation email message..."
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowValidationModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitValidation}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Validate & Send Email
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rejection Modal */}
//       {showRejectionModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Reject School Request
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 {(selectedRequest as SchoolRequest).schoolName}
//               </p>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Rejection Reason */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rejection Reason
//                 </label>
//                 <select
//                   value={rejectionForm.reason}
//                   onChange={(e) => setRejectionForm(prev => ({
//                     ...prev,
//                     reason: e.target.value
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="">Select a reason...</option>
//                   <option value="Incomplete documentation">Incomplete documentation</option>
//                   <option value="Invalid school credentials">Invalid school credentials</option>
//                   <option value="Duplicate request">Duplicate request</option>
//                   <option value="Does not meet requirements">Does not meet requirements</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               {/* Custom Message */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rejection Message
//                 </label>
//                 <textarea
//                   value={rejectionForm.customMessage}
//                   onChange={(e) => setRejectionForm(prev => ({
//                     ...prev,
//                     customMessage: e.target.value
//                   }))}
//                   rows={6}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                   placeholder="Customize the rejection email message..."
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowRejectionModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitRejection}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Reject & Send Email
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminSchool;




// import { motion, type Variants } from "framer-motion";
// import { ArrowLeft, ArrowRight, Building2, Calendar, Flower2, GraduationCap, Heart, PartyPopper, School, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import type { EventType,EventFormData, SchoolInfo } from "../../components/Organizer/Events/type";
// import Modal from "../../components/Organizer/Modal";
// import CreateCustomeEventFields from "../../components/Organizer/Events/CreateCustomeEventFields";
// import CreateFormCustomization from "../../components/Organizer/Events/CreateFormCustomization";
// import CreateFinalConfiguration from "./CreateFinalConfiguration";
// import CreateReceiptCustomization from "./CreateReceiptCustomization";

// function CreateEvents() {
//   const [showSchoolModal, setShowSchoolModal] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0); 
//   const [eventNameError, setEventNameError] = useState('');
//   const [goalError, setGoalError] = useState('');
//   const [deadlineError, setDeadlineError] = useState('');
//   const [SchoolData, setSchoolData] = useState({
//     name: '',
//     password: '',
//   });
//   const handleSubmit = async (e: React.FormEvent) =>{
//     e.preventDefault()
//   }
//   const eventTypes = [
//     { id: 'school', name: 'School Event', icon: School, color: 'from-blue-500 to-indigo-600' },
//     { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-pink-500 to-rose-600' },
//     { id: 'funeral', name: 'Funeral', icon: Flower2, color: 'from-gray-500 to-slate-600' },
//     { id: 'birthday', name: 'Birthday', icon: PartyPopper, color: 'from-yellow-500 to-orange-600' },
//     { id: 'business', name: 'Business', icon: Building2, color: 'from-green-500 to-emerald-600' },
//     { id: 'charity', name: 'Charity', icon: Users, color: 'from-teal-500 to-cyan-600' },
//     { id: 'conference', name: 'Conference', icon: GraduationCap, color: 'from-purple-500 to-violet-600' },
//     { id: 'other', name: 'Other', icon: Calendar, color: 'from-gray-500 to-slate-600' }
//   ];
//   const [formData, setFormData] = useState<EventFormData>({
//     eventType: 'school',
//     organizerName: '',
//     organizerPassword: '',
//     eventName: '',
//     fields: [
//       { id: '1', label: 'Name', type: 'text', required: true ,readOnly:false},
//       { id: '2', label: 'Amount', type: 'number', required: true,readOnly:false }
//     ],
//     paymentMethods: ['momo', 'om'],
//     formColors: {
//       primary: '#7c3aed',
//       secondary: '#a855f7',
//       text: '#1f2937',
//       background: '#f9fafb'
//     },
//     eventTitle: '',
//     eventDescription: '',
//     walletType: 'app_wallet',
//     fundraisingGoal: 0,
//     deadline: '',
//     contributorMessage: '',
//     receiptConfig: {
//       includeFields: [],
//       includeQR: true,
//       additionalFields: {},
//       school: {
//         name: '',
//         link: '',
//         contact: '',
//         logoUrl: '',
//       },
//       layout: 'one',
//       align: 'left',
//     },
//     eventCard: {
//       image: '',
//       title: '',
//       description: ''
//     }
//   });
//   const schools: SchoolInfo[] = [
//     { id: '1', name: 'Université de Yaoundé I', logo: 'public/A1 (1).jpg' },
//     { id: '2', name: 'École Normale Supérieure', logo: 'public/A1.jpg', email: 'ens@cameroon.edu', contact: '+237987654321', location: 'Yaoundé' },
//     { id: '3', name: 'Collège Vogt', logo: 'public/F1 (1).jpg' }
//   ]

//   const selectedSchool = schools.find(s => s.id === formData.schoolId)  ;

//   const StepIndicator = () => {
//     const steps = [
//       { number: 1, title: 'Fields' },
//       { number: 2, title: 'Design' },
//       { number: 3, title: 'Settings' },
//     ];
    
//     if (formData.eventType === 'school') {
//       steps.push({ number: 4, title: 'Receipt' });
//     }

//     return (
//       <div className="flex w-full justify-center mb-8 ">
//         <div className="flex items-center space-x-2 sm:space-x-4">
//           {steps.map((step, index) => (
//             <div key={step.number} className="flex items-center">
//               <button
//                 onClick={() => {
//                   // Only allow navigation to completed steps
//                   const completedSteps = formData.eventType === 'school' ? 
//                     (currentStep >= 4 ? 4 : currentStep) : 
//                     (currentStep >= 3 ? 3 : currentStep);
                  
//                   if (step.number <= completedSteps) {
//                     setCurrentStep(step.number);
//                   }
//                 }}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
//                   step.number <= currentStep
//                     ? 'bg-purple-600 text-white'
//                     : step.number <= (formData.eventType === 'school' ? 4 : 3)
//                     ? 'bg-gray-200 text-gray-600'
//                     : 'bg-gray-100 text-gray-400'
//                 } ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
//               >
//                 {step.number}
//               </button>
//               {index < steps.length - 1 && (
//                 <div
//                   className={`md:w-16 w-6 h-1 mx-2 ${
//                     step.number < currentStep ? 'bg-purple-600' : 'bg-gray-200'
//                   }`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//  useEffect(() => {
//     if (formData.eventName && formData.eventName.length < 3) {
//       setEventNameError('Event name must be at least 3 characters');
//     } else {
//       setEventNameError('');
//     }
//   }, [formData.eventName]);
//  // Validate fundraising goal
//   useEffect(() => {
//     if (formData.fundraisingGoal > 0 && formData.fundraisingGoal < 5000) {
//       setGoalError('Fundraising goal cannot be less than 5000 FCFA');
//     } else {
//       setGoalError('');
//     }
//   }, [formData.fundraisingGoal]);

//   // Validate deadline
//   useEffect(() => {
//     if (formData.deadline) {
//       const now = new Date();
//       const deadlineDate = new Date(formData.deadline);
//       if (deadlineDate <= now) {
//         setDeadlineError('Deadline must be in the future');
//       } else {
//         setDeadlineError('');
//       }
//     }
//   }, [formData.deadline]);

//   const NavigationButtons = () => (
//     <div className="flex justify-between lg:justify-around jus mt-8">
//       <button
//         onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
//         disabled={currentStep === 1}
//         className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         <span>Previous</span>
//       </button>
      
//       {currentStep < (formData.eventType === 'school' ? 4 : 3) && (
//         <button
//           onClick={() => {
//             // Validation for step 2
//             if (currentStep === 1) {
//               if (!formData.eventName.trim()) {
//                 setEventNameError('Event name is required');
//                 return;
//               }
//               if (formData.eventName.length < 3) {
//                 setEventNameError('Event name must be at least 3 characters');
//                 return;
//               }
//             }
            
//             // Validation for step 4
//             if (currentStep === 3) {
//               if (formData.fundraisingGoal > 0 && formData.fundraisingGoal < 5000) {
//                 setGoalError('Fundraising goal cannot be less than 5000 FCFA');
//                 return;
//               }
//               if (formData.deadline) {
//                 const now = new Date();
//                 const deadlineDate = new Date(formData.deadline);
//                 if (deadlineDate <= now) {
//                   setDeadlineError('Deadline must be in the future');
//                   return;
//                 }
//               }
//             }
            
//             setCurrentStep(prev => prev + 1);
//           }}
//           className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//         >
//           <span>Next</span>
//           <ArrowRight className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );

//   const cardVariants ={
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     },
//     hover: {
//       y: -5,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 10
//       }
//     }
//   }satisfies Variants;

//   return (
//     <motion.div 
//     className="h-full relative w-[100vw] md:w-full bg-gradient-to-br text-gray-700  "
//     >
//       <div className=" overflow-y-scroll h-screen p-4 ">
//         <div className="text-center p-4">
//           <h1 className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//             Choose Event Type
//           </h1>
//           <p className="text-gray-600 text-2xl mt-2">Select the type of event you want to create</p>
//         </div>
        
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {eventTypes.map((type) => {
//             const Icon = type.icon;
//             return (
//               <motion.button
//                 variants={cardVariants}
//                 key={type.id}
//                 className={`p-6 rounded-xl border-2 transition-all duration-200 ${
//                   formData.eventType === type.id
//                     ? 'border-purple-500 bg-purple-50'
//                     : 'border-gray-200 bg-gray-50 hover:border-purple-300'
//                 }`}
//                 onClick={() => {

//                   setFormData(prev => ({ ...prev, eventType: type.id as EventType }));
//                  (type.id === 'school') ? setShowSchoolModal(true) : setCurrentStep(1);
//                 }}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
//                   <Icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="font-semibold text-lg">{type.name}</h3>
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>
//       {currentStep != 0 && 
//        <div className="h-screen w-full  absolute inset-0 overflow-y-scroll bg-gradient-to-br text-gray-700 from-purple-50 to-blue-50 p-4">
//         <StepIndicator/>
//           {currentStep === 1 && <CreateCustomeEventFields formData={formData} setFormData={setFormData} eventNameError={eventNameError}/>} 
//           {currentStep === 2 && <CreateFormCustomization formData={formData} setFormData={setFormData} />}
//           {currentStep === 3 && <CreateFinalConfiguration formData={formData} setFormData={setFormData} goalError={goalError} deadlineError={deadlineError}/>}
//           {currentStep === 4 && <CreateReceiptCustomization formData={formData} setFormData={setFormData}/>} 
//           <NavigationButtons />
//        </div>
//       }

//       {/* School Event Modal */}
//       <Modal isOpen={showSchoolModal} onClose={() => setShowSchoolModal(false)}>
//         <motion.div
//           className="bg-white rounded-xl p-6 w-full max-w-md"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//         >
//           {/* School Logo Preview */}
//           {selectedSchool &&(
//           <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="my-2 flex flex-col  w-full justify-center items-center "
//           >
//           <div className="w-18 h-18 bg-gray-100 rounded-full flex  items-center justify-center overflow-hidden mr-3">
//               {/* Logo will appear here when school is selected */}
//               <img 
//               src={selectedSchool.logo }
//               className="w-full h-full object-contain"
//               />
//           </div>
//           <span id="school-name" className="font-medium text-gray-700">{selectedSchool.name}</span>
//           </motion.div>
//           )}
//           <div className="space-y-4">
//             <form onSubmit={handleSubmit}>
//               <label className="block text-sm font-medium mb-2">Select School</label>
//               <div className="flex items-center space-x-3 mb-2">
//                 <select
//                   className="flex-1 p-3 border rounded-lg"
//                   value={formData.schoolId || ''}
//                   onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
//                 >
//                   <option value="">Choose a school...</option>
//                   {schools.map(school => (
//                     <option key={school.id} value={school.id}>{school.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Organizer Name</label>
//                 <input
//                   type="text"
//                   className="w-full p-3 border rounded-lg"
//                   value={SchoolData.name}
//                   onChange={(e) =>setSchoolData(prev => ({ ...prev, name: e.target.value }))}
//                   placeholder="Your name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Password</label>
//                 <input
//                   type="password"
//                   className="w-full p-3 border rounded-lg"
//                   value={SchoolData.password}
//                   onChange={(e) => setSchoolData(prev => ({ ...prev, password: e.target.value }))}
//                   placeholder="Organizer password"
//                 />
//               </div>
//               <div className="flex space-x-3 mt-6">
//               <button
//                 className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
//                 onClick={() => setShowSchoolModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
//                 disabled={!SchoolData.name || !SchoolData.password}
//                 onClick={() => {
//                   setShowSchoolModal(false);
//                   setCurrentStep(1);
//                 }}
//               >
//                 Proceed
//               </button>
//             </div>
//             <small className="mt-10">
//               not seeing your school? <button className="text-purple-900 hover:cursor-pointer hover:text-purple-700">Add My School</button>
//             </small>
//             </form>

//           </div>
//         </motion.div>
//       </Modal>
//     </motion.div>
//   )
// }

// export default CreateEvent
