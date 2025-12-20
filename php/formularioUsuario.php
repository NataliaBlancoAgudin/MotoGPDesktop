<?php
// Documento para pedirle infomración al usuario
session_start();
require_once("conexion.php");

$stmtDispositivos = $pdo->query("SELECT id, nombre FROM dispositivos");
$dispositivos = $stmtDispositivos->fetchAll(PDO::FETCH_ASSOC);

if(count($_POST) > 0){
    $profesion = $_POST["profesion"];
    $edad = $_POST["edad"];
    $genero = $_POST["genero"];
    $pericia = $_POST["pericia"];
    $id_dispositivo = $_POST["dispositivo"];

    $stmt = $pdo->prepare("INSERT INTO usuarios (profesion, edad, genero, pericia_informatica) VALUES (?,?,?,?)");
    $stmt->execute([$profesion, $edad, $genero, $pericia]);
    $_SESSION["id_usuario"] = $pdo->lastInsertId();

    $stmtTest = $pdo->prepare("INSERT INTO tests (id_usuario, id_dispositivo, tiempo, completado) VALUES (?,?,0,0)");
    $stmtTest->execute([$_SESSION["id_usuario"], $id_dispositivo]);
    $_SESSION["id_test"] = $pdo->lastInsertId();

    header("Location: formularioPrueba.php");
    exit;
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
        <h2>Datos del usuario</h2>
        <p>Antes de comenzar con el test introduce tus datos: </p>

        <form method="POST">
            <p>Profesión:</p>
            <input type="text" name="profesion" required>

            <p>Edad:</p>
            <input type="text" name="edad" required>

            <p>Genero:</p>
            <select name="genero" required>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
            </select>

            <p>Dispositivo que vas a usar:</p>
            <select name="dispositivo" required>
                <?php foreach($dispositivos as $disp): ?>
                    <option value="<?= $disp['id'] ?>"><?= htmlspecialchars($disp['nombre']) ?></option>
                <?php endforeach; ?>
            </select>

            <p>Pericia informática (0-10)</p>
            <input type="number" min="0" max="10" name="pericia" required>

            <input type="submit" value="Iniciar Prueba">
        </form>
        
    </main>
</body>

</html>