const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;

async function cargarDatos() {
    try {
        const respuesta = await fetch(URL_CSV);
        const datos = await respuesta.text();
        const filas = datos.split("\n").slice(1); 

        const divFacu = document.getElementById('agenda-dinamica');
        const divBook = document.getElementById('lista-booktok');
        const divExamen = document.getElementById('lista-examenes');

        if (divFacu) divFacu.innerHTML = "";
        if (divBook) divBook.innerHTML = "";
        if (divExamen) divExamen.innerHTML = "";

        const hoy = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
        const diaActual = hoy.charAt(0).toUpperCase() + hoy.slice(1);

        filas.forEach(fila => {
            const col = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, "").trim());
            
            if (col.length >= 7) {
                const [dia, actividad, horario, tipo, tarea, estado, color, categoria] = col;

                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeft = `10px solid ${color || '#CFC1D8'}`;
                card.innerHTML = `
                    <div class="card-header"><span>${dia} | ${horario}</span></div>
                    <h3>${actividad}</h3>
                    <div class="tarea-check"><span>${estado}</span> ${tarea}</div>
                `;

                const cat = (categoria || "").toLowerCase();
                if (cat === "examen") {
                    if (divExamen) divExamen.appendChild(card);
                } else if (cat === "booktok") {
                    if (divBook) divBook.appendChild(card);
                } else {
                    if (!mostrarSoloHoy || dia === diaActual) {
                        if (divFacu) divFacu.appendChild(card);
                    }
                }
            }
        });
    } catch (e) { console.error(e); }
}

function alternarFiltro() {
    mostrarSoloHoy = !mostrarSoloHoy;
    document.getElementById('btn-filtro').innerText = mostrarSoloHoy ? "Ver toda la semana 📅" : "Ver solo hoy ✨";
    cargarDatos();
}

function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString('es-ES');
    document.getElementById('fecha-hoy').innerText = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const s = document.getElementById('saludo');
    const h = ahora.getHours();
    if (h < 12) s.innerText = "¡Buen día, Maru! ☕";
    else if (h < 20) s.innerText = "¡Buena tarde, Maru! 🎨";
    else s.innerText = "¡Buenas noches, Maru! 🌙";
}

setInterval(actualizarReloj, 1000);
actualizarReloj();
cargarDatos();



