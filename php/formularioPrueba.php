<?php
require_once("cronometroClase.php");
session_start();


// si no existe el usuario, volvemos atrás
if(!isset($_SESSION["id_usuario"])) {
    header("Location: formularioUsuario.php");
}

// Limpiar objetos incompletos
if(isset($_SESSION["cronometro"]) && !$_SESSION["cronometro"] instanceof Cronometro){
    unset($_SESSION["cronometro"]);
}

// Si no existe cronómetro, lo creamos y arrancamos
if(!isset($_SESSION["cronometro"])) {
    $_SESSION["cronometro"] = new Cronometro();
    $_SESSION["cronometro"]->arrancar();
}
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP Test</title> <!-- Titulo -->
    <meta name="author" content="Natalia Blanco Agudín" /> <!-- Autora -->
    <meta name="description" content="Página de Test de MotoGP" /> <!-- Descripcion-->
    <meta name="keywords" content="MotoGP, Test" /> <!-- Palabras importantes-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!-- Ventana -->
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="icon" href="../multimedia/favicon.ico" /> <!-- Favicon -->
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <a href="../index.html" title="Página de inicio">
            <h1>MotoGP Desktop</h1>
        </a>
    </header>

    <!-- Migas de navegación -->
    <p>Estas en: <a href="../index.html" title="Página de inicio">Inicio</a> >> 
        <a href="../juegos.html" title="Juegos de la aplicación">Juegos</a> >> <strong>Test</strong></p>

    <main>
        <h2>Test MotoGP-Desktop</h2>
        <form action="procesarPrueba.php" method="POST">
            <ol>
                <li>¿Cómo se llama el piloto de motociclismo portugues que 
                    compite en la categoría reina de MotoGP con el equipo 
                    Prima Pramac Yamaha?</li>
                <input type="text" name="pregunta1" required>

                <li>¿Qué es el Pole Position?</li>
                <input type="text" name="pregunta2" required>

                <li>¿En qué puesto quedo Marc Márquez en la 
                    clasificación de este año de MotoGP?</li>
                <input type="text" name="pregunta3" required>

                <li>¿En qué país está la ciudad de Spielberg donde
                    se encuentra el circuito Red Bull Ring - Spielberg?</li>
                <input type="text" name="pregunta4" required>

                <li>¿Cuál es el gentilicio de la ciudad de Spielberg?</li>
                <input type="text" name="pregunta5" required>

                <li>¿Cuál es el dorsal de Miguel Oliveira?</li>
                <input type="text" name="pregunta6" required>

                <li>¿Cuántos habitantes tiene la ciudad de Spielberg?</li>
                <input type="text" name="pregunta7" required>

                <li>¿Cuántas victorias tiene el piloto Miguel Oliveira?</li>
                <input type="text" name="pregunta8" required>

                <li>¿En qué puesto quedo Francesco Bagnaia en la 
                    clasificación de este año de MotoGP?</li>
                <input type="text" name="pregunta9" required>

                <li>¿En qué año nació el piloto Miguel Oliveira?</li>
                <input type="text" name="pregunta10" required>
            </ol>

            <input type="submit" value="Terminar prueba">
        </form>
    </main>
</body>

</html>