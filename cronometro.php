<?php
session_start();
require_once("php/cronometroClase.php")

// Creamos el cronometro si no existe en sesión
if(!isset($_SESSION["cronometro"])) {
    $_SESSION["cronometro"] = new Cronometro();
}

$crono = $_SESSION["cronometro"];
$salida = "";

// Gestión de los botones
if(isset($_POST["arrancar"])) {
    $crono->arrancar();
}

if(isset($_POST["parar"])) {
    $crono->parar();
}

if(isset($_POST["mostrar"])) {
    $salida = $crono->mostrar();
}
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP Cronometro PHP</title> <!-- Titulo -->
    <meta name="author" content="Natalia Blanco Agudín" /> <!-- Autora -->
    <meta name="description" content="Cronometro php de la aplicación" /> <!-- Descripcion-->
    <meta name="keywords" content="MotoGP, Cronometro" /> <!-- Palabras importantes-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!-- Ventana -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="icon" href="multimedia/favicon.ico" /> <!-- Favicon -->
    <script src="js/circuito.js"></script> <!-- Circuito -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet"> <!-- MapBox CSS-->
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script> <!-- MapBox JS -->
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
            <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de la aplicación" class="active">Juegos</a>
            <a href="ayuda.html" title="Página de ayuda">Ayuda</a>
        </nav>
    </header>

    <!-- Migas de navegación -->
    <p>Estas en: <a href="index.html" title="Página de inicio">Inicio</a> >> <strong>Cronómetro</strong></p>
    <main>
        <section>
            <h2>Cronómetro</h2>

            <form action="#" method="post">
                <input type="submit" name="arrancar" value="Arrancar"/>
                <input type="submit" name="parar" value="Parar"/>
                <input type="submit" name="mostrar" value="Mostrar"/>
            </form>

            <?php if($salida !== ""): ?>
                <p>Tiempo: <?= $salida ?><p>
            <?php endif; ?>
        </section>
    </main>
</body>
</html>