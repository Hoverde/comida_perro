import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const { data: listener } = authService.onAuthChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Verificar sesión inicial
    authService.getSession()
      .then(session => {
        setUser(session?.user || null)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const data = await authService.signIn(email, password)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, metadata) => {
    try {
      setLoading(true)
      const data = await authService.signUp(email, password, metadata)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
    } catch (err) {
      setError(err)
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }
}