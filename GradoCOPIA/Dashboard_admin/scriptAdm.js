let solicitudesCertificados = [
  { id: 1, tipo: "Residencia", detalle: "Constancia para banco", fecha: "2025-09-20", estado: "Pendiente" },
  { id: 2, tipo: "Autorización", detalle: "Visita familiar", fecha: "2025-09-15", estado: "Aprobado" }
];

// ====== PAGOS GLOBALES ======
let pagos = [
  { residente: "Ana Pérez", mes: "Septiembre", valor: "$100.000", estado: "Pagado" },
  { residente: "Carlos López", mes: "Septiembre", valor: "$100.000", estado: "Pendiente" }
];

// ====== FUNCION PARA ACTUALIZAR TABLA ======
function actualizarTablaPagos() {
  const tabla = document.getElementById("tablaPagos");
  if (!tabla) return;

  tabla.innerHTML = "";
  pagos.forEach((pago, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pago.residente}</td>
      <td>${pago.mes}</td>
      <td>${pago.valor}</td>
      <td>
        <select class="estadoPagoSelect" data-index="${index}">
          <option value="Pagado" ${pago.estado === "Pagado" ? "selected" : ""}>Pagado</option>
          <option value="Pendiente" ${pago.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
        </select>
      </td>
    `;
    tabla.appendChild(tr);
  });

  // evento para cambiar estado
  document.querySelectorAll(".estadoPagoSelect").forEach(select => {
    select.addEventListener("change", function() {
      const i = this.getAttribute("data-index");
      pagos[i].estado = this.value;
      mostrarNotificacion(`✅ Estado actualizado a "${this.value}".`);
      actualizarTablaPagos(); // refrescar visualmente
    });
  });
}

// ===== FUNCION DE NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = "exito") {
  const contenedor = document.getElementById("notificaciones");
  const noti = document.createElement("div");
  noti.className = `notificacion ${tipo}`;
  noti.innerText = mensaje;
  contenedor.appendChild(noti);
  setTimeout(() => noti.remove(), 3000);
}

// ===== CAMBIO DE MODULOS =====
function mostrarModulo(modulo) {
  let contenido = document.getElementById("contenido");

  switch(modulo) {
    // ===== INICIO =====
    case "inicio":
      contenido.innerHTML = `
        <h2>Panel del Administrador</h2>
        <p>Bienvenido al panel de administración de Altos del Gualí.</p>
      `;
      break;

   case "pagos":
  contenido.innerHTML = `
    <h2>Gestión de Pagos</h2>
    <p>Administra los pagos de los residentes. Puedes agregar nuevos registros y actualizar su estado.</p>

    <div class="card" style="max-width:600px; margin-bottom:25px;">
      <h3>Agregar nuevo pago</h3>
      <form id="formAgregarPago">
        <label for="residentePago">Residente:</label>
        <input type="text" id="residentePago" placeholder="Ej: Ana Pérez" required>

        <label for="mesPago">Mes:</label>
        <input type="text" id="mesPago" placeholder="Ej: Octubre" required>

        <label for="valorPago">Valor:</label>
        <input type="number" id="valorPago" placeholder="Ej: 100000" required>

        <label for="estadoPago">Estado:</label>
        <select id="estadoPago" required>
          <option value="Pagado">Pagado</option>
          <option value="Pendiente">Pendiente</option>
        </select>

        <button type="submit" style="margin-top:10px;">Agregar Pago</button>
      </form>
    </div>

    <div class="card" style="width:100%;">
      <h3>Listado de Pagos Registrados</h3>
      <table class="tabla-pagos">
        <thead>
          <tr>
            <th>Residente</th>
            <th>Mes</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody id="tablaPagos"></tbody>
      </table>
    </div>
  `;

  // Mostrar tabla inicial
  actualizarTablaPagos();

  // Evento del formulario
  document.getElementById("formAgregarPago").addEventListener("submit", e => {
    e.preventDefault(); // no recarga página

    const residente = document.getElementById("residentePago").value.trim();
    const mes = document.getElementById("mesPago").value.trim();
    const valor = "$" + parseInt(document.getElementById("valorPago").value).toLocaleString();
    const estado = document.getElementById("estadoPago").value;

    if (!residente || !mes || !valor) {
      mostrarNotificacion("⚠️ Completa todos los campos.", "error");
      return;
    }

    pagos.push({ residente, mes, valor, estado });
    mostrarNotificacion(`✅ Pago agregado para ${residente}.`);
    e.target.reset();
    actualizarTablaPagos();
  });
  break;

    // ===== . SEGUIMIENTO  =====
    case 'solicitudes':
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


    // ===== RESERVAS =====
    case "reservas":
      contenido.innerHTML = `
        <h2>Reservas de Espacios</h2>
        <table>
          <thead>
            <tr><th>Residente</th><th>Espacio</th><th>Fecha</th><th>Hora</th><th>Acción</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos López</td><td>Salón Social</td><td>25/09/2025</td><td>15:00</td>
              <td>
                <button onclick="mostrarNotificacion('Reserva confirmada')">Confirmar</button>
                <button onclick="mostrarNotificacion('Reserva cancelada','error')">Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>
      `;
      break;

    // ===== CERTIFICADOS =====
    case "certificados":
      contenido.innerHTML = `
        <h2>Gestión de Certificados</h2>
        <table>
          <thead>
            <tr><th>Residente</th><th>Tipo</th><th>Detalle</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana Pérez</td><td>Residencia</td><td>Constancia para banco</td><td>20/09/2025</td>
              <td>
                <select onchange="mostrarNotificacion('Estado actualizado')">
                  <option>Pendiente</option>
                  <option>Aceptado</option>
                  <option>Denegado</option>
                </select>
              </td>
              <td>
                <input type="file" onchange="mostrarNotificacion('Archivo cargado')">
              </td>
            </tr>
          </tbody>
        </table>
      `;
      break;

    // ===== COMUNICACIÓN =====
    case "comunicacion":
      contenido.innerHTML = `
        <h2>Comunicación Interna</h2>
        <div class="card">
          <h3>Publicar Anuncio</h3>
          <form onsubmit="mostrarNotificacion('Anuncio publicado'); this.reset(); return false;">
            <input type="text" placeholder="Escribe el anuncio..." required>
            <button type="submit">Publicar</button>
          </form>
        </div>
        <div class="card">
          <h3>Publicar Actividad</h3>
          <form onsubmit="mostrarNotificacion('Actividad publicada'); this.reset(); return false;">
            <input type="text" placeholder="Escribe la actividad..." required>
            <button type="submit">Publicar</button>
          </form>
        </div>
      `;
      break;

    case "usuarios":
  contenido.innerHTML = `
    <h2>Gestión de Usuarios</h2>
    <table class="tabla-usuarios">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Tipo Usuario</th>
          <th>Casa</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tablaUsuarios"></tbody>
    </table>
  `;

  // Datos simulados
  let usuarios = [
    { id: 1, nombre: "Ana Pérez", correo: "ana@mail.com", tipo: "Arrendatario", casa: "B-301", estado: "Pendiente" },
    { id: 2, nombre: "Carlos López", correo: "carlos@mail.com", tipo: "Dueño", casa: "A-102", estado: "Aprobado" }
  ];

  function renderUsuarios() {
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";
    usuarios.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>
          <select class="cambiarTipo" data-id="${u.id}">
            <option ${u.tipo === "Dueño" ? "selected" : ""}>Dueño</option>
            <option ${u.tipo === "Arrendatario" ? "selected" : ""}>Arrendatario</option>
          </select>
        </td>
        <td><input type="text" class="editarCasa" value="${u.casa}" data-id="${u.id}"></td>
        <td><span class="estado ${u.estado.toLowerCase()}">${u.estado}</span></td>
        <td>
          ${u.estado === "Pendiente" 
            ? `<button class="btnAprobar" data-id="${u.id}">Aprobar</button>` 
            : `<button class="btnEliminar" data-id="${u.id}">Eliminar</button>`}
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Eventos
    document.querySelectorAll(".btnAprobar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const usuario = usuarios.find(u => u.id == id);
        usuario.estado = "Aprobado";
        mostrarNotificacion(`✅ Usuario ${usuario.nombre} aprobado.`);
        renderUsuarios();
      });
    });

    document.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        usuarios = usuarios.filter(u => u.id != id);
        mostrarNotificacion("🗑️ Usuario eliminado.");
        renderUsuarios();
      });
    });

    document.querySelectorAll(".cambiarTipo").forEach(sel => {
      sel.addEventListener("change", function() {
        const id = this.getAttribute("data-id");
        const usuario = usuarios.find(u => u.id == id);
        usuario.tipo = this.value;
        mostrarNotificacion(`👤 Tipo actualizado a ${this.value}`);
      });
    });

    document.querySelectorAll(".editarCasa").forEach(inp => {
      inp.addEventListener("change", function() {
        const id = this.getAttribute("data-id");
        const usuario = usuarios.find(u => u.id == id);
        usuario.casa = this.value;
        mostrarNotificacion("🏠 Casa actualizada correctamente.");
      });
    });
  }

  renderUsuarios();
  break;

  }
}

// ===== Cerrar Sesión =====
function cerrarSesion() {
  window.location.href = "../Login/index.html";
}
let solicitudActual = null;

// ===== Modal de respuesta =====
let solicitudEnProceso = null;

function abrirModalRespuesta(residente, titulo) {
  const modal = document.getElementById("modalRespuesta");
  modal.style.display = "flex";
  document.getElementById("tituloSolicitud").innerText = 
    `Responder a ${residente} - ${titulo}`;
  document.getElementById("respuestaTexto").focus();

  // Guardamos la referencia de la fila
  solicitudEnProceso = { residente, titulo };
}

function cerrarModalRespuesta() {
  document.getElementById("modalRespuesta").style.display = "none";
  solicitudEnProceso = null;
}

function enviarRespuesta() {
  let texto = document.getElementById("respuestaTexto").value.trim();
  if (texto === "") {
    mostrarNotificacion("⚠️ Escribe una respuesta antes de enviar.", "error");
    return;
  }

  // Badge en la fila
  if (solicitudEnProceso) {
    const filas = document.querySelectorAll("table tbody tr");
    filas.forEach(fila => {
      const nombre = fila.cells[0].innerText;
      const titulo = fila.cells[1].innerText;
      if (nombre === solicitudEnProceso.residente && titulo === solicitudEnProceso.titulo) {
        // Insertamos badge en la columna de acción
        const accionCell = fila.cells[4];
        accionCell.innerHTML = `<span class="badge-respondida">✅ Respondida</span>`;
      }
    });
  }

  mostrarNotificacion("✅ Respuesta enviada correctamente.");
  cerrarModalRespuesta();
  document.getElementById("respuestaTexto").value = "";
}

// Cerrar modal con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModalRespuesta();
});


function enviarRespuesta() {
  let texto = document.getElementById("respuestaTexto").value.trim();
  if (texto === "") {
    mostrarNotificacion("⚠️ Escribe una respuesta antes de enviar.", "error");
    return;
  }
  mostrarNotificacion("✅ Respuesta enviada correctamente.");
  cerrarModalRespuesta();
  document.getElementById("respuestaTexto").value = "";
}

