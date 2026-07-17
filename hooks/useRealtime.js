import { useEffect, useState } from 'react'
import { realtimeService } from '../services/realtimeService'

export function useRealtime(table, callback, filter = null) {
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const sub = realtimeService.subscribeToTable(table, (payload) => {
      callback(payload)
    }, filter)

    setSubscription(sub)

    return () => {
      if (subscription) {
        realtimeService.unsubscribe(subscription)
      }
    }
  }, [table, JSON.stringify(filter)])

  return subscription
}