const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;
let datosCache = "";

async function cargarAgenda() {
    try {
        const respuesta = await fetch(URL_CSV);
        datosCache = await respuesta.text();
        const filas = datosCache.split("\n").slice(1); 
        
        const divFacultad = document.getElementById('agenda-dinamica');
        const divBookTok = document.getElementById('lista-booktok');
        const divExamenes = document.getElementById('lista-examenes');

        // Limpiar todo antes de cargar
        [divFacultad, divBookTok, divExamenes].forEach(d => d.innerHTML = "");

        const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (columnas.length >= 7) {
                // Asumimos que la columna 8 (index 7) es "Categoría"
                const [dia, actividad, horario, tipo, tarea, estado, color, categoria] = columnas.map(c => c.replace(/"/g, "").trim());

                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeft = `10px solid ${color || '#CFC1D8'}`;
                card.innerHTML = `
                    <div class="card-header"><span>${dia} | ${horario}</span></div>
                    <h3>${actividad}</h3>
                    <div class="tarea-check"><span>${estado}</span> ${tarea}</div>
                `;

                // CLASIFICACIÓN MÁGICA
                const cat = categoria ? categoria.toLowerCase() : "";
                if (cat === "examen") {
                    divExamenes.appendChild(card);
                } else if (cat === "booktok") {
                    divBookTok.appendChild(card);
                } else {
                    // Solo filtramos por día lo que es de la Facultad
                    if (!mostrarSoloHoy || dia === diaActual) {
                        divFacultad.appendChild(card);
                    }
                }
            }
        });
    } catch (e) { console.error(e); }
}

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






