<?php
require_once("conexion.php");
session_start();

if(!isset($_SESSION['id_test'])) {
    die("error: no hay test registrado");
}

$id_test = $_SESSION['id_test'];

if(isset($_POST['guardar_usuario'])){
    $comentarios = $_POST['comentario_usuario'] ?? '';
    $valoracion = $_POST['valoracion_usuario'] ?? 0;
    $propuestas = $_POST['propuestas_usuario'] ?? '';

    $stmt = $pdo->prepare("UPDATE tests SET comentarios = ?, valoracion = ?, propuestas = ? WHERE id=?");
    $stmt->execute([$comentarios, $valoracion, $propuestas, $id_test]);

    $mensaje_usuario="Gracias, tus comentarios y valoración se han guardado correctamente.";
}

if(isset($_POST['guardar_observador'])){
    $comentarios_obs = $_POST['comentario_observador'] ?? '';

    if($comentarios_obs != ''){
        $stmt = $pdo->prepare("INSERT INTO observaciones (id_test, comentario) VALUES (?,?)");
        $stmt->execute([$id_test, $comentarios_obs]);

        $mensaje_observador="Comentarios del observador guardadas correctamente";
    }
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
        <h3>Comentarios del Usuario</h3>
        <?php if(!empty($mensaje_usuario)){
            echo "<p>$mensaje_usuario</p>";
        }
        ?>
        <p>Exponga aquí los comentarios que tenga sobra la prueba realizada</p>
        <form method="POST">
            <p>Comentarios sobre la prueba realizada:</p>
            <textarea name="comentario_usuario" rows="4" cols="50"></textarea>

            <p>Valoración del test (0-10):</p>
            <input type="number" min="0" max="10" name="valoracion_usuario">

            <p>Propuestas de mejora:</p>
            <textarea name="propuestas_usuario" rows="4" cols="50"></textarea>

            <input type="submit" name="guardar_usuario" value="Guardar comentarios">
        </form>

        <h3>Comentarios del Observador</h3>
        <?php if(!empty($mensaje_observador)){
            echo "<p>$mensaje_observador</p>";
        }
        ?>
        <p>Deje este apartado para que el observador de la prueba exponga sus comentarios</p>
        <form method="POST">
            <p>Comentarios:</p>
            <textarea name="comentario_observador" rows="4" cols="50"></textarea>

            <input type="submit" name="guardar_observador" value="Guardar comentarios">
        </form>
    </main>
</body>

</html>