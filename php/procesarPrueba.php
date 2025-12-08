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
$completado = 1;

$stmt = $pdo->prepare("UPDATE tests SET tiempo = ?, completado = ? WHERE id=?");
$stmt->execute([$tiempo, $completado, $_SESSION['id_test']]);

// destruimos el cronometro
unset($_SESSION['cronometro']);

// redirigmos a la página de comentarios del usuario
header("Location: comentariosUsuario.php");
exit;
?>
