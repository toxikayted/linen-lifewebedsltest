import axios from 'axios'

// Always use relative path - Vite proxy handles local development
// Vercel routes /api to serverless functions in production
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ll-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('ll-token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api