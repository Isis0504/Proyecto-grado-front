// modules/mensajes.js
import { supabase } from "../js/supabaseClient.js";
import { mostrarMensaje } from "../js/utils.js";

export async function listarMensajes() {
  const { data, error } = await supabase.from("mensajes").select("*");
  if (error) mostrarMensaje("Error al obtener mensajes", "error");
  return data;
}

export function render(contenedor) {
  contenedor.innerHTML = `
    <h2>Anuncios y Foro</h2>
    <p>Aquí puedes ver los anuncios y partipar del foro.</p>
  `;
}

export async function enviarMensaje(mensaje) {
  const { error } = await supabase.from("mensajes").insert([mensaje]);
  if (error) mostrarMensaje("No se pudo enviar el mensaje", "error");
  else mostrarMensaje("Mensaje enviado", "success");
}
