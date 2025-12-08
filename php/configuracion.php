<?php

// Clase para la configuracion de la base de datos
class Configuracion {
    private $servidor = "localhost";
    private $usuario = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $baseDatos = "uo295340_db";

    private $conexion;

    /**
     * Creamos el constructor estableciendo la conexion a la base
     * de datos que hemos creado.  
     */
    public function __construct() {
        $this->conexion = new mysqli($this->servidor, $this->usuario, $this->password);

        if($this->conexion->connect_error){
            exit ("<p>ERROR de conexión:".$db->connect_error."</p>");
        }
    }

    /**
     * Reinicia la base de datos entera eliminando todos los datos
     * de las tablas
     */
    public function reiniciar() {
        $this->conexion->select_db($this->baseDatos);

        $this->conexion->query("DELETE FROM observaciones");
        $this->conexion->query("DELETE FROM tests");
        $this->conexion->query("DELETE FROM dispositivos");
        $this->conexion->query("DELETE FROM usuarios");

        return "Datos reiniciados correctamente";
    }

    /**
     * Elimina la base de datos entera (no solo los datos de las tablas,
     * sino las tablas enteras)
     */
    public function eliminarBaseDatos() {
        $this->conexion->query("DROP DATABASE IF EXISTS $this->baseDatos");
        return "Base de datos eliminada completamente.";
    }

    public function exportarCSV() {
        $this->conexion->select_db($this->baseDatos);

        $tablas = ["usuarios", "dispositivos", "tests", "observaciones"];
        $exportados = [];

        foreach ($tablas as $tabla) {
            $resultado = $this->conexion->query("SELECT * FROM $tabla");
            $archivo = "./$tabla-" . date("Ymd_His") . ".csv";
            $fp = fopen($archivo, "w");

            if($resultado && $resultado->num_rows > 0) {
                $primeraFila = $resultado->fetch_assoc();
                fputcsv($fp, array_keys($primeraFila));

                $resultado->data_seek(0);

                while($fila = $resultado->fetch_assoc()) {
                    fputcsv($fp, $fila);
                }
            } else {
                $resultadoColumnas = $this->conexion->query("SHOW COLUMNS FROM $tabla");
                $columnas = [];
                while($col = $resultadoColumnas->fetch_assoc()) {
                    $columnas[] = $col["Field"];
                }
                fputcsv($fp, $columnas);
            }

            fclose($fp);
            $exportados[] = $archivo;
        }

        return $exportados;
    }
}

$configuracion = new Configuracion();
$mensaje = "";
$exportados = [];

if(isset($_POST["reiniciar"])) {
    $mensaje = $configuracion->reiniciar();
}
if(isset($_POST["eliminar"])) {
    $mensaje = $configuracion->eliminarBaseDatos();
}
if(isset($_POST["exportar"])) {
    $exportados = $configuracion->exportarCSV();
    $mensaje = "Datos exportados correctamente.";
}
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP Configuración Base de Datos</title> <!-- Titulo -->
    <meta name="author" content="Natalia Blanco Agudín" /> <!-- Autora -->
    <meta name="description" content="Página de configuración de la base de datos" /> <!-- Descripcion-->
    <meta name="keywords" content="MotoGP, Configuración" /> <!-- Palabras importantes-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!-- Ventana -->
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" /> <!-- Enlazar hoja de estilos -->
    <link rel="icon" href="multimedia/favicon.ico" /> <!-- Favicon -->
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1>MotoGP Desktop - Configuración Test Usabilidad</h1>
    </header>

    <!-- Migas de navegación -->
    <p>Estas en: <a href="index.html" title="Página de inicio">Inicio</a> >> <strong>Configuración Test</strong></p>

    <main>
        <form action="#" method="POST">
            <input type="submit" name="reiniciar" value="Reiniciar"/>
            <input type="submit" name="eliminar" value="Eliminar"/>
            <input type="submit" name="exportar" value="Exportar"/>
        </form>

        <p><?= $mensaje ?></p>

        <?php if (!empty($exportados)) : ?>
            <h2>Archivos exportados:</h2>
            <ul>
                <?php foreach ($exportados as $e): ?>
                    <li><?= $e ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </main>
</body>
</html>