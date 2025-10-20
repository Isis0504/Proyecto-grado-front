// supabaseClient.js
// Inicializa el cliente de Supabase para uso en el front-end.
// NOTA DE SEGURIDAD: La "anon" key es pública para uso en cliente en Supabase.
// No incluyas keys con privilegios de servicio en el frontend. En producción,
// protege las keys sensibles en un backend o en variables de entorno.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cylzwpifkysdnoqnpnvs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bHp3cGlma3lzZG5vcW5wbnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODQ5MjcsImV4cCI6MjA3NjQ2MDkyN30.IjPVZbIf3mfuMoMTt7eYG9kDgOXo-EXapANAp5tMIRQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Adjuntamos al window para que los scripts existentes puedan usarlo sin importar ESM
window.supabase = supabase;

// Helper compatible con supabase-js v1 (auth.user()) y v2 (auth.getUser())
export async function getCurrentUser() {
  try {
    if (supabase && supabase.auth) {
      // Try v2: getUser
      if (typeof supabase.auth.getUser === 'function') {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (!error && data && data.user) return data.user;
        } catch (e) {
          // ignore and fallback
        }
      }

      // Try v2: getSession -> session.user
      if (typeof supabase.auth.getSession === 'function') {
        try {
          const { data } = await supabase.auth.getSession();
          if (data && data.session && data.session.user) return data.session.user;
        } catch (e) {
          // ignore
        }
      }

      // v1: auth.user()
      if (typeof supabase.auth.user === 'function') {
        try { return supabase.auth.user(); } catch (e) {}
      }

      // fallback: auth.user may be an object
      if (supabase.auth.user) return supabase.auth.user;
    }
  } catch (err) {
    console.warn('getCurrentUser error:', err);
  }
  return null;
}
window.supabaseGetUser = getCurrentUser;

// Función helper de ejemplo para comprobar la conexión
export async function pingSupabase() {
  try {
    const { data, error } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1);
    // la consulta anterior puede fallar por permisos; en ese caso simplemente retorna la respuesta del status
    return { data, error };
  } catch (err) {
    return { error: String(err) };
  }
}
