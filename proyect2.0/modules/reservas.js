// modules/reservas.js
import { supabase } from "../js/supabaseClient.js";
import { mostrarMensaje } from "../js/utils.js";

export async function listarReservas() {
  const { data, error } = await supabase.from("reservas").select("*");
  if (error) mostrarMensaje("Error al cargar reservas", "error");
  return data;
}

export function render(contenedor) {
  contenedor.innerHTML = `
    <h2>Reservas</h2>
    <p>Aquí puedes hacer tus reservas.</p>
  `;
}

export async function crearReserva(reserva) {
  const { error } = await supabase.from("reservas").insert([reserva]);
  if (error) mostrarMensaje("Error al registrar reserva", "error");
  else mostrarMensaje("Reserva creada correctamente", "success");
}
