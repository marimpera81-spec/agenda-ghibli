const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";

async function cargarAgenda() {
    try {
        const respuesta = await fetch(URL_CSV);
        const datos = await respuesta.text();
        const filas = datos.split("\n").slice(1); 
        const contenedor = document.getElementById('agenda-dinamica');

        contenedor.innerHTML = ""; 

        filas.forEach(fila => {
            // Esto ayuda a que si hay comas o espacios raros, no se rompa
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (columnas.length >= 6) {
                const [dia, actividad, horario, tipo, tarea, estado, color] = columnas;

                const card = document.createElement('div');
                card.className = 'card';
                // Quitamos espacios raros del color y comillas
                const colorLimpio = color ? color.trim().replace(/"/g, "") : "#CFC1D8";
                card.style.borderLeft = `10px solid ${colorLimpio}`; 
                
                card.innerHTML = `
                    <div class="card-header">
                        <span>${tipo.replace(/"/g, "")}</span>
                        <span>${horario.replace(/"/g, "")}</span>
                    </div>
                    <h3>${actividad.replace(/"/g, "")}</h3>
                    <p class="tarea-check">${estado.replace(/"/g, "")} ${tarea.replace(/"/g, "")}</p>
                    <small style="color: #aaa">${dia.replace(/"/g, "")}</small>
                `;
                contenedor.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error cargando los datos:", error);
    }
}

cargarAgenda();
