// modules/seguimiento.js
import { supabase } from "../js/supabaseClient.js";
import { mostrarMensaje } from "../js/utils.js";

export async function listarSeguimientos() {
  const { data, error } = await supabase.from("seguimiento").select("*");
  if (error) mostrarMensaje("Error al obtener seguimientos", "error");
  return data;
}

export function render(contenedor) {
  contenedor.innerHTML = `
    <h2>Seguimiento solicitudes</h2>
    <p>Aquí puedes gestionar las solicitudes.</p>
  `;
}

export async function actualizarEstado(id, nuevoEstado) {
  const { error } = await supabase
    .from("seguimiento")
    .update({ estado: nuevoEstado })
    .eq("id", id);
  if (error) mostrarMensaje("Error al actualizar estado", "error");
  else mostrarMensaje("Estado actualizado correctamente", "success");
}
