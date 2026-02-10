const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;
let datosCache = "";

async function cargarAgenda() {
    try {
        if (!datosCache) {
            const respuesta = await fetch(URL_CSV);
            datosCache = await respuesta.text();
        }
        
        const filas = datosCache.split("\n").slice(1); 
        const contenedor = document.getElementById('agenda-dinamica');
        contenedor.innerHTML = ""; 

        // Obtenemos el día de hoy en español y capitalizamos
        const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            // Separador robusto para CSV
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (columnas.length >= 6) {
                const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;
                const diaLimpio = dia.replace(/"/g, "").trim();

                // Si mostrarSoloHoy es true, filtramos. Si es false (Ver toda la semana), mostramos todo.
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
                        <p class="tipo-tag">${tipo.replace(/"/g, "")}</p>
                        <div class="tarea-check">
                            <span>${estado.replace(/"/g, "")}</span> ${tarea.replace(/"/g, "")}
                        </div>
                    `;
                    contenedor.appendChild(card);
                }
            }
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

function alternarFiltro() {
    mostrarSoloHoy = !mostrarSoloHoy;
    const btn = document.getElementById('btn-filtro');
    btn.innerText = mostrarSoloHoy ? "Ver toda la semana 📅" : "Ver solo hoy ✨";
    cargarAgenda();
}

// Arranca la carga
cargarAgenda();
