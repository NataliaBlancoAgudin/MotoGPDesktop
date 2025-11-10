// Clase Cronometro para el manejo de eventos del Juego de cronometro
class Cronometro{

    /**
     * Constructor sin parametros que inicializa los atributos
     * de la clase
     */
    constructor(){
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
        this.acumulado = 0;
    }

    /**
     * Metodo que crea el atributo inicio de la clase cronometro
     * y actualiza el valor de this.corriendo invocando al metodo
     * actualizar cada décima de segundo
     * 
     * @returns 
     */
    arrancar(){
        if(this.corriendo) return; 

        try{
            if(typeof Temporal !=="undefined" && Temporal.Now && Temporal.Instant){
                this.inicio = Temporal.Now.instant();
            }
            else {
                throw new Error("Temporal no disponible");
            }
        } catch (e){
            this.inicio = new Date();
        }

        this.actualizar();
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    /**
     * Método se tiene que invocar automáticamente (de forma recurrente); 
     * este método se tiene que invocar cada décima de segundo.
     * Utilizamos el método setInterval(metodo, tiempo) lo que nos 
     * devuelva este método deberemos de guardalo en un atributo llamado
     * this.corriendo = setInterval(metodo, tiempo)
     */
    actualizar(){
        let ahora, diferencia;

        try{
            if(typeof Temporal !== "undefined" && this.inicio instanceof Temporal.Instant){
                ahora = Temporal.Now.instant();
                diferencia = ahora.epochMilliseconds - this.inicio.epochMilliseconds;
            } else {
                ahora = new Date();
                diferencia = ahora.getTime() - this.inicio.getTime();
            }
        } catch (e){
            ahora = new Date;
            diferencia = ahora.getTime() - this.inicio.getTime();
        }

        this.tiempo = this.acumulado + diferencia;
        this.mostrar();
    }

    /**
     * Muestra en un parrafo la cantidad de tiempo que ha contado 
     * el cronómetro en un momento dado (en formato mm:ss:s)
     */
    mostrar(){
        const minutos = parseInt(this.tiempo / 60000);
        const segundos = parseInt((this.tiempo % 60000) / 1000);
        const decimas = parseInt((this.tiempo % 1000) / 100);

        const mm = String(minutos).padStart(2, "0");
        const ss = String(segundos).padStart(2, "0");

        const texto = `${mm}:${ss}.${decimas}`;

        const p = document.querySelector("main p");
        if(p) p.textContent = texto;
    }

    /**
     * Método que detiene el cronometro
     */
    parar(){
        clearInterval(this.corriendo);
        this.corriendo = null;
        this.acumulado = this.tiempo;
    }

    /**
     *  Método que pone el cronometro a 0
     */
    reiniciar(){
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
        this.acumulado = 0;
        this.mostrar();
    }
}