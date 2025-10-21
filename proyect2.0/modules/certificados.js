// modules/certificados.js
import { supabase } from "../js/supabaseClient.js";
import { mostrarMensaje } from "../js/utils.js";

export async function listarCertificados() {
  const { data, error } = await supabase.from("certificados").select("*");
  if (error) mostrarMensaje("Error al listar certificados", "error");
  return data;
}

export function render(contenedor) {
  contenedor.innerHTML = `
    <h2>Certificados</h2>
    <p>Aquí puedes solicitar tus certificados.</p>
  `;
}

export async function crearCertificado(certificado) {
  const { error } = await supabase.from("certificados").insert([certificado]);
  if (error) mostrarMensaje("Error al solicitar certificado", "error");
  else mostrarMensaje("Certificado solicitado correctamente", "success");
}
