// Clase carrusel de fotos que se usará en el index.html
class Carrusel {
    // Atributos privados
    #busqueda;
    #actual;
    #maximo;
    #fotos;

    /**
     * Constructor de la clase que inicializa los valores por defecto
     * salvo la busqueda que queramos realizar
     * 
     * @param {} busqueda 
     */
    constructor(busqueda) {
        this.#busqueda = busqueda;    // termino de busqueda
        this.#actual = 0;             // foto actual
        this.#maximo = 4;             // numero de fotos
        this.#fotos = [];             // fotos
    }

    /**
     * Método que hace una llamada AJAX a través de JQuery al servicio web
     * Flickr para obtener un objeto json con las imágenes que respondan
     * al término del atributo busqueda
     */
    getFotografias() {
        // url para sacar fotografias de flickr
        const url = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        // llamada AJAX para obtener el json
        // una vez lo tengamos procesamos el json y mostramos las fotografias
        // si hay algún error lo mostraremos por consola
        $.getJSON(url, {
            tags: this.#busqueda,
            tagmode: "any",
            format: "json"
        })
            .done((data) => {
                this.procesarJSONFotografias(data);
                this.mostrarFotografias();
            })
            .fail(function () {
                console.error("Error al obtener las imágenes del Flickr");
            })
    }

    /**
     * Método que procesa las fotografias pasandole el json obtenido en 
     * el método getFotografias e inserta el numero de fotografias 
     * que le especifiquemos en el atributo fotos
     * 
     * @param {*} data 
     */
    procesarJSONFotografias(data) {
        this.#fotos = [];
        let fotosNecesarias = 5; 

        $.each(data.items, (i, item) => {
            if (i < fotosNecesarias) {
                // Sustituimos '_m.jpg' (240px) por '_z.jpg' (640px)
                const url640 = item.media.m.replace("_m.jpg", "_z.jpg");

                // guardamos la foto en el array de fotos
                this.#fotos.push(url640);
            }
            else {
                return false;
            }
        })
    }

    /**
     * Método que muestra las primeras 4 imagenes obtenidas del servicio
     * web. Este metodo creará un encabezado de orden 2 con el titulo
     * y un img para añadir las imagenes obtenidas
     * Este metodo llamara al cambiarFotografias para que se vayan
     * cambiando las imagenes automáticamente
     * @returns 
     */
    mostrarFotografias() {
        if (this.#fotos.length === 0) return;

        const main = $("main");

        const article = $("<article>");
        const h2 = $("<h2>").text(`Imágenes del circuito de ${this.#busqueda}`);
        const img = $("<img>")
                        .attr("src", this.#fotos[this.#actual])
                        .attr("alt", `Imagen del circuito de ${this.#busqueda}`);
        

        article.append(h2, img);
        main.append(article);

        // cambiamos la fotografia cada 3s
        setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    /**
     * Cambia las fotografías que tenemos en el array de fotos
     */
    cambiarFotografia() {
        this.#actual = (this.#actual + 1) % this.#maximo;
        $("main img")
            .attr("src", this.#fotos[this.#actual]);
    }
}