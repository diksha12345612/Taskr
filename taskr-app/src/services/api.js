import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
});

// Request interceptor: attach Authorization header
api.interceptors.request.use(
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

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const googleLogin = (data) => api.post('/auth/google', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

// Projects
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}`, data);
export const updateProjectMembers = (id, memberIds) => api.patch(`/projects/${id}/members`, { memberIds });
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Tasks
export const getTasks = (projectId) => {
  const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
  return api.get(url);
};
export const getDashboardStats = () => api.get('/tasks/stats');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (taskId, data) => api.patch(`/tasks/${taskId}`, data);
export const updateTaskStatus = (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status });
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

// Users
export const getUsers = () => api.get('/users');
export const adminCreateUser = (data) => api.post('/users', data);
export const deleteUser = (id) => api.delete(`/users/${id}`);


// Attendance
export const checkIn = () => api.post('/attendance/check-in');
export const checkOut = () => api.patch('/attendance/check-out');
export const getMyAttendance = () => api.get('/attendance/me');

// Leaves
export const requestLeave = (data) => api.post('/leaves', data);
export const getMyLeaves = () => api.get('/leaves/me');
export const getAllLeaves = () => api.get('/leaves');
export const updateLeaveStatus = (id, status) => api.patch(`/leaves/${id}`, { status });

export default api;
