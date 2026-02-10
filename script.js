// Tu llave maestra (el link que me pasaste)
const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";

async function cargarAgenda() {
    try {
        const respuesta = await fetch(URL_CSV);
        const datos = await respuesta.text();
        
        // Separamos por filas y quitamos el encabezado
        const filas = datos.split("\n").slice(1); 
        const contenedor = document.getElementById('agenda-dinamica');

        contenedor.innerHTML = ""; // Limpiamos antes de cargar

        filas.forEach(fila => {
            // Separamos cada columna por la coma
            const columnas = fila.split(",");
            
            // Asignamos cada columna a una variable (según el orden de tu Sheets)
            const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;

            if (actividad) {
                const card = document.createElement('div');
                card.className = 'card';
                // Usamos el color hex que definiste en el Sheets
                card.style.borderLeft = `8px solid ${color.trim()}`; 
                
                card.innerHTML = `
                    <div class="card-header">
                        <span class="tag">${tipo}</span>
                        <span class="hora">${horario}</span>
                    </div>
                    <h3>${actividad}</h3>
                    <p class="tarea">${estado} ${tarea}</p>
                    <small class="dia-tag">${dia}</small>
                `;
                contenedor.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error cargando los datos:", error);
    }
}

cargarAgenda();