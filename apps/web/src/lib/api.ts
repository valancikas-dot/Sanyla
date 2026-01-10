import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  signup: (data: any) => apiClient.post('/auth/signup', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),

  // Projects
  getProjects: (orgId: string) => apiClient.get(`/orgs/${orgId}/projects`),
  createProject: (orgId: string, data: any) => apiClient.post(`/orgs/${orgId}/projects`, data),
  getProject: (projectId: string) => apiClient.get(`/projects/${projectId}`),
  updateProject: (projectId: string, data: any) => apiClient.patch(`/projects/${projectId}`, data),
  deleteProject: (projectId: string) => apiClient.delete(`/projects/${projectId}`),

  // AI Generation
  generateStrategy: (projectId: string) => apiClient.post(`/projects/${projectId}/ai/strategy`),
  generateCalendar: (projectId: string) => apiClient.post(`/projects/${projectId}/ai/calendar`),
  generatePosts: (projectId: string) => apiClient.post(`/projects/${projectId}/ai/posts`),
  generateReels: (projectId: string) => apiClient.post(`/projects/${projectId}/ai/reels`),
  generateInsights: (projectId: string, analyticsData?: any) =>
    apiClient.post(`/projects/${projectId}/ai/insights`, { analyticsData }),

  // Content
  getContent: (projectId: string, type?: string) =>
    apiClient.get(`/projects/${projectId}/content`, { params: { type } }),
  getContentItem: (contentId: string) => apiClient.get(`/content/${contentId}`),

  // Scheduler
  createSchedule: (projectId: string, data: any) =>
    apiClient.post(`/projects/${projectId}/schedule`, data),
  getSchedule: (projectId: string) => apiClient.get(`/projects/${projectId}/schedule`),
  cancelSchedule: (jobId: string) => apiClient.post(`/schedule/${jobId}/cancel`),

  // Analytics
  getAnalyticsSummary: (projectId: string) =>
    apiClient.get(`/projects/${projectId}/analytics/summary`),

  // Social Media
  get: (url: string) => apiClient.get(url),
  post: (url: string, data?: any) => apiClient.post(url, data),
  patch: (url: string, data?: any) => apiClient.patch(url, data),
  put: (url: string, data?: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
};
