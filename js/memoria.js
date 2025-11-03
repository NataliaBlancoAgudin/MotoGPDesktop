// Clase Memoria para el manejo de eventos del Juego de Memoria
class Memoria {

    // Constructor sin parametros
    constructor(){
        this.reiniciarAtributos();
        this.barajarCartas();
        this.tablero_bloqueado = false;

        this.cronometro = new Cronometro();
        this.cronometro.arrancar();
    }

    // Voltea las carta pasada como parametro
    voltearCarta(carta){
        // Comprobamos que la carta no esta deshabilitada, no esta volteada
        // y que el tablero no esta bloqueado
        if(carta.dataset.estado === "volteado" ||
            carta.dataset.estado === "revelado" ||
            this.tablero_bloqueado){
                return;
        }

        // volteamos la carta
        carta.dataset.estado="volteado";

        // si es la primera carta la guardamos
        if(!this.primera_carta){
            this.primera_carta = carta;
            return;
        }

        // si es la segunda carta la guardamos
        this.segunda_carta = carta;

        this.tablero_bloqueado = true;

        this.comprobarPareja();
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
        this.primera_carta.dataset.estado = "revelada"; // ponemos las cartas a reveladas
        this.segunda_carta.dataset.estado = "revelada";

        this.comprobarJuego();                          // comprobamos el juego

        this.reiniciarAtributos();                      // reiniciamos los atributos
        this.tablero_bloqueado = false;
    }

    // Comprueba si quedan cartas por emparejar en el juego o si ya han
    // sido descubiertas todas las parejas
    comprobarJuego(){
        const cartas = document.querySelectorAll("main article");
        const todasReveladas = Array.from(cartas).every(carta => carta.dataset.estado === "revelada");

        if(todasReveladas){
            this.cronometro.parar();
        }
    }

    // Método que pone bocabajo las dos últimas cartas descubiertas por el usuario
    // cuando no son iguales
    cubrirCartas(){
        this.tablero_bloqueado = true;  // Poner el tablero bloqueado

        // le damos la vuelta a las cartas con un retraso de 1.5s
        setTimeout(() => {
            this.primera_carta.removeAttribute("data-estado");
            this.segunda_carta.removeAttribute("data-estado");

            this.reiniciarAtributos();
            this.tablero_bloqueado = false;
        }, 1500);
    }

    // Comprueba si las cartas que han sido volteadas son iguales o no
    // Si las tarjetas son iguales; se deshabilitan, sino se darán la vuelta
    comprobarPareja(){
        const carta1 = this.primera_carta.children[1].getAttribute("src");
        const carta2 = this.segunda_carta.children[1].getAttribute("src");

        carta1 === carta2 ? this.deshabilitarCartas() : this.cubrirCartas();
    }


}