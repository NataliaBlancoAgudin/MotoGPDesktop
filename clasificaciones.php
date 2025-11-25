<?php
// Clase Clasificacion
class Clasificacion{
    protected $documento;

    /**
     * Constructor que inicializa el atributo documento con la ruta
     * al documento circuitoEsquema.xml
     */
    public function __construct(){
        $this->documento = "./xml/circuitoEsquema.xml";
    }

    /**
     * Método que lee la información existente en el docuemnto
     */
    public function consultar(){
        if(file_exists($this->documento)) {
            $xmlStr = file_get_contents($this->documento);

            $xmlStr = preg_replace('/xmlns="[^"]*"/', '', $xmlStr);

            return simplexml_load_string($xmlStr);
        }
        return null;
    }
}

$clasificacion = new Clasificacion();
$xml = $clasificacion->consultar();
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP Clasificaciones</title> <!-- Titulo -->
    <meta name="author" content="Natalia Blanco Agudín" /> <!-- Autora -->
    <meta name="description" content="Página de las clasificaciones de MotoGP" /> <!-- Descripcion-->
    <meta name="keywords" content="MotoGP, Clasificaciones" /> <!-- Palabras importantes-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!-- Ventana -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="icon" href="multimedia/favicon.ico" /> <!-- Favicon -->
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <a href="index.html" title="Página de inicio">
            <h1>MotoGP Desktop</h1>
        </a>
        <!-- Menú de navegación de la aplicación-->
        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de la aplicación">Juegos</a>
            <a href="ayuda.html" title="Página de ayuda">Ayuda</a>
        </nav>
    </header>

    <!-- Migas de navegación -->
    <p>Estas en: <a href="index.html" title="Página de inicio">Inicio</a> >> <strong>Clasificaciones</strong></p>

    <main>
        <h2>Clasificaciones de MotoGP-Desktop</h2>
        
        <?php if($xml): ?>

            <?php $circuito = $xml->circuito; ?>
            <section>
                <h3>Ganador de la carrera</h3>
                <p>Nombre: <?= $circuito->vencedor->nombre ?></p>
                <p>Tiempo: <?= $circuito->vencedor->duracion ?></p>
            </section>

            <section>
                <h3>Clasificación del mundial</h3>
                <ul>
                <?php foreach($circuito->clasificacionMundial->posicion as $posicion): ?>
                    <li>
                        <p>Puesto <?= $posicion['numero'] ?>: <?= $posicion->nombre ?> - <?= $posicion->puntos ?>
                    </li>
                <?php endforeach; ?>
                </ul>
            </section>
        <?php else: ?>
            <p>No se pudo leer el archivo XML.</p>
        <?php endif; ?>
    </main>
</body>
</html>