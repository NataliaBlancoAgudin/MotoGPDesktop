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