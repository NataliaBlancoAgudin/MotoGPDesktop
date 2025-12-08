<?php
// PHP para crear la conexión PDO (PHP Data Objects) con la base de datos
$servidor = "localhost";
$usuario = "DBUSER2025";
$password = "DBPSWD2025";
$baseDatos = "uo295340_db";

// crear la conexiion
try {
    $pdo = new PDO("mysql:host=$servidor;dbname=$baseDatos;charset=utf8", $usuario, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>