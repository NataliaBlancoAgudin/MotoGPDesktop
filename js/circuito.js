class Circuito {
    #archivo;

    constructor() {
        this.#comprobarApiFile();
        this.#archivo = null;
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
     * Método que realizará la lectura del archivo `InfoCircuito.html`
     * y cargará su contenido
     */
    leerArchivoHTML(archivo) {
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

        const mainDestino = document.querySelector("main");
        const main = docHTML.querySelector("main");

        if (main) {
            mainDestino.append(...main.childNodes);
        } else {
            mainDestino.appendChild("<p>No se encontró contenido válido</p>");
        }
    }
}