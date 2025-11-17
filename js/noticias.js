class Noticias {
    #busqueda;
    #url;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#url = "https://api.thenewsapi.com/v1/news/all";
        this.apiKey = "VmpK18g7gNLQBhzeNeBAEQBGz9EY3KITNP2fgvPS"
    }

    buscar(){
        const endpoint = `${this.#url}?api_token=${this.apiKey}&search=${this.#busqueda}&language=es&limit=10`;

        return fetch(endpoint)
            .then(response => {
                if(!response.ok) {
                    throw new Error("Error en la petición de noticias");
                }
                return response.json();
            })
            .then(datos => {
                const noticias = this.procesarInformacion(datos);
                this.mostrarNoticias(noticias);
            })
            .catch(error => console.error(error));
    }

    procesarInformacion(json) {
        const noticias = json.data.map(noticia => ({
            titulo: noticia.title,
            descripcion: noticia.description,
            enlace: noticia.url,
            fuente: noticia.source,
        }));

        return noticias;
    }

    mostrarNoticias(noticias){
        const section = $("<section></section>");
        section.append("<h2>Noticias recientes de MotoGP<h2>");

        noticias.forEach(n => {
            const card = $("<article></article>");

            card.append(`<h3>${n.titulo}</h3>`);
            card.append(`<p>${n.descripcion || "No hay descripción disponible"}</p>`);
            card.append(`<p>Fuente: ${n.fuente}</p>`);
            card.append(`<a href="${n.enlace}">Leer más</a>`);

            section.append(card);
        });

        $("main").append(section);
    }
}