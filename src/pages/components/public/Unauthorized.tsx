import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaSignInAlt } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-800/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </motion.div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Go to Home
          </Link>

          <Link
            to="/login"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
          >
            <FaSignInAlt className="mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
