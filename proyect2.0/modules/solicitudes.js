// modules/solicitudes.js
import { supabase } from "../js/supabaseClient.js";
import { mostrarMensaje } from "../js/utils.js";

export async function listarSolicitudes() {
  const { data, error } = await supabase.from("solicitudes").select("*");
  if (error) mostrarMensaje("Error al obtener solicitudes", "error");
  return data;
}

export function render(contenedor) {
  contenedor.innerHTML = `
    <h2>Solicitudes</h2>
    <p>Aquí puedes hacer tus solicitudes.</p>
  `;
}

export async function crearSolicitud(solicitud) {
  const { error } = await supabase.from("solicitudes").insert([solicitud]);
  if (error) mostrarMensaje("Error al crear la solicitud", "error");
  else mostrarMensaje("Solicitud enviada con éxito", "success");
}
