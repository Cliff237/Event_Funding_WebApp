import axios from 'axios';

// Create an axios instance with default configuration
const apiRequest = axios.create({
  baseURL: 'http://localhost:5000', // Adjust if your backend is on a different port
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token if available
apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiRequest.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part of the response
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('API Error:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
      throw error;
    }
  }
);

// Wrapper function to ensure correct typing
const typedApiRequest = <T = any>(url: string, options?: any): Promise<T> => {
  return apiRequest(url, options) as Promise<T>;
};

export default typedApiRequest;
