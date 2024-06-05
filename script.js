let contadorFilas = 1;
const feriados = [
  "2024-01-01",
  "2024-05-01",
  "2024-07-28",
  "2024-07-29",
  "2024-08-30",
  "2024-10-08",
  "2024-11-01",
  "2024-12-08",
  "2024-12-25"
];

function agregarFila() {
  if (contadorFilas < 50) {
    contadorFilas++;
    const nuevoInput = document.createElement("div");
    nuevoInput.className = "fecha-input";
    nuevoInput.innerHTML = `
      <input type="text" id="fecha${contadorFilas}" placeholder="dd/mm/aa" oninput="formatearFechaInput(this)">
      <input type="number" id="dias${contadorFilas}" placeholder="N° días ${contadorFilas}">
      <input type="text" id="resultado${contadorFilas}" readonly placeholder="Resultado">
      <button onclick="eliminarFila(this)">-</button>
    `;
    document.getElementById("fechasAdicionales").appendChild(nuevoInput);
    actualizarPlaceholderDias();
  } else {
    alert("Máximo 50 filas permitidas.");
  }
}

function eliminarFila(boton) {
  boton.parentElement.remove();
  contadorFilas--;
  actualizarPlaceholderDias();
}

function actualizarPlaceholderDias() {
  const filas = document.querySelectorAll(".fecha-input");
  filas.forEach((fila, index) => {
    const inputDias = fila.querySelector("input[type='number']");
    inputDias.placeholder = `N° día ${index + 1}`;
  });
}

function calcular() {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // Contar desde mañana
  for (let i = 1; i <= contadorFilas; i++) {
    const fechaStr = document.getElementById(`fecha${i}`).value;
    const diasStr = document.getElementById(`dias${i}`).value;

    if (fechaStr) {
      const fechaIngresada = parsearFecha(fechaStr);
      if (fechaIngresada) {
        const diferencia = calcularDiferenciaDias(hoy, fechaIngresada);
        document.getElementById(`resultado${i}`).value = `${diferencia} días`;
        resaltarDias(document.getElementById(`resultado${i}`), fechaIngresada);
      }
    }

    if (diasStr) {
      const dias = parseInt(diasStr);
      const nuevaFecha = calcularFecha(hoy, dias);
      const fechaFormateada = formatearFecha(nuevaFecha);
      document.getElementById(`resultado${i}`).value = fechaFormateada;
      resaltarDias(document.getElementById(`resultado${i}`), nuevaFecha);
    }
  }
}

function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
  return Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
}

function calcularFecha(fechaInicio, dias) {
  let nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = String(fecha.getFullYear()).slice(-2);
  return `${dia}/${mes}/${año}`;
}

function parsearFecha(fechaStr) {
  const partes = fechaStr.split("/");
  if (partes.length === 3) {
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const año = parseInt("20" + partes[2], 10); // Asume año 20xx
    const fecha = new Date(año, mes, dia);
    if (fecha && fecha.getMonth() === mes && fecha.getDate() === dia) {
      return fecha;
    }
  }
  return null;
}

function formatearFechaInput(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5, 7);
  input.value = value;
}

function resaltarDias(element, fecha) {
  const diaSemana = fecha.getDay();
  const fechaStr = `${fecha.getFullYear()}-${String(
    fecha.getMonth() + 1
  ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  if (diaSemana === 0 || feriados.includes(fechaStr)) {
    element.classList.add("feriado");
  } else {
    element.classList.remove("feriado");
  }
}

function descargarXLSX() {
  const wb = XLSX.utils.book_new();
  const ws_data = [["Fecha", "Días", "Resultado"]];
  for (let i = 1; i <= contadorFilas; i++) {
    const fecha = document.getElementById(`fecha${i}`).value;
    const dias = document.getElementById(`dias${i}`).value;
    const resultado = document.getElementById(`resultado${i}`).value;
    ws_data.push([fecha, dias, resultado]);
  }
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Resultados");
  XLSX.writeFile(wb, "resultados.xlsx");
}

function limpiar() {
  document.getElementById("fecha1").value = "";
  document.getElementById("dias1").value = "";
  document.getElementById("resultado1").value = "";
  document.getElementById("fechasAdicionales").innerHTML = "";
  contadorFilas = 1;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
