const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;

async function cargarDatos() {
    try {
        const respuesta = await fetch(URL_CSV);
        const texto = await respuesta.text();
        const filas = texto.split("\n").slice(1);

        const contenedorFacultad = document.getElementById('agenda-dinamica');
        const contenedorBookTok = document.getElementById('lista-booktok');
        const contenedorExamenes = document.getElementById('lista-examenes');

        // Limpiar secciones
        contenedorFacultad.innerHTML = "";
        contenedorBookTok.innerHTML = "";
        contenedorExamenes.innerHTML = "";

        const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            const col = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, "").trim());
            
            if (col.length >= 7) {
                const [dia, actividad, horario, tipo, tarea, estado, color, categoria] = col;
                
                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeft = `8px solid ${color || '#CFC1D8'}`;
                card.innerHTML = `
                    <div class="card-header"><span>${dia} | ${horario}</span></div>
                    <h3>${actividad}</h3>
                    <div class="tarea-check"><span>${estado}</span> ${tarea}</div>
                `;

                // Clasificación por categoría (Columna H)
                const cat = categoria ? categoria.toLowerCase() : "";
                
                if (cat === "examen") {
                    contenedorExamenes.appendChild(card);
                } else if (cat === "booktok") {
                    contenedorBookTok.appendChild(card);
                } else {
                    // Facultad: solo mostramos hoy si el filtro está activo
                    if (!mostrarSoloHoy || dia === diaActual) {
                        contenedorFacultad.appendChild(card);
                    }
                }
            }
        });
    } catch (e) { console.error("Error cargando datos:", e); }
}

// ... Mantén tus funciones de actualizarReloj() y alternarFiltro() aquí abajo ...

// ... (Acá van las funciones alternarFiltro y actualizarReloj que ya tenías)
function alternarFiltro() {
    mostrarSoloHoy = !mostrarSoloHoy;
    document.getElementById('btn-filtro').innerText = mostrarSoloHoy ? "Ver toda la semana 📅" : "Ver solo hoy ✨";
    cargarAgenda();
}

function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES');
    document.getElementById('fecha-hoy').innerText = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const h = ahora.getHours();
    const s = document.getElementById('saludo');
    if (h < 12) s.innerText = "¡Buen día, Maru! ☕";
    else if (h < 20) s.innerText = "¡Buena tarde, Maru! 🎨";
    else s.innerText = "¡Buenas noches, Maru! 🌙";
}

setInterval(actualizarReloj, 1000);
actualizarReloj();
cargarAgenda();







