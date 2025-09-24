import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaCheck,  FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';

const SignUp = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptPolicy: false,
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentError, setCurrentError] = useState<string>('');
  const navigate = useNavigate();
  // Clear errors after 3 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0 || currentError) {
      const timer = setTimeout(() => {
        setErrors({}),
        setCurrentError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errors,currentError]);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Clear error when user types
    if (currentError) {
      setCurrentError('');
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle functions
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  // Handle profile image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  
  // Form validation
  const validateForm = () => {
    
    if (!formData.name.trim()) {
      toast.error('Name is required',{
        className: "bg-red-600 text-white font-semibold rounded-lg shadow-md",
        progressClassName: "bg-white"
      });
      setCurrentError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setCurrentError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setCurrentError('Please enter a valid email');
      return false;
    }
    
    if (!formData.password) {
      setCurrentError('Password is required');
      return false;
    } else if (formData.password.length < 8) {
      setCurrentError( 'Password must be at least 8 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setCurrentError('Passwords do not match');
      return false;
    }
    if (!formData.acceptPolicy) {
      setCurrentError('You must accept the terms and conditions');
      return false;
    }
      return true;

  };


  // inside your SignUp component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (fileInputRef.current?.files?.[0]) {
        data.append('profile', fileInputRef.current.files[0]);
      }
  
      const response = await axios.post('http://localhost:5000/api/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Success
      console.log('Signup successful:', response.data);
      toast.success('Account created successfully!');
      
      // Optionally store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
  
      // Redirect to login or dashboard
      // navigate('/logIn');
      
      const result = response.data;
      if (result.user.role === 'SUPER_ADMIN') {
        navigate("/superAdmin/overview");
      } else if (result.user.role === 'ORGANIZER' || result.user.role === 'SCHOOL_ADMIN') {
        navigate("/overview");
      }
  
  
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setCurrentError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setCurrentError('Server error. Please try again later.');
        toast.error('Server error. Please try again later.');
      }
    }
  };
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-fit max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden" 
      >
        <div className="md:flex">
          {/* Header section - moves to right on desktop */}
          <div className="bg-gradient-to-r from-purple-800 to-purple-900/40 p-6 text-white md:w-1/2 md:flex md:flex-col md:justify-center md:order-2">
            <div className="text-center md:flex md:flex-col md:items-center md:justify-center">
              <h1 className="text-2xl md:text-4xl font-bold ">Create Your Account</h1>
              <p className="mt-2 text-gray-200 text-xl font-semibold">Join our event contribution platform</p>
            </div>
          </div>
          
          {/* Form section */}
          <div className="p-6 md:w-1/2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {/* Profile Image Upload - now optional */}
                <motion.div variants={itemVariants} className="flex justify-center">
                  <div className="relative">
                    <div 
                      className="w-24 h-24 rounded-full bg-purple-700/10 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-purple-600"
                      onClick={triggerFileInput}
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-purple-800 text-3xl" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-0 -right-0 bg-purple-700 text-white rounded-full p-2 hover:bg-purple-700 transition"
                      onClick={triggerFileInput}
                    >
                      <FaCamera className="text-sm" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </motion.div>
                
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Organizer237"
                    />
                  </div>
                </motion.div>
                
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="example@domain.com"
                    />
                  </div>
                </motion.div>
                
                 {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="••••••••"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400"/>}
                    </div>
                  </div>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="••••••••"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-gray-400"/> : <FaEye className="text-gray-400"/>}
                    </div>
                  </div>
                </motion.div>
                          
                {/* Accept Policy Checkbox */}
                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptPolicy"
                      name="acceptPolicy"
                      type="checkbox"
                      checked={formData.acceptPolicy}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptPolicy" className="font-medium text-gray-700">
                      I accept the{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-500">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-time flex items-center justify-center"
                  >
                    <FaCheck className="mr-2" /> Create Account
                  </button>
                </motion.div>
                <div className='h-2 w-full'>
                  {currentError && (
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-700 font-medium text-center"
                      >
                        {currentError}
                      </motion.p>
                    )}
                </div>

                {/* Login Link */}
                <motion.div variants={itemVariants} className="text-center text-sm">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/logIn" className="text-purple-600 hover:text-purple-500 font-medium">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
                            
            </form>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default SignUp;