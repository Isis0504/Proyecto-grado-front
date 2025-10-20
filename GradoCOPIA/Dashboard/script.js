// ===== Datos iniciales (sin datos de prueba) =====
let solicitudesCertificados = [];

function actualizarListaCertificados() {
  const cont = document.getElementById("listaCertificados");
  if (!cont) return;

  cont.innerHTML = "";
  solicitudesCertificados.forEach(s => {
    const li = document.createElement("div");
    li.className = "fila-certificado";
    li.innerHTML = `
      <div class="info">
        <strong>${s.tipo}</strong> — ${s.detalle} <br>
        <small>${s.fecha}</small>
      </div>
      <div class="estado ${s.estado.toLowerCase()}">${s.estado}</div>
    `;
    cont.appendChild(li);
  });
}

// ===== VARIABLES GLOBALES =====
// Reservas vacías: serán pobladas por interacciones reales
let reservas = [];

function actualizarReservas() {
  let lista = document.getElementById("listaReservas");
  if (!lista) return;

  lista.innerHTML = "";
  reservas.forEach(r => {
    let li = document.createElement("li");
    li.textContent = `${r.espacio} - ${r.fecha} - ${r.hora}`;
    lista.appendChild(li);

    let fechaObj = new Date(r.fecha);
    let dia = fechaObj.getDate();
    let celdas = document.querySelectorAll("#calendarioBody td");
    celdas.forEach(celda => {
      if (celda.textContent == dia) {
        celda.classList.add("ocupado");
      }
    });
  });
}

// ====== CAMBIO DE SECCIONES ======
function mostrarModulo(modulo) {
  let contenido = document.getElementById("contenido");

  switch(modulo) {
    // ===== INICIO =====
    case 'inicio':
      contenido.innerHTML = `
        <h2>Inicio</h2>
        <p>Bienvenido al sistema de gestión del conjunto Altos del Gualí.</p>
      `;
      break;

    // ===== PAGOS Y FACTURACIÓN =====
    case 'pagos':
      contenido.innerHTML = `
        <h2>Gestión de Pagos y Facturación</h2>
        <p>Registro, consulta y control de pagos de las cuotas de administración.</p>
        <p class="info">
💡 Si ya realizaste el pago, por favor sube el comprobante en el módulo de <b>Solicitudes</b> o acércate a la administración.
</p>
        <div class="cards">
          <div class="card">
            <h3>Estado de Cuenta</h3>
            <p><b>Total Pagado:</b> $1.000.000</p>
            <p><b>Pendiente por Pagar:</b> $200.000</p>
          </div>
          <div class="card">
            <h3>Datos Bancarios</h3>
            <p><b>Número de cuenta:</b> 123456789</p>
            <p><b>Referencia de pago:</b> 987654</p>
          </div>
        </div>

        <div class="card" style="margin-top:20px; width:100%;">
          <h3>Historial de Pagos</h3>
          <table class="tabla-pagos">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Valor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>05/09/2025</td>
                <td>Administración</td>
                <td>$100.000</td>
                <td><span class="pagado">Pagado</span></td>
              </tr>
              <tr>
                <td>05/08/2025</td>
                <td>Administración</td>
                <td>$100.000</td>
                <td><span class="pendiente">Pendiente</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      break;

        // ===== SOLICITUDES Y REPORTES =====
    case 'solicitudes':
      contenido.innerHTML = `
        <div class="contenido-solicitudes">
          <h2>Gestión de Solicitudes y Reportes</h2>
          <p>Envío y seguimiento de solicitudes de mantenimiento, autorizaciones y novedades.</p>

          <div class="card formulario">
            <h3>Nueva Solicitud</h3>
            <form id="formSolicitudes">
              <label for="titulo">Título:</label><br>
              <input type="text" id="titulo" placeholder="Ej: Reparación de luminaria" required><br><br>

              <label for="descripcion">Descripción:</label><br>
              <textarea id="descripcion" placeholder="Describe el problema o solicitud" required></textarea><br><br>

              <label for="archivo">Adjuntar archivo (opcional):</label><br>
              <input type="file" id="archivo" accept=".jpg,.jpeg,.png,.pdf"><br><br>

              <button type="submit">Enviar Solicitud</button>
            </form>
          </div>

          <h3 style="margin-top:20px;">Solicitudes Registradas</h3>
          <div class="cards" id="listaSolicitudes">
            ${solicitudesCertificados.map(s => `
              <div class="card solicitud">
                <h4>${s.detalle}</h4>
                <p><b>Tipo:</b> ${s.tipo}</p>
                <p><b>Fecha:</b> ${s.fecha}</p>
                <p><b>Estado:</b> <span class="${s.estado.toLowerCase()}">${s.estado}</span></p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
      break;

    // ===== RESERVAS =====
    case 'reservas':
      contenido.innerHTML = `
        <h2>Reservas de Espacios Comunes</h2>
        <p>Sistema de agenda en línea con disponibilidad en tiempo real.</p>

        <div class="cards">
          <div class="card">
            <h3>Nueva Reserva</h3>
            <form id="formReservas">
              <label for="espacio">Espacio:</label><br>
              <select id="espacio" required>
                <option value="">Seleccione un espacio</option>
                <option>Salón social</option>
                <option>Cancha múltiple</option>
                <option>BBQ</option>
              </select><br><br>
              <label for="fecha">Fecha:</label><br>
              <input type="date" id="fecha" required><br><br>
              <label for="hora">Hora:</label><br>
              <input type="time" id="hora" required><br><br>
              <button type="submit">Reservar</button>
            </form>
          </div>
          <div class="card calendario">
            <h3>Calendario</h3>
            <table class="mini-calendario">
              <thead><tr><th>L</th><th>M</th><th>Mi</th><th>J</th><th>V</th><th>S</th><th>D</th></tr></thead>
              <tbody id="calendarioBody"></tbody>
            </table>
            <small><span class="leyenda ocupado"></span> = Día con reservas</small>
          </div>
        </div>

        <h3 style="margin-top:20px;">Reservas Confirmadas</h3>
        <ul id="listaReservas"></ul>
      `;

      function generarCalendario(mes, anio) {
        const calendario = document.getElementById("calendarioBody");
        calendario.innerHTML = "";
        let primerDia = new Date(anio, mes, 1).getDay();
        let diasMes = new Date(anio, mes + 1, 0).getDate();
        let fila = document.createElement("tr");
        let offset = primerDia === 0 ? 6 : primerDia - 1;
        for (let i = 0; i < offset; i++) fila.appendChild(document.createElement("td"));
        for (let dia = 1; dia <= diasMes; dia++) {
          if (fila.children.length % 7 === 0 && dia > 1) {
            calendario.appendChild(fila);
            fila = document.createElement("tr");
          }
          let celda = document.createElement("td");
          celda.textContent = dia;
          fila.appendChild(celda);
        }
        calendario.appendChild(fila);
      }

      let hoy = new Date();
      generarCalendario(hoy.getMonth(), hoy.getFullYear());
      actualizarReservas();
      break;

    // ===== CERTIFICADOS =====
    case 'certificados':
      contenido.innerHTML = `
        <h2>Emisión de Certificados</h2>
        <div class="cards">
          <div class="card"><h3>Generar Paz y Salvo</h3><button id="btnPazSalvo">Generar</button></div>
          <div class="card"><h3>Certificado de Residencia</h3><button class="btnSolicitar" data-tipo="Residencia">Solicitar</button></div>
          <div class="card"><h3>Autorización</h3><button class="btnSolicitar" data-tipo="Autorización">Solicitar</button></div>
        </div>

        <div id="modalForm" class="modal">
          <div class="modal-content">
            <span class="close" onclick="cerrarModal()">&times;</span>
            <h3 id="formTitle"></h3>
            <form id="formulario">
              <input type="hidden" id="tipoSolicitud" value="">
              <label for="detalle">Detalle:</label><br>
              <textarea id="detalle" required></textarea><br><br>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>

        <h3 style="margin-top:20px;">Mis solicitudes</h3>
        <div id="listaCertificados"></div>
      `;

      const btnPaz = document.getElementById("btnPazSalvo");
      if (btnPaz) btnPaz.addEventListener("click", generarPazSalvo);

      document.querySelectorAll(".btnSolicitar").forEach(b => {
        b.addEventListener("click", function() {
          abrirFormulario(this.getAttribute("data-tipo"));
        });
      });

      actualizarListaCertificados();
      break;

    // ===== COMUNICACIÓN INTERNA =====
    case 'comunicacion':
      contenido.innerHTML = `
        <h2>Comunicación Interna</h2>
        <p>Panel de anuncios, calendario de actividades y foro de residentes.</p>

        <div class="cards">
          <div class="card">
            <h3>Panel de Anuncios</h3>
            <ul id="listaAnuncios">
              <li>📢 Reunión general el 30/09/2025</li>
              <li>🧹 Jornada de aseo el 05/10/2025</li>
              <li>🏀 Torneo deportivo el 12/10/2025</li>
            </ul>
          </div>

          <div class="card">
            <h3>Calendario de Actividades</h3>
            <ul id="listaActividades">
              <li>30/09/2025 - Reunión General</li>
              <li>05/10/2025 - Jornada de Aseo Comunitario</li>
              <li>12/10/2025 - Torneo Deportivo</li>
            </ul>
          </div>

          <div class="card">
            <h3>Foro de Residentes</h3>
            <form id="formForo">
              <input type="text" id="mensajeForo" placeholder="Escribe un mensaje..." required>
              <button type="submit">Enviar</button>
            </form>
            <ul id="foroMensajes">
              <li><b>Ana:</b> ¿Quién se apunta al torneo?</li>
              <li><b>Carlos:</b> Yo estoy dentro.</li>
            </ul>
          </div>
        </div>
      `;

      // Manejo del foro
      document.getElementById("formForo").addEventListener("submit", function(e) {
        e.preventDefault();
        let mensaje = document.getElementById("mensajeForo").value.trim();
        if (mensaje) {
          let li = document.createElement("li");
          li.innerHTML = `<b>Tú:</b> ${mensaje}`;
          document.getElementById("foroMensajes").appendChild(li);
          document.getElementById("mensajeForo").value = "";
          mostrarNotificacion("✅ Mensaje publicado en el foro.");
        }
      });
      break;

      // ===== PERFIL =====
case 'perfil':
  contenido.innerHTML = `
    <h2>Mi Perfil</h2>
    <div class="card perfil-card">
      <form id="formPerfil">
        <label>Nombre:</label>
        <input type="text" id="nombrePerfil" name="full_name" value="" >

        <label>Correo:</label>
        <input type="email" id="correoPerfil" name="email" value="" readonly>

        <label>Tipo de Usuario:</label>
        <input type="text" id="tipoPerfil" name="role" value="" readonly>

        <label>Casa / Apartamento:</label>
        <input type="text" id="casaPerfil" name="house" value="" >

        <label>Teléfono:</label>
        <input type="text" id="telefonoPerfil" name="phone" value="" placeholder="Ej: 3123456789">

        <button type="submit" class="btn-actualizar">Actualizar Perfil</button>
      </form>
    </div>
  `;

  // Cargar datos del perfil autenticado
  (async () => {
    try {
      if (window.supabase) {
  const user = await (window.supabaseGetUser ? window.supabaseGetUser() : (window.supabase && window.supabase.auth && typeof window.supabase.auth.user === 'function' ? window.supabase.auth.user() : null));
        if (user && user.id) {
          const { data: profile, error } = await window.supabase.from('profiles').select('*').eq('id', user.id).single();
          if (error) {
            console.warn('No se pudo obtener profile:', error.message);
          } else if (profile) {
            document.getElementById('nombrePerfil').value = profile.full_name || '';
            document.getElementById('correoPerfil').value = profile.email || '';
            document.getElementById('tipoPerfil').value = profile.role || '';
            document.getElementById('casaPerfil').value = profile.house || '';
            document.getElementById('telefonoPerfil').value = profile.phone || '';
          }
        }
      } else {
        // fallback: si se quieren cargar datos locales, implementarlo aquí
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
  })();

  document.getElementById('formPerfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const full_name = document.getElementById('nombrePerfil').value.trim();
    const house = document.getElementById('casaPerfil').value.trim();
    const phone = document.getElementById('telefonoPerfil').value.trim();

    try {
      if (window.supabase) {
  const user = await (window.supabaseGetUser ? window.supabaseGetUser() : (window.supabase && window.supabase.auth && typeof window.supabase.auth.user === 'function' ? window.supabase.auth.user() : null));
        if (user && user.id) {
          const { error } = await window.supabase.from('profiles').update({ full_name, house, phone }).eq('id', user.id);
          if (error) {
            mostrarNotificacion('⚠️ No se pudo actualizar el perfil: ' + error.message, 'error');
            return;
          }
          mostrarNotificacion('✅ Perfil actualizado correctamente.');
        } else {
          mostrarNotificacion('⚠️ No hay sesión de usuario activa.', 'error');
        }
      } else {
        // fallback local: actualizar UI y arrays locales si aplica
        mostrarNotificacion('✅ Perfil actualizado (local).');
      }
    } catch (err) {
      console.error(err);
      mostrarNotificacion('⚠️ Error actualizando perfil.', 'error');
    }
  });
  break;


  }
}

// ===== Inicializar =====
window.onload = () => mostrarModulo('inicio');

// ===== FUNCIONES GLOBALES =====
function generarPazSalvo() {
  mostrarNotificacion("✅ Paz y Salvo generado correctamente (PDF simulado).");
}

function abrirFormulario(tipo) {
  const modal = document.getElementById("modalForm");
  const title = document.getElementById("formTitle");
  const hidden = document.getElementById("tipoSolicitud");
  title.innerText = tipo;
  hidden.value = tipo;
  modal.style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalForm").style.display = "none";
}

function cerrarSesion() {
  window.location.href = "../Login/index.html";
}

// ===== NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = "exito") {
  const cont = document.getElementById("notificaciones");
  if (!cont) return;

  const noti = document.createElement("div");
  noti.className = `notificacion ${tipo}`;
  noti.innerText = mensaje;
  cont.appendChild(noti);
  setTimeout(() => noti.remove(), 3000);
}

// ===== Formularios =====
document.addEventListener("submit", e => {
  e.preventDefault();

  if (e.target.id === "formulario") {
    const tipo = document.getElementById("tipoSolicitud").value;
    const detalle = document.getElementById("detalle").value.trim();
    if (!detalle) return mostrarNotificacion("⚠️ Agrega detalle a la solicitud.", "error");

    solicitudesCertificados.push({
      id: Date.now(),
      tipo, detalle,
      fecha: new Date().toISOString().slice(0,10),
      estado: "Pendiente"
    });

    cerrarModal();
    actualizarListaCertificados();
    mostrarNotificacion("✅ Solicitud enviada correctamente.");
  }

  if (e.target.id === "formSolicitudes") {
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const archivoInput = document.getElementById("archivo");
    const archivo = archivoInput.files[0] ? archivoInput.files[0].name : "Sin archivo";

    if (!titulo || !descripcion) {
      mostrarNotificacion("⚠️ Completa todos los campos obligatorios.", "error");
      return;
    }

    // Intentar guardar en Supabase si está disponible
    (async () => {
      try {
        if (window.supabase) {
          let archivo_url = null;
          if (archivoInput.files[0]) {
            const file = archivoInput.files[0];
            const ext = file.name.split('.').pop();
            const fileName = `solicitudes/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
            const { data: uploadData, error: uploadError } = await window.supabase.storage.from('public').upload(fileName, file);
            if (uploadError) {
              console.warn('Error subiendo archivo a storage:', uploadError.message);
            } else {
              archivo_url = uploadData?.path || null;
            }
          }

          const profileUser = await (window.supabaseGetUser ? window.supabaseGetUser() : (window.supabase && window.supabase.auth && typeof window.supabase.auth.user === 'function' ? window.supabase.auth.user() : null));
          const profileId = profileUser ? profileUser.id : null;

          const { data, error } = await window.supabase.from('solicitudes').insert([{ 
            profile_id: profileId,
            tipo: 'Solicitud',
            detalle: `${titulo} - ${descripcion}`,
            archivo_url: archivo_url,
            estado: 'Pendiente'
          }]);

          if (error) {
            console.warn('No se pudo insertar en supabase:', error.message);
            // fallback local
            solicitudesCertificados.push({
              id: Date.now(),
              tipo: "Solicitud",
              detalle: `${titulo} - ${descripcion} (${archivo})`,
              fecha: new Date().toISOString().slice(0,10),
              estado: "Pendiente"
            });
            mostrarNotificacion("⚠️ Ocurrió un problema guardando en la nube; la solicitud se guardó localmente.", "error");
          } else {
            mostrarNotificacion("✅ Solicitud registrada en la base de datos.");
          }
        } else {
          // fallback local
          solicitudesCertificados.push({
            id: Date.now(),
            tipo: "Solicitud",
            detalle: `${titulo} - ${descripcion} (${archivo})`,
            fecha: new Date().toISOString().slice(0,10),
            estado: "Pendiente"
          });
          mostrarNotificacion("✅ Solicitud registrada correctamente (local).", "exito");
        }
      } catch (err) {
        console.error(err);
        solicitudesCertificados.push({
          id: Date.now(),
          tipo: "Solicitud",
          detalle: `${titulo} - ${descripcion} (${archivo})`,
          fecha: new Date().toISOString().slice(0,10),
          estado: "Pendiente"
        });
        mostrarNotificacion("⚠️ Ocurrió un error, la solicitud se guardó localmente.", "error");
      } finally {
        e.target.reset();
        mostrarModulo("solicitudes");
      }
    })();
  }

  if (e.target.id === "formReservas") {
    let espacio = document.getElementById("espacio").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;
    if (espacio && fecha && hora) {
      reservas.push({ espacio, fecha, hora });
      actualizarReservas();
      mostrarNotificacion("✅ Reserva registrada con éxito.");
      e.target.reset();
    } else {
      mostrarNotificacion("⚠️ Completa todos los campos.", "error");
    }
  }
});
