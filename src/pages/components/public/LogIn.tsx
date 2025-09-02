import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [currentError, setCurrentError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear error after 3 seconds
  useEffect(() => {
    if (currentError) {
      const timer = setTimeout(() => {
        setCurrentError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentError]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user types
    if (currentError) {
      setCurrentError('');
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  // Form validation
  const validateForm = () => {
    if (!formData.email.trim()) {
      setCurrentError('Email is required');
      return false;
    } 
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setCurrentError('Please enter a valid email');
      return false;
    }
    
    if (!formData.password) {
      setCurrentError('Password is required');
      return false;
    }
    
    return true;
  };

// Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validateForm()) {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCurrentError('Invalid email or password');
      } else {
        console.log('Login successful:', result);
        // You can save JWT token or user info here, for example:
        // localStorage.setItem('token', result.token);
        // Redirect to dashboard
        if (result.user.role === "SUPER_ADMIN") {
            // navigate("/super-admin-dashboard");
            console.log("Super Admin logged in");
            
          } else if (result.user.role === "ORGANIZER") {
            // navigate("/organizer-dashboard");
          }
      }
    } catch (error) {
      setCurrentError('Server error, please try again later');
    } finally {
      setIsLoading(false);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-800/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden" // Increased max-width
      >
        <div className="md:flex">
          {/* Header section - wider for PC */}
          <div className="bg-gradient-to-r from-purple-800 to-purple-900/40 p-8 text-white md:w-2/5 md:flex md:flex-col md:justify-center md:order-2">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="mt-3 text-lg text-gray-200 font-semibold">Login to your account</p>
            </div>
          </div>
          
          {/* Form section - wider for PC */}
          <div className="p-8 md:w-3/5 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
              {/* Single error display */}
              {currentError && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r"
                >
                  <p className="text-red-700 font-medium">{currentError}</p>
                </motion.div>
              )}
              
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="space-y-6"
              >
                {/* Email Field - larger */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 text-lg" /> {/* Larger icon */}
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-12 w-full px-4 py-3 rounded-lg border ${currentError.includes('email') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 text-base`} // Larger input
                      placeholder="example@domain.com"
                    />
                  </div>
                </motion.div>
                                
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-12 w-full px-4 py-3 rounded-lg border ${currentError.includes('Password') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 text-base`}
                      placeholder="••••••••"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash className="text-gray-400"  /> : <FaEye className="text-gray-400"  />}
                    </div>
                  </div>
                </motion.div>
  
                {/* Remember Me & Forgot Password */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" // Larger checkbox
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      Forgot password?
                    </a>
                  </div>
                </motion.div>
                
                {/* Submit Button - larger */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-800 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-70 text-base" // Larger button
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FaSignInAlt className="mr-3 text-lg" /> 
                    )}
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </motion.div>
                
                {/* Sign up Link */}
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  className="text-center text-sm pt-2" // Added padding
                >
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/SignUp" className="font-medium text-purple-800 hover:text-purple-700">
                      Sign up
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

export default LoginPage;