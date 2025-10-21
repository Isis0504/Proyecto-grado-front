// js/utils.js
// utils.js

export function formatearFecha(fecha) {
  if (!fecha) return "";
  const f = new Date(fecha);
  if (isNaN(f)) return fecha; // si no es una fecha válida, la devuelve tal cual
  return f.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Si tienes otras utilidades, asegúrate de exportarlas también, por ejemplo:
export function mostrarMensaje(texto, tipo = "info") {
  const div = document.createElement("div");
  div.className = `mensaje ${tipo}`;
  div.textContent = texto;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// Carga un módulo (archivo .js de la carpeta /modules)
export async function cargarModulo(idModulo) {
  const seccion = document.getElementById(idModulo);
  if (!seccion) return;

  const mapa = {
    modPerfil: "../modules/perfil.js",
    modPagos: "../modules/pagos.js",
    modSolicitudes: "../modules/solicitudes.js",
    modReservas: "../modules/reservas.js",
    modCertificados: "../modules/certificados.js",
    modMensajes: "../modules/mensajes.js",
    modSeguimiento: "../modules/seguimiento.js",
  };

  const archivo = mapa[idModulo];
  if (!archivo) {
    seccion.innerHTML = "<p>Módulo no encontrado.</p>";
    return;
  }

  try {
    seccion.innerHTML = "<p>Cargando módulo...</p>";
    // 👇 Esta línea es la clave, resuelve la ruta correctamente
    const url = new URL(archivo, import.meta.url);
    const modulo = await import(url);
    seccion.innerHTML = "";
    modulo.render(seccion);
  } catch (error) {
    seccion.innerHTML = `<p>Error al cargar el módulo: ${error.message}</p>`;
    console.error("Error al cargar el módulo:", error);
  }
}


