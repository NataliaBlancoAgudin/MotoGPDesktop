<?php
// Clase cronometro 
class Cronometro {
    protected $tiempo;
    private $inicio;

    /**
     * Constructor de la clase cronometro que inicializa el tiempo a 0
     */
    public function __construct(){
        $this->tiempo = 0;
    }

    /**
     * Método que crea el atributo inicio, marcando el momento
     * temporal en el que se inicia el cronometro
     */
    public function arrancar(){
        $this->inicio = microtime(true);
    }

    /**
     * Método que toma una referencia del momento acutal y calcula
     * la cantidad de tiempo que ha trascurrido
     */
    public function parar(){
        $this->tiempo = microtime(true) - $this->inicio;
    }

    /**
     * Método que muestra el cronometro en formato mm:ss.s
     */
    public function mostrar(){
        $totalSegundos = $this->tiempo;

        $min = floor($totalSegundos / 60);
        $seg = floor($totalSegundos % 60);
        $decima = floor(($totalSegundos - floor($totalSegundos)) * 10);

        return sprintf("%02d:%02d.%d", $min, $seg, $decima);
    }

    /**
     * Método auxiliar para guardar el tiempo en la bd
     */
    public function getTiempo() {
        return $this->tiempo;
    }
}
?>