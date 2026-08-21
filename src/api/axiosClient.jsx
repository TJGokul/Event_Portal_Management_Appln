import axios from 'axios';

// Create a configured Axios client instance
const axiosClient = axios.create({
  baseURL: '/', // Points to the relative root where MSW intercepts calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the active role and student ID
axiosClient.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('voting_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role) {
          config.headers['x-user-role'] = user.role;
        }
        if (user.studentId) {
          config.headers['x-student-id'] = user.studentId;
        }
      } catch (e) {
        console.error('Error parsing user session in Axios interceptor:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors into standard project shapes
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Return just the payload (e.g. { success: true, data: ... })
  },
  (error) => {
    // If the mock server returns a JSON error, extract it
    const errorData = error.response?.data;
    if (errorData && errorData.success === false) {
      return Promise.reject(errorData.error);
    }
    
    // Fallback error shape
    return Promise.reject({
      code: error.response?.status === 403 ? 'FORBIDDEN' : 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'An error occurred',
      details: error.response?.data?.details || null,
    });
  }
);

export default axiosClient;
