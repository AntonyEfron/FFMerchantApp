import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/src/store/authStore';

const API_BASE_URL = 'https://ff-api-web-2.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to get token from SecureStore:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap ApiResponse pattern & handle 401
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap { success, data } pattern
    if (response.data?.success !== undefined && response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      const { logout } = useAuthStore.getState();
      await logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
