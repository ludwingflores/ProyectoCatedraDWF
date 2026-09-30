import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    const esRutaPublicaAuth =
      config.url === '/auth/login' ||
      config.url === '/auth/forgot-password' ||
      config.url === '/auth/reset-password'

    if (token && !esRutaPublicaAuth) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esRutaLogin = error.config?.url === '/auth/login'

    if (error.response?.status === 401 && !esRutaLogin) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api