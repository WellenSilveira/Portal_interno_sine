import { createContext, useState, useEffect, useContext } from 'react'
import { getToken, removeToken, saveToken } from '@/utils/tokenManager'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Inicializa com token do localStorage
  useEffect(() => {
    const storedToken = getToken()
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (tokenResponse, userData) => {
    saveToken(tokenResponse)
    setToken(tokenResponse)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    removeToken()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
