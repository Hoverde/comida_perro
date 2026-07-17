import { supabase } from '../lib/supabaseClient'

export const realtimeService = {
  subscribeToTable(table, callback, filter = null) {
    let subscription = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  },

  subscribeToChannel(channelName, callback) {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'message' }, (payload) => {
        callback(payload)
      })
      .subscribe()

    return channel
  },

  unsubscribe(subscription) {
    supabase.removeChannel(subscription)
  },

  async broadcastMessage(channel, message) {
    await supabase.channel(channel).send({
      type: 'broadcast',
      event: 'message',
      payload: message
    })
  }
}