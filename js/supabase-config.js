// ==============================================================================
// CONFIGURACIÓN DE SUPABASE
// IMPORTANTE: Cambia estas credenciales por las de tu proyecto en Supabase.
// ==============================================================================

const SUPABASE_URL = 'https://sshbuqfjokfzagsfmce.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w_Ci3nkQoz12PQXoCaB6ZQ_KRCHtips';

// Inicialización del cliente de Supabase (expuesto en `window.supabase` para otros scripts)
// IMPORTANTE: asignamos el cliente a `window.supabase` para que archivos que usan
// la variable global `supabase` (sin `window.`) la encuentren correctamente.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Log mínimo para depuración en desarrollo
console.log('Supabase client inicializado:', !!window.supabase && typeof window.supabase.from === 'function');