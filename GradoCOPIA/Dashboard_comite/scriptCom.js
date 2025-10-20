// Datos iniciales vacíos (sin datos de prueba)
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

// Variables globales sin datos de prueba
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
              <button type="submit">Enviar Solicitud</button>
            </form>
          </div>

          <h3 style="margin-top:20px;">Solicitudes Registradas</h3>
          <div class="cards">
            <div class="card solicitud">
              <h4>Reparación de luminaria</h4>
              <p><b>Fecha:</b> 10/09/2025</p>
              <p><b>Estado:</b> <span class="pendiente">En Revisión</span></p>
            </div>
            <div class="card solicitud">
              <h4>Limpieza del parque</h4>
              <p><b>Fecha:</b> 02/09/2025</p>
              <p><b>Estado:</b> <span class="pagado">Atendida</span></p>
            </div>
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

      // ===== 6. SEGUIMIENTO (Comité) =====
    case 'seguimiento':
      contenido.innerHTML = `
        <h2>Seguimiento de Solicitudes</h2>
        <div class="card">
          <h3>Filtros</h3>
          <label for="filtroEstado">Filtrar por estado:</label>
          <select id="filtroEstado">
            <option value="todas">Todas</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Denegado">Denegado</option>
          </select>
        </div>
        <div class="card" style="margin-top:20px; width:100%;">
          <h3>Solicitudes registradas</h3>
          <table class="tabla-pagos">
            <thead><tr><th>ID</th><th>Tipo</th><th>Detalle</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody id="tablaSeguimiento"></tbody>
          </table>
        </div>
      `;
      function renderTabla(filtro = "todas") {
        const tbody = document.getElementById("tablaSeguimiento");
        tbody.innerHTML = "";
        solicitudesCertificados
          .filter(s => filtro === "todas" || s.estado === filtro)
          .forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${s.id}</td>
              <td>${s.tipo}</td>
              <td>${s.detalle}</td>
              <td>${s.fecha}</td>
              <td><span class="estado ${s.estado.toLowerCase()}">${s.estado}</span></td>
              <td>
                <select class="cambiarEstado" data-id="${s.id}">
                  <option value="Pendiente" ${s.estado==="Pendiente"?"selected":""}>Pendiente</option>
                  <option value="Aprobado" ${s.estado==="Aprobado"?"selected":""}>Aprobado</option>
                  <option value="Denegado" ${s.estado==="Denegado"?"selected":""}>Denegado</option>
                </select>
                <button class="btnResponder" data-id="${s.id}">Responder</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        document.querySelectorAll(".cambiarEstado").forEach(sel => {
          sel.addEventListener("change", function() {
            const id = this.getAttribute("data-id");
            const nuevo = this.value;
            const solicitud = solicitudesCertificados.find(s => s.id == id);
            if (solicitud) {
              solicitud.estado = nuevo;
              mostrarNotificacion(`✅ Estado actualizado a "${nuevo}"`);
              renderTabla(filtro);
            }
          });
        });
        document.querySelectorAll(".btnResponder").forEach(btn => {
  btn.addEventListener("click", function() {
    const id = this.getAttribute("data-id");

    // Crear modal
    const modal = document.createElement("div");
    modal.classList.add("modal-responder");
    modal.innerHTML = `
      <div class="modal-responder-content">
        <span class="cerrar-modal">&times;</span>
        <h3>Responder solicitud #${id}</h3>
        <textarea id="textoRespuesta${id}" placeholder="Escribe tu respuesta..." rows="5"></textarea>
        <div class="botones-modal">
          <button class="btnEnviar">Enviar</button>
          <button class="btnCancelar">Cancelar</button>
        </div>
      </div>
    `;

    // Agregar al DOM
    document.body.appendChild(modal);

    // Forzar reflujo para activar animación
    setTimeout(() => modal.classList.add("activo"), 10);

    // Cerrar modal (X o cancelar)
    const cerrarModal = () => {
      modal.classList.remove("activo");
      setTimeout(() => modal.remove(), 300); // animación de salida
    };

    modal.querySelector(".cerrar-modal").addEventListener("click", cerrarModal);
    modal.querySelector(".btnCancelar").addEventListener("click", cerrarModal);

    // Enviar respuesta
    modal.querySelector(".btnEnviar").addEventListener("click", () => {
      const texto = document.getElementById(`textoRespuesta${id}`).value.trim();
      if (!texto) {
        mostrarNotificacion("⚠️ Escribe una respuesta antes de enviar.", "error");
        return;
      }

      mostrarNotificacion(`📩 Respuesta enviada al residente (ID ${id}).`);
      cerrarModal();
    });
  });
});

      }
      document.getElementById("filtroEstado").addEventListener("change", function() {
        renderTabla(this.value);
      });
      renderTabla();
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
            solicitudesCertificados.push({ id: Date.now(), tipo: 'Solicitud', detalle: `${titulo} - ${descripcion} (${archivo})`, fecha: new Date().toISOString().slice(0,10), estado: 'Pendiente' });
            mostrarNotificacion("⚠️ Ocurrió un problema guardando en la nube; la solicitud se guardó localmente.", "error");
          } else {
            mostrarNotificacion("✅ Solicitud registrada en la base de datos.");
          }
        } else {
          solicitudesCertificados.push({ id: Date.now(), tipo: 'Solicitud', detalle: `${titulo} - ${descripcion} (${archivo})`, fecha: new Date().toISOString().slice(0,10), estado: 'Pendiente' });
          mostrarNotificacion("✅ Solicitud registrada correctamente (local).", "exito");
        }
      } catch (err) {
        console.error(err);
        solicitudesCertificados.push({ id: Date.now(), tipo: 'Solicitud', detalle: `${titulo} - ${descripcion} (${archivo})`, fecha: new Date().toISOString().slice(0,10), estado: 'Pendiente' });
        mostrarNotificacion("⚠️ Ocurrió un error, la solicitud se guardó localmente.", "error");
      } finally {
        e.target.reset();
        // si hay un modal, cerrarlo
        try { cerrarModal(); } catch (e) {}
        actualizarListaCertificados();
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



