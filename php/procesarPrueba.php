<?php
require_once("cronometroClase.php");
require_once("conexion.php");

session_start();

// Si no hay usuario, redirigir
if(!isset($_SESSION["id_usuario"])) {
    header("Location: formularioUsuario.php");
    exit;
}


if(!isset($_SESSION["cronometro"]) || !$_SESSION["cronometro"] instanceof Cronometro) {
    die("Error: no se encontró un cronómetro activo válido.");
}

// PARAR CRONÓMETRO
$cronometro = $_SESSION["cronometro"];
$cronometro->parar();
$tiempo = $cronometro->getTiempo();

// INSERTAR TEST EN BD
$id_usuario = $_SESSION["id_usuario"];
$id_dispositivo = 1; // puedes cambiarlo o pedirlo al usuario
$completado = 1;
$comentarios = "";
$propuestas = "";
$valoraciones = "";

try {
    $sql = "INSERT INTO tests 
            (id_usuario, id_dispositivo, tiempo, completado, comentarios, propuestas, valoracion)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id_usuario,
        $id_dispositivo,
        $tiempo,
        $completado,
        $comentarios,
        $propuestas,
        $valoraciones
    ]);

    // Destruir cronometro para evitar reutilización
    unset($_SESSION["cronometro"]);

    echo "<h2>Prueba finalizada correctamente</h2>";
    echo "<p>Tiempo empleado: ". $tiempo ." segundos</p>";

} catch (PDOException $e) {
    die("Error al guardar el test: " . $e->getMessage());
}
?>