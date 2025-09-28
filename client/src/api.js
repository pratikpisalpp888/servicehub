import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Provider endpoints
export const providerAPI = {
  requestProvider: (providerData) => api.post('/providers/request', providerData),
  getNearbyProviders: (params) => api.get('/providers/nearby', { params }),
  getPendingProviders: () => api.get('/admin/providers/pending'),
  reviewProviderRequest: (providerId, approved) => 
    api.put(`/admin/providers/${providerId}/request`, { approved }),
  getAllProviders: () => api.get('/providers'),
  getProviderById: (providerId) => api.get(`/providers/${providerId}`),
  searchProviders: (query) => api.get(`/providers/search?query=${query}`),
};

// Booking endpoints
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  payVisitCharge: (bookingId) => api.post(`/bookings/${bookingId}/pay-visit-charge`),
  completeBooking: (bookingId) => api.put(`/bookings/${bookingId}/complete`),
  getUserBookings: () => api.get('/bookings/my-bookings'),
};

// Chat endpoints
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

// Review endpoints
export const reviewAPI = {
  addReview: (reviewData) => api.post('/reviews', reviewData),
  getProviderReviews: (providerId) => api.get(`/reviews/${providerId}`),
};

export default api;