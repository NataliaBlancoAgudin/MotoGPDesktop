// Clase Ciudad que estará en el html meterologia integrado
class Ciudad {
    // constructor de la clase
    constructor(nombre, pais, gentilicio){
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = 0;
        this.puntoCentral = {lat:0, lon: 0};
    }

    // Método para rellenar atributos secundarios
    setInfoSecundaria(poblacion, lat, lon){
        this.poblacion = poblacion;
        this.puntoCentral.lat = lat;
        this.puntoCentral.lon = lon;
    }

    // Método que devuelve (en forma de texto) el nombre de la ciudad
    getNombre(){
        return `${this.nombre}`;
    }

    // Método que devuelve (en forma de texto) el pais
    getPais(){
        return `${this.pais}`;
    }

    // Método que devuelve (en forma de lista no ordenada) el pais
    getInfoSecundaria(){
        return `
        <ul>
            <li>Gentilicio: ${this.gentilicio}</li>
            <li>Población: ${this.poblacion} habitantes</li>
        </ul>
        `
    }

    // Método que escribe en el documento la información de las coordenadas del punto
    escribirCoordenadas(){
        document.write(`
            <p>Coordenadas: Latitud ${this.puntoCentral.lat}, Longitud ${this.puntoCentral.lon}`);
    }
}