const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;
let datosCache = "";
let tabActual = 'Facultad';

async function cargarAgenda() {
    if (!datosCache) {
        const respuesta = await fetch(URL_CSV);
        datosCache = await respuesta.text();
    }
    
    const filas = datosCache.split("\n").slice(1); 
    const contenedor = document.getElementById('agenda-dinamica');
    contenedor.innerHTML = ""; 

    const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
    const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

    filas.forEach(fila => {
        const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columnas.length >= 6) {
            const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;
            const diaLimpio = dia.replace(/"/g, "").trim();
            const tipoLimpio = tipo.replace(/"/g, "").trim();

            // FILTRO DOBLE: Por pestaña (Facu/BookTok) y por Día
            if (tipoLimpio === tabActual) {
                if (!mostrarSoloHoy || diaLimpio === diaActual) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    const colorLimpio = color ? color.trim().replace(/"/g, "") : "#CFC1D8";
                    card.style.borderLeft = `10px solid ${colorLimpio}`; 
                    
                    card.innerHTML = `
                        <div class="card-header"><span>${diaLimpio} | ${horario.replace(/"/g, "")}</span></div>
                        <h3>${actividad.replace(/"/g, "")}</h3>
                        <div class="tarea-check"><span>${estado.replace(/"/g, "")}</span> ${tarea.replace(/"/g, "")}</div>
                    `;
                    contenedor.appendChild(card);
                }
            }
        }
    });
}

function cambiarTab(nuevaTab) {
    tabActual = nuevaTab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(nuevaTab));
    });
    cargarAgenda();
}

// LÓGICA DEL CONTADOR DE EXAMEN
function configurarContador() {
    const fechaExamen = new Date('2026-03-10'); // CAMBIÁ ESTA FECHA CUANDO TENGAS EL EXAMEN
    const hoy = new Date();
    const dif = fechaExamen - hoy;
    const dias = Math.ceil(dif / (1000 * 60 * 60 * 24));
    
    const display = document.getElementById('countdown-examen');
    if (dias > 0) display.innerText = `⏳ Faltan ${dias} días para el próximo examen`;
    else display.innerText = "✨ ¡No hay exámenes próximos!";
}

// Mantener el reloj funcionando
setInterval(() => {
    // Aquí va tu función de reloj que ya tenías
}, 1000);

configurarContador();
cargarAgenda();


