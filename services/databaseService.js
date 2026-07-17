import { supabase } from '../lib/supabaseClient'

export const databaseService = {
  // CRUD genérico
  async getAll(table, options = {}) {
    let query = supabase.from(table).select('*')
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      })
    }
    
    if (options.filters) {
      options.filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value)
      })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(table, record) {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Consultas personalizadas con RLS
  async query(table, queryBuilder) {
    let query = supabase.from(table).select('*')
    query = queryBuilder(query)
    const { data, error } = await query
    if (error) throw error
    return data
  }
}