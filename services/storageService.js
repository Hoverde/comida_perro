import { supabase } from '../lib/supabaseClient'

export const storageService = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  async downloadFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    return data
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
    return true
  },

  async listFiles(bucket, path = '') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)
    
    if (error) throw error
    return data
  }
}