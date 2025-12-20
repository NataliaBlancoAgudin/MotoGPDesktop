// Clase Ciudad que estará en el html meterologia integrado
class Ciudad {
    // atributos privados
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #puntoCentral;

    // constructor de la clase
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0;
        this.#puntoCentral = { lat: 0, lon: 0 };
    }

    // Método para rellenar atributos secundarios
    setInfoSecundaria(poblacion, lat, lon) {
        this.#poblacion = poblacion;
        this.#puntoCentral.lat = lat;
        this.#puntoCentral.lon = lon;
    }

    // Método que devuelve (en forma de texto) el nombre de la ciudad
    getNombre() {
        return `${this.#nombre}`;
    }

    // Método que devuelve (en forma de texto) el pais
    getPais() {
        return `${this.#pais}`;
    }

    // Método que devuelve (en forma de lista no ordenada) el pais
    getInfoSecundaria() {
        return `
        <ul>
            <li>Gentilicio: ${this.#gentilicio}</li>
            <li>Población: ${this.#poblacion} habitantes</li>
        </ul>
        `
    }

    // Método que escribe en el documento la información de las coordenadas del punto
    escribirCoordenadas() {
        const p = document.createElement("p");
        p.textContent = `Coordenadas: Latitud ${this.#puntoCentral.lat}, Longitud ${this.#puntoCentral.lon}`

        const main = document.querySelector("main");
        main.appendChild(p);
    }

    /**
     * Recoge el json que nos ofrece la API de open-meteo sobre las coordenadas
     * del circuito en la fecha passada como parametro
     * @param {*} fecha 
     */
    getMeteorologiaCarrera(fecha) {
        const lat = this.#puntoCentral.lat;
        const lon = this.#puntoCentral.lon;

        $.ajax({
            url: "https://archive-api.open-meteo.com/v1/archive",
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: fecha,
                end_date: fecha,
                hourly: [
                    "temperature_2m",
                    "apparent_temperature",
                    "rain",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "wind_direction_10m"
                ].join(","),
                daily: "sunrise,sunset",
                timezone: "auto"
            },
            success: (json) => {
                const procesado = this.#procesarJSONCarrera(json);
                this.#mostrarMeteorologiaCarrera(procesado);
            },
            error: () => console.error("Error al obtener JSON de carrera")
        });
    }

    /**
     * Método que procesa el json pasado como parametro para que sea
     * fácil de utilizar para otros metodos 
     * (como el mostrarMetereologiaCarrera)
     * Filtra para mostrar solo las horas de las carrera
     * (aprox 13:00 - 16:00)
     * @param {*} json 
     * @returns 
     */
    #procesarJSONCarrera(json) {
        const horas = json.hourly.time;
        
        const todosLosHorarios = horas.map((hora, i) => ({
            hora: hora.split('T')[1],
            temperatura: json.hourly.temperature_2m[i],
            sensacion: json.hourly.apparent_temperature[i],
            lluvia: json.hourly.rain[i],
            humedad: json.hourly.relative_humidity_2m[i],
            vientoVel: json.hourly.wind_speed_10m[i],
            vientoDir: json.hourly.wind_direction_10m[i] 

        }));

        const datosFiltrados = todosLosHorarios.filter(dato => {
            const horaNum = parseInt(dato.hora.split(':')[0]);
            return horaNum >= 12 && horaNum <= 16;
        });

        const procesado = {
            fecha: json.daily.time[0],
            salidaSol: json.daily.sunrise[0],
            puestaSol: json.daily.sunset[0],
            horas: datosFiltrados
        };

        return procesado;
    }

    /**
     * Método auxiliar para mostrar los datos de la carrera
     * Este metodo será el invocado una vez los datos han sido procesados
     * en el metodo procesarJSONCarrera
     * @param {*} datos 
     */
    #mostrarMeteorologiaCarrera(datos) {
        const section = $("<section></section>");
        // titulo
        section.append(`<h3>Metelogía el día de la carrera (${datos.fecha}) - ${this.#nombre} (${this.#pais}</h3>`);

        // datos generales
        section.append(`<p>Salida del sol: ${datos.salidaSol.split('T')[1]}</p>`);
        section.append(`<p>Puesta de sol: ${datos.puestaSol.split('T')[1]}</p>`);

        datos.horas.forEach(h => {
            section.append(`<p>Hora: ${h.hora}</p>`);

            const ul = $("<ul></ul>");
            ul.append(`<li>Temperatura (°C): ${h.temperatura}</li>`);
            ul.append(`<li>Sensación términa (°C): ${h.sensacion}</li>`);
            ul.append(`<li>Lluvia (mm): ${h.lluvia}</li>`);
            ul.append(`<li>Humedad (%): ${h.humedad}</li>`);
            ul.append(`<li>Velocidad viento (km/h): ${h.vientoVel}</li>`);
            ul.append(`<li>Dirección viento (°): ${h.vientoDir}</li>`);

            section.append(ul);

        });

        $("main").append(section);
    }

    getMeteorologiaEntrenos(fechaInicio, fechaFin) {
        const lat = this.#puntoCentral.lat;
        const lon = this.#puntoCentral.lon;

        $.ajax({
            url: "https://archive-api.open-meteo.com/v1/archive",
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: fechaInicio,
                end_date: fechaFin,
                hourly: [
                    "temperature_2m",
                    "rain",
                    "relative_humidity_2m",
                    "wind_speed_10m"
                ].join(","),
                timezone: "auto"
            },
            success: json => {
                const procesado = this.#procesarJSONEntrenos(json);
                this.#mostrarMeterologiaEntrenos(procesado);
            }
        });
    }

    #procesarJSONEntrenos(json) {
        const tiempos = json.hourly.time;
        const temps = json.hourly.temperature_2m;
        const lluvia = json.hourly.rain;
        const humedad = json.hourly.relative_humidity_2m;
        const viento = json.hourly.wind_speed_10m;

        const dias = {};

        for (let i = 0; i < tiempos.length; i++) {
            const fecha = tiempos[i].split("T")[0];

            if (!dias[fecha]) {
                dias[fecha] = {
                    temp: [],
                    lluvia: [],
                    humedad: [],
                    viento: []
                };
            }

            dias[fecha].temp.push(temps[i]);
            dias[fecha].lluvia.push(lluvia[i]);
            dias[fecha].humedad.push(humedad[i]);
            dias[fecha].viento.push(viento[i]);
        }

        const medias = {};

        for (const dia in dias) {
            const datos = dias[dia];

            medias[dia] = {
                temperatura: (datos.temp.reduce((a, b) => a + b, 0) / datos.temp.length).toFixed(2),
                lluvia: (datos.lluvia.reduce((a, b) => a + b, 0) / datos.lluvia.length).toFixed(2),
                humedad: (datos.humedad.reduce((a, b) => a + b, 0) / datos.humedad.length).toFixed(2),
                viento: (datos.viento.reduce((a, b) => a + b, 0) / datos.viento.length).toFixed(2)
            };
        }
        return medias;
    }

    #mostrarMeterologiaEntrenos(medias){
        const section = $("<section></section>");
        section.append("<h3>Medias meteorológicas de los entrenamientos</h3>");

        for(const fecha in medias) {
            const datos = medias[fecha]
            
            section.append(`<p>Día: ${fecha}</p>`);

            const ul = $("<ul></ul>");
            ul.append(`<li>Temperatura media (°C): ${datos.temperatura}`);
            ul.append(`<li>Lluvia media (mm): ${datos.lluvia}`);
            ul.append(`<li>Humedad media (%): ${datos.humedad}`);
            ul.append(`<li>Viento medio (km/h): ${datos.viento}`);

            section.append(ul);
            
        }
        $("main").append(section);
    }
}