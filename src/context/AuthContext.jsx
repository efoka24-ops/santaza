import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // En production, utiliser la même origine. En dev, utiliser VITE_API_URL
  const API_URL = import.meta.env.VITE_API_URL || (
    typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}/api`
      : 'http://127.0.0.1:3000/api'
  )

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.valid) {
        setAdmin(response.data.admin)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      })

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token)
        setAdmin(response.data.admin)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur de connexion'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      admin,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
