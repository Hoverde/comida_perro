export class SupabaseError extends Error {
  constructor(message, code, details = {}) {
    super(message)
    this.name = 'SupabaseError'
    this.code = code
    this.details = details
  }
}

export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error)
  
  // Errores comunes
  const errorMessages = {
    '23505': 'Ya existe un registro con esos datos',
    '23503': 'No se puede eliminar porque tiene registros relacionados',
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
  }

  if (error.code && errorMessages[error.code]) {
    return new SupabaseError(errorMessages[error.code], error.code)
  }

  return new SupabaseError(
    error.message || 'Error en la operación con Supabase',
    error.code || 'unknown'
  )
}