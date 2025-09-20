// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FaUser, 
//   FaEnvelope, 
//   FaBuilding, 
//   FaPhone, 
//   FaSave, 
//   FaEdit, 
//   FaCamera,
//   FaShield,
//   FaSchool,
//   FaUserTie
// } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// // Types
// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   profileImage: string | null;
//   phone: string;
//   role: 'super_admin' | 'organizer' | 'school_admin';
//   organization?: string;
//   school?: string;
//   permissions?: string[];
// }

// interface ProfileFormData {
//   name: string;
//   email: string;
//   phone: string;
//   organization?: string;
//   school?: string;
// }

// function ProfilePage() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState<ProfileFormData>({
//     name: '',
//     email: '',
//     phone: '',
//     organization: '',
//     school: ''
//   });
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const fileInputRef = useState<HTMLInputElement | null>(null);

//   // Mock API calls - Replace with actual API endpoints
//   const fetchUserProfile = async () => {
//     try {
//       setIsLoading(true);
//       // Replace with actual API call
//       const response = await fetch('/api/user/profile');
//       const userData = await response.json();
//       setUser(userData);
//       setFormData({
//         name: userData.name,
//         email: userData.email,
//         phone: userData.phone,
//         organization: userData.organization,
//         school: userData.school
//       });
//     } catch (error) {
//       toast.error('Failed to load profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateProfile = async (data: ProfileFormData) => {
//     try {
//       // Replace with actual API call
//       const response = await fetch('/api/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
      
//       if (response.ok) {
//         const updatedUser = await response.json();
//         setUser(updatedUser);
//         toast.success('Profile updated successfully');
//         setIsEditing(false);
//       } else {
//         throw new Error('Update failed');
//       }
//     } catch (error) {
//       toast.error('Failed to update profile');
//     }
//   };

//   const uploadProfileImage = async (file: File) => {
//     try {
//       const formData = new FormData();
//       formData.append('profileImage', file);
      
//       // Replace with actual API call
//       const response = await fetch('/api/user/profile/image', {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (response.ok) {
//         const { imageUrl } = await response.json();
//         setUser(prev => prev ? { ...prev, profileImage: imageUrl } : null);
//         toast.success('Profile image updated');
//       }
//     } catch (error) {
//       toast.error('Failed to upload image');
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateProfile(formData);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       uploadProfileImage(file);
//     }
//   };

//   const getRoleIcon = () => {
//     switch (user?.role) {
//       case 'super_admin':
//         return <FaShield className="text-red-500" />;
//       case 'school_admin':
//         return <FaSchool className="text-blue-500" />;
//       case 'organizer':
//         return <FaUserTie className="text-green-500" />;
//       default:
//         return <FaUser className="text-gray-500" />;
//     }
//   };

//   const getRoleDisplayName = () => {
//     switch (user?.role) {
//       case 'super_admin':
//         return 'Super Administrator';
//       case 'school_admin':
//         return 'School Administrator';
//       case 'organizer':
//         return 'Event Organizer';
//       default:
//         return 'User';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   if (!user) {
//     return <div>User not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-6 text-white">
//           <div className="flex flex-col sm:flex-row items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Profile Settings</h1>
//               <p className="opacity-90">Manage your account information</p>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsEditing(!isEditing)}
//               className="mt-4 sm:mt-0 px-6 py-2 bg-white text-purple-800 rounded-lg font-medium flex items-center gap-2"
//             >
//               {isEditing ? <FaSave /> : <FaEdit />}
//               {isEditing ? 'Save Changes' : 'Edit Profile'}
//             </motion.button>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Profile Image Section */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="flex flex-col items-center mb-8"
//           >
//             <div className="relative">
//               <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-purple-100">
//                 {user.profileImage ? (
//                   <img
//                     src={user.profileImage}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <FaUser className="text-gray-400 text-4xl" />
//                 )}
//               </div>
//               {isEditing && (
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => fileInputRef.current?.click()}
//                   className="absolute bottom-0 right-0 bg-purple-800 text-white p-3 rounded-full shadow-lg"
//                 >
//                   <FaCamera />
//                 </motion.button>
//               )}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageUpload}
//                 accept="image/*"
//                 className="hidden"
//               />
//             </div>
//             <div className="mt-4 text-center">
//               <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
//               <div className="flex items-center justify-center gap-2 mt-1">
//                 {getRoleIcon()}
//                 <span className="text-gray-600">{getRoleDisplayName()}</span>
//               </div>
//             </div>
//           </motion.div>

//           {/* Profile Form */}
//           <motion.form
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             onSubmit={handleSubmit}
//             className="space-y-6"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaUser className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaEnvelope className="text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>

//               {/* Phone Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaPhone className="text-gray-400" />
//                   </div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>

//               {/* Organization Field (for organizers) */}
//               {user.role === 'organizer' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Organization
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FaBuilding className="text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       name="organization"
//                       value={formData.organization || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* School Field (for school admins) */}
//               {user.role === 'school_admin' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     School
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FaSchool className="text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       name="school"
//                       value={formData.school || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             {isEditing && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex gap-4 pt-6 border-t"
//               >
//                 <motion.button
//                   type="submit"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="px-6 py-2 bg-purple-800 text-white rounded-lg font-medium flex items-center gap-2"
//                 >
//                   <FaSave /> Save Changes
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
//                 >
//                   Cancel
//                 </motion.button>
//               </motion.div>
//             )}
//           </motion.form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default ProfilePage;