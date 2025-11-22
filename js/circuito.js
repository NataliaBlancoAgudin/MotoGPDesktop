class Circuito {
    #archivo;

    constructor() {
        this.#comprobarApiFile();
        this.#archivo = null;

        this.#inicializarEventos();
    }

    /**
     * Método que verifica si el navegador soporta el uso
     * de la API File
     */
    #comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File Soportada");
        } else {
            console.log("Este navegador NO soporta la API File de HTML5.");
        }
    }

    /**
     * Inicializa el evento del botón
     */
    #inicializarEventos() {
        const inputArchivo = document.querySelector('input[type="file"]');
        inputArchivo.addEventListener('change', (evento) => {
            const archivoSeleccionado = evento.target.files[0];
            if (archivoSeleccionado) {
                this.#leerArchivoHTML(archivoSeleccionado);
            }
        })
    }

    /**
     * Método que realizará la lectura del archivo `InfoCircuito.html`
     * y cargará su contenido
     */
    #leerArchivoHTML(archivo) {
        this.#archivo = archivo;
        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenido = evento.target.result;
            this.#procesarHTML(contenido);
        };

        lector.onerror = () => {
            console.log("Error leyendo el archivo");
        }

        lector.readAsText(this.#archivo, "UTF-8");
    }

    /**
     * Procesa el contenido HTML del archivo `InfoCircuito.html`
     * @param {*} contenidoHTML 
     */
    #procesarHTML(contenidoHTML) {
        const parser = new DOMParser();
        const docHTML = parser.parseFromString(contenidoHTML, "text/html");

        const sources = docHTML.querySelectorAll("source");
        sources.forEach(source => {
            const srcOriginal = source.getAttribute("src");
            const srcsetOriginal = source.getAttribute("srcset");

            if (srcOriginal && srcOriginal.includes("../multimedia/")) {
                source.setAttribute("src", srcOriginal.replace("../multimedia/", "./multimedia/"));
            }

            if (srcsetOriginal && srcsetOriginal.includes("../multimedia/")) {
                source.setAttribute("srcset", srcsetOriginal.replace("../multimedia/", "./multimedia/"));
            }
        })

        const mainDestino = document.querySelectorAll("section")[0];
        const main = docHTML.querySelector("main");

        if (main) {
            mainDestino.append(...main.childNodes);
        } else {
            mainDestino.appendChild("<p>No se encontró contenido válido</p>");
        }
    }
}

// Clase de lectura y representación gráfica de un archivo SVG
class CargadorSVG {
    #archivo;

    constructor() {
        this.#comprobarApiFile();

        this.#archivo = null;

        this.#inicializarEventos();
    }

    /**
     * Inicializa el evento del botón
     */
    #inicializarEventos() {
        const inputArchivo = document.querySelectorAll('input[type="file"]')[1];
        inputArchivo.addEventListener('change', (evento) => {
            const archivoSeleccionado = evento.target.files[0];
            if (archivoSeleccionado) {
                this.#leerArchivoSVG(archivoSeleccionado);
            }
        })
    }

    /**
     * Método que verifica si el navegador soporta el uso
     * de la API File
     */
    #comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File Soportada (SVG)");
        } else {
            console.log("Este navegador NO soporta la API File de HTML5.");
        }
    }

    /**
     * Carga el archivo pasado SVG desde la máquina del cliente utilizando
     * API File
     * @param {*} archivo 
     */
    #leerArchivoSVG(archivo) {
        this.#archivo = archivo;
        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenidoSVG = evento.target.result;
            this.#insertarSVG(contenidoSVG);
        };

        lector.onerror = () => {
            console.log("Error leyendo el archivo SVG");
        };

        lector.readAsText(this.#archivo, "UTF-8")
    }

    /**
     * Muestra el contenido del archivo SVG en un elemento HTML
     * @param {*} svgTexto 
     */
    #insertarSVG(svgTexto) {
        const contenedor = document.querySelectorAll("main > section")[1];
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgTexto, "image/svg+xml");
        const svgElemento = svgDoc.documentElement;

        contenedor.appendChild(svgElemento);
    }
}

// Clase para la visualizacion de mapas
class CargadorKML {
    
    #mapa;
    #coordenadas;
    #origen

    constructor() {
        const contenedorMapa = document.querySelector("div");
        mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpYTA0IiwiYSI6ImNtM3E4MnFsNDBsMDAyanNhcmtxbzB5ZWEifQ.6cgByNf8BnyghepPNtdpMQ'

        this.#mapa = new mapboxgl.Map({
        container: contenedorMapa,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-3.0, 43.0],
        zoom: 5
    });
        this.#coordenadas = [];
        this.#origen = null;

        this.#inicializarEventos();
    }

    /**
     * Inicializa el evento del botón
     */
    #inicializarEventos() {
        const inputArchivo = document.querySelectorAll('input[type="file"]')[2];
        inputArchivo.addEventListener('change', (evento) => {
            const archivoSeleccionado = evento.target.files[0];
            if (archivoSeleccionado) {
                this.#leerArchivoKML(archivoSeleccionado);
            }
        })
    }

    // Carga un archivo KML desde la máquina cliente utilizando API file
    #leerArchivoKML(archivo){
        const lector = new FileReader();

        lector.onload = () => {
            const texto = lector.result;
            this.#procesarKML(texto);
            this.#insertarCapaKML();
        };

        lector.onerror = () => {
            console.log("Error leyendo el archivo");
        }

        lector.readAsText(archivo, "UTF-8");
    }

    // Procesa el kml pasado como parametro
    #procesarKML(kmlText){
        const parser = new DOMParser();
        const xml = parser.parseFromString(kmlText, "text/xml");

        const coords = xml.getElementsByTagName("coordinates")[0].textContent.trim();
        const puntos = coords.split(/\s+/);

        this.#coordenadas = puntos.map(p => {
            const [lon, lat] = p.split(",").map(Number);
            return [lon, lat];
        });

        this.#origen = this.#coordenadas[0];
    }

    // Superpone un archivo KML en un mapa
    #insertarCapaKML(){
        if(!this.#origen || this.#coordenadas.length === 0) return;

        this.#mapa.flyTo({
            center: this.#origen,
            zoom: 13.5,
            speed: 1.2,
            curve: 1.5,
            essential: true
        });

        // Marcador del inicio del circuito
        new mapboxgl.Marker().setLngLat(this.#origen).addTo(this.#mapa);

        // Linea del circuito
        this.#mapa.addSource('circuito', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.#coordenadas
                }
            }
        });

        this.#mapa.addLayer({
            'id': 'circuito-linea',
            'type': 'line',
            'source': 'circuito',
            'paint': {
                'line-width': 4
            }
        })
    }
}