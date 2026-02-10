const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";

async function cargarAgenda() {
    try {
        const respuesta = await fetch(URL_CSV);
        const datos = await respuesta.text();
        const filas = datos.split("\n").slice(1); 
        const contenedor = document.getElementById('agenda-dinamica');

        contenedor.innerHTML = ""; 

       const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        // Convertimos a mayúscula la primera letra para que coincida con el Sheets
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (columnas.length >= 6) {
                const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;
                const diaLimpio = dia.replace(/"/g, "").trim();

                // CONDICIÓN: Si el día de la fila es igual al día de hoy
                if (diaLimpio === diaActual) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    const colorLimpio = color ? color.trim().replace(/"/g, "") : "#CFC1D8";
                    card.style.borderLeft = `10px solid ${colorLimpio}`; 
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <span>${tipo.replace(/"/g, "")}</span>
                            <span>${horario.replace(/"/g, "")}</span>
                        </div>
                        <h3>${actividad.replace(/"/g, "")}</h3>
                        <p class="tarea-check">${estado.replace(/"/g, "")} ${tarea.replace(/"/g, "")}</p>
                    `;
                    contenedor.appendChild(card);
                }
            }
        });
