import { useState, useEffect } from 'react'
import { databaseService } from '../services/databaseService'

export function useQuery(table, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await databaseService.getAll(table, options)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [table, JSON.stringify(options)])

  const refetch = () => fetchData()

  return { data, loading, error, refetch }
}

// Hook para un solo registro
export function useQueryById(table, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const result = await databaseService.getById(table, id)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [table, id])

  return { data, loading, error, refetch: fetchData }
}