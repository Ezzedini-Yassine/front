import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Request Interceptor: Add access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle token refresh from header
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['new-access-token'];
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login'; // Force logout on refresh failure
    }
    return Promise.reject(error);
  }
);

export default api;