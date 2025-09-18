import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set axios default header
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [state.token])

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser()
    } else {
      dispatch({ type: 'AUTH_FAIL', payload: null })
    }
  }, [])

  const loadUser = async () => {
    try {
      dispatch({ type: 'AUTH_START' })
      const res = await axios.get('/api/auth/me')
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: state.token
        }
      })
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message || 'Failed to load user' })
      localStorage.removeItem('token')
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const res = await axios.post('/api/auth/register', userData)
      
      const { token, ...user } = res.data.data
      localStorage.setItem('token', token)
      // Immediately set axios header to avoid race conditions before effects run
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })
      // Ensure user is fully loaded before returning
      await loadUser()
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAIL', payload: message })
      toast.error(message)
      return { success: false, message }
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const res = await axios.post('/api/auth/login', { email, password })
      
      const { token, ...user } = res.data.data
      localStorage.setItem('token', token)
      // Immediately set axios header to avoid race conditions before effects run
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })
      // Ensure user is fully loaded before returning
      await loadUser()
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_FAIL', payload: message })
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData)
      dispatch({ type: 'UPDATE_USER', payload: res.data.data })
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    clearError,
    loadUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
