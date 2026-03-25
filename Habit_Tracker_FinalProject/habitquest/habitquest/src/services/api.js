import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habitquest_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses and errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Network error'
    if (error.response?.status === 401) {
      localStorage.removeItem('habitquest_token')
      localStorage.removeItem('habitquest_user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    return Promise.reject({ ...error, message: msg })
  }
)

export default api

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ─── Habits ────────────────────────────────────────────────────────────────
export const habitService = {
  getAll: () => api.get('/habits'),
  create: (data) => api.post('/habits', data),
  complete: (id) => api.put(`/habits/${id}/complete`),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
}

// ─── Tasks ─────────────────────────────────────────────────────────────────
export const taskService = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  complete: (id) => api.put(`/tasks/${id}/complete`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}
