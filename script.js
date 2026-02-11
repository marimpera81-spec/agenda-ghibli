const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;
let datosCache = "";

async function cargarAgenda() {
    try {
        const respuesta = await fetch(URL_CSV);
        datosCache = await respuesta.text();
        
        const filas = datosCache.split("\n").slice(1); 
        const contenedor = document.getElementById('agenda-dinamica');
        if (!contenedor) return; // Seguridad por si no encuentra el div

        contenedor.innerHTML = ""; 

        const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (columnas.length >= 6) {
                const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;
                const diaLimpio = dia.replace(/"/g, "").trim();

                if (!mostrarSoloHoy || diaLimpio === diaActual) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    const colorLimpio = color ? color.trim().replace(/"/g, "") : "#CFC1D8";
                    card.style.borderLeft = `10px solid ${colorLimpio}`; 
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <span>${diaLimpio} | ${horario.replace(/"/g, "")}</span>
                        </div>
                        <h3>${actividad.replace(/"/g, "")}</h3>
                        <div class="tarea-check">
                            <span>${estado.replace(/"/g, "")}</span> ${tarea.replace(/"/g, "")}
                        </div>
                    `;
                    contenedor.appendChild(card);
                }
            }
        });
    } catch (e) {
        console.error("Error cargando agenda:", e);
    }
}

function alternarFiltro() {
    mostrarSoloHoy = !mostrarSoloHoy;
    const btn = document.getElementById('btn-filtro');
    if (btn) btn.innerText = mostrarSoloHoy ? "Ver toda la semana 📅" : "Ver solo hoy ✨";
    cargarAgenda();
}

// Reloj
function actualizarReloj() {
    const ahora = new Date();
    const r = document.getElementById('reloj');
    const s = document.getElementById('saludo');
    const f = document.getElementById('fecha-hoy');
    
    if (r) r.innerText = ahora.toLocaleTimeString('es-ES');
    if (f) f.innerText = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (s) {
        const h = ahora.getHours();
        if (h < 12) s.innerText = "¡Buen día, Maru! ☕";
        else if (h < 20) s.innerText = "¡Buena tarde, Maru! 🎨";
        else s.innerText = "¡Buenas noches, Maru! 🌙";
    }
}

setInterval(actualizarReloj, 1000);
actualizarReloj();
cargarAgenda();







