import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Jobs API
export const jobsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    location?: string;
    category?: string;
  }) => api.get('/jobs', { params }),

  getById: (id: number) => api.get(`/jobs/${id}`),

  search: (keyword: string, limit?: number) =>
    api.get('/jobs/search', { params: { keyword, limit } }),

  getCategories: () => api.get('/jobs/categories'),
};

// Favorites API
export const favoritesApi = {
  getAll: () => api.get('/favorites'),

  add: (jobId: number) => api.post('/favorites', { jobId }),

  remove: (id: number) => api.delete(`/favorites/${id}`),

  check: (jobId: number) => api.get(`/favorites/check/${jobId}`),
};

// Subscriptions API
export const subscriptionsApi = {
  getAll: () => api.get('/subscriptions'),

  create: (data: {
    keyword?: string;
    location?: string;
    category?: string;
    frequency?: string;
  }) => api.post('/subscriptions', data),

  update: (id: number, data: any) => api.put(`/subscriptions/${id}`, data),

  remove: (id: number) => api.delete(`/subscriptions/${id}`),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/me'),

  updateProfile: (data: any) => api.put('/users/me', data),
};

export default api;
