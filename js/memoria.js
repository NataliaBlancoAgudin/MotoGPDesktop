// Clase Memoria para el manejo de eventos del Juego de Memoria
class Memoria {

    // Constructor sin parametros
    constructor(){
        // Indica si el tablero está bloqueado a la interacción con el usuario
        this.tablero_bloqueado = true;
        // Indica cual es la primera carta a la que se le ha dado la vuelta
        this.primera_carta = null;
        // Indica cual es la segunda carta a la que se le ha dado la vuelta
        this.segunda_carta = null;
    }

    // Voltea las carta pasada como parametro
    voltearCarta(carta){
        carta.dataset.estado="volteado";
    }

    // Baraja todas las cartas de tal forma que el orden de las cartas 
    // en el juego sea siempre aleatorio
    barajarCartas(){
        const main = document.querySelector("main");
        // cogemos solo las cartas, no el h2
        const cartas = Array.from(main.querySelectorAll("article")); 

        for(let i = cartas.length -1; i>0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        cartas.forEach(carta => main.appendChild(carta));
    }

    // Método que devuelve, al valor de inicialización, los atributos creados
    reiniciarAtributos(){
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    // Deshabilita las interacciones sobre las cartas de memoria que ya han 
    // sido emparejadas
    deshabilitarCartas(){
        this.primera_carta.dataset.estado = "revelada";
        this.segunda_carta.dataset.estado = "revelada";

        this.comprobarJuego();

        this.reiniciarAtributos();
    }

    // Comprueba si quedan cartas por emparejar en el juego o si ya han
    // sido descubiertas todas las parejas
    comprobarJuego(){
        const cartas = document.querySelectorAll("main article");
        const todasReveladas = Array.from(cartas).every(carta => carta.dataset.estado === "revelada");

        if(todasReveladas){
            alert("¡Has completado el juego!")
        }

    }
}