const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoZbTaaTKYrB9djx73gUcxktl3t0kRJsVgfz418i57vqQxsVIL1DqR9o747f0dRX7SmhQnd4XnFHX/pub?output=csv";
let mostrarSoloHoy = true;
let datosCache = "";
let tabActual = 'Facultad';

// 1. FUNCIÓN DEL RELOJ Y SALUDO
function actualizarReloj() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    
    if(document.getElementById('reloj')) {
        document.getElementById('reloj').innerText = `${horas}:${minutos}:${segundos}`;
    }

    const saludo = document.getElementById('saludo');
    if(saludo) {
        const hora = ahora.getHours();
        if (hora < 12) saludo.innerText = "¡Buen día, Maru! ☕";
        else if (hora < 20) saludo.innerText = "¡Buena tarde, Maru! 🎨";
        else saludo.innerText = "¡Buenas noches, Maru! 🌙";
    }
}

// 2. FUNCIÓN DEL CONTADOR DE EXAMEN
function configurarContador() {
    const fechaExamen = new Date('2026-03-10'); // Cambiá esta fecha cuando quieras
    const hoy = new Date();
    const dif = fechaExamen - hoy;
    const dias = Math.ceil(dif / (1000 * 60 * 60 * 24));
    
    const display = document.getElementById('countdown-examen');
    if (display) {
        if (dias > 0) display.innerText = `⏳ Faltan ${dias} días para el próximo examen`;
        else display.innerText = "✨ ¡No hay exámenes próximos!";
    }
}

// 3. CARGAR DATOS DEL SHEETS
async function cargarAgenda() {
    try {
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
    } catch (e) { console.error(e); }
}

// 4. CONTROLES DE INTERFAZ
function cambiarTab(nuevaTab) {
    tabActual = nuevaTab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(nuevaTab));
    });
    cargarAgenda();
}

function alternarFiltro() {
    mostrarSoloHoy = !mostrarSoloHoy;
    const btn = document.getElementById('btn-filtro');
    btn.innerText = mostrarSoloHoy ? "Ver toda la semana 📅" : "Ver solo hoy ✨";
    cargarAgenda();
}
// CONFIGURACIÓN DEL REPRODUCTOR
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '8_vN7K8K4_o', // Radio Ghibli Lofi 24/7
        playerVars: { 'autoplay': 0, 'controls': 0 },
    });
}

// Cargar la API de YouTube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let tocando = false;
function toggleMusica() {
    const btn = document.getElementById('play-pause');
    if (!tocando) {
        player.playVideo();
        btn.innerText = "⏸️ Pausar Música";
        tocando = true;
    } else {
        player.pauseVideo();
        btn.innerText = "🎵 Escuchar Lofi Ghibli";
        tocando = false;
    }
}

// INICIO
setInterval(actualizarReloj, 1000);
actualizarReloj();
configurarContador();
cargarAgenda();




