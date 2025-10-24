import xml.etree.ElementTree as ET
import os

class Html:
    """Clase para generar el archivo HTML InfoCircuito.html"""

    def __init__(self, title="Red Bull Ring - Spielberg", css_path="../estilo/estilo.css"):
        self.title = title
        self.css_path = css_path
        self.html_elements = []

    def add_element(self, content):
        """Añade contenido HTML (en forma de texto)"""
        self.html_elements.append(content)

    def generate_html(self, filename):
        """Genera el archivo HTML con la estructura completa"""
        html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>{self.title}</title>
    <meta name="author" content="Natalia Blanco Agudín" />
    <meta name="description" content="Información del circuito" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="{self.css_path}" />
</head>

<body>
    <header>
        <h1>{self.title}</h1>
    </header>

    <main>
        {"".join(self.html_elements)}
    </main>
</body>
</html>"""

        with open(filename, "w", encoding="utf-8") as file:
            file.write(html_content)
        print(f"Archivo HTML generado correctamente: {filename}")


def xml_a_html(archivoXML):
    """Genera InfoCircuito.html a partir del archivo circuitoEsquema.xml"""

    # Espacios de nombres
    ns = {'uniovi': 'http://www.uniovi.es'}

    try:
        arbol = ET.parse(archivoXML)
    except (IOError, ET.ParseError) as e:
        print(f"Error al procesar el XML: {e}")
        return

    raiz = arbol.getroot()

    circuito = raiz.find('.//uniovi:circuito', ns)
    if circuito is None:
        circuito = raiz  # si el circuito es la raíz misma
        print("No se encontró <circuito> explícito; usando la raíz del XML.")

    html_gen = Html(title="Información del Circuito MotoGP", css_path="../estilo/estilo.css")

    # --- 1. Información general ---
    def get_text(tag):
        elem = circuito.find(f'uniovi:{tag}', ns)
        return elem.text if elem is not None else ""

    def get_attr(tag, attr):
        elem = circuito.find(f'uniovi:{tag}', ns)
        return elem.attrib.get(attr, "") if elem is not None else ""

    nombre = get_text('nombre')
    longitud = get_text('longitudCircuito')
    unidad_long = get_attr('longitudCircuito', 'unidades')
    anchura = get_text('anchura')
    unidad_anch = get_attr('anchura', 'unidades')
    fecha = get_text('fecha')
    hora = get_text('horaSp')
    num_vueltas = get_text('numeroVueltas')
    localidad = get_text('localidad')
    pais = get_text('pais')
    patrocinador = get_text('patrocinador')

    html_gen.add_element(f"""
        <h2>{nombre}</h2>
        <section>
            <h3>Circuito</h3>
            <ul>
                <li>Longitud: {longitud} {unidad_long}</li>
                <li>Anchura: {anchura} {unidad_anch}</li>
                <li>Fecha: {fecha}</li>
                <li>Hora: {hora}</li>
                <li>Número de vueltas: {num_vueltas}</li>
                <li>Localidad: </li>
                <li>País: {pais}</li>
                <li>Patrocinador: {patrocinador}</li>
            </ul>
        </section>
    """)

    # --- 2️. Vencedor ---
    vencedor = circuito.find('uniovi:vencedor', ns)
    if vencedor is not None:
        nombre_v = vencedor.findtext('uniovi:nombre', default='', namespaces=ns)
        duracion = vencedor.findtext('uniovi:duracion', default='', namespaces=ns)
        html_gen.add_element(f"""
            <section>
                <h3>Vencedor</h3>
                <p>{nombre_v} con una duración total de {duracion}.</p>
            </section>
        """)

    # --- 3️. Clasificación Mundial ---
    html_gen.add_element("""
        <section>
            <h3>Clasificación Mundial</h3>
            <table>
                <caption>Top 3 Pilotos</caption>
                <tbody>
                <tr>
                    <th>Posición</th>
                    <th>Nombre</th>
                    <th>Puntos</th>
                    <th>País</th>
                </tr>
    """)

    for pos in circuito.findall('.//uniovi:clasificacionMundial/uniovi:posicion', ns):
        num = pos.attrib.get('numero', '')
        nombre_p = pos.findtext('uniovi:nombre', default='', namespaces=ns)
        puntos = pos.findtext('uniovi:puntos', default='', namespaces=ns)
        pais_p = pos.findtext('uniovi:pais', default='', namespaces=ns)
        html_gen.add_element(f"""
            <tr>
                <td>{num}</td>
                <td>{nombre_p}</td>
                <td>{puntos}</td>
                <td>{pais_p}</td>
            </tr>
        """)
    html_gen.add_element("</tbody></table></section>")

    # --- 4️. Bibliografía ---
    html_gen.add_element("""
        <section>
            <h3>Bibliografia</h3>
            <ul>
    """)
    for ref in circuito.findall('.//uniovi:bibliografia/uniovi:referencia', ns):
        descripcion = ref.attrib.get('descripcion', '')
        enlace = ref.text or ''
        html_gen.add_element(f'<li><a href="{enlace}">{descripcion}</a></li>')
    html_gen.add_element("</ul></section>")

    # --- 5️. Galería ---
    html_gen.add_element("<section><h3>Galería</h3>")
    for foto in circuito.findall('.//uniovi:galeria/uniovi:foto', ns):
        descripcion = foto.attrib.get('descripcion', '')
        src = foto.text or ''
        html_gen.add_element(f"""
            <picture>
                <source srcset="../multimedia/{src}_movil.jpg" media="(max-width: 465px)">
                <source srcset="../multimedia/{src}_tablet.jpg" media="(max-width: 799px)">
                <source srcset="../multimedia/{src}_monitor.jpg" media="(min-width: 800px)">
                <img src="../multimedia/{src}.jpg" alt="{descripcion}" />
            </picture>
        """)
    html_gen.add_element("</section>")

    # --- 6️. Vídeos ---
    html_gen.add_element("<section><h3>Vídeos del circuito</h3>")
    for video in circuito.findall('.//uniovi:videos/uniovi:video', ns):
        descripcion = video.attrib.get('descripcion', '')
        src = video.text or ''
        html_gen.add_element(f"""
            <video controls>
                <source src="../multimedia/{src}.webm" type="video/webm" />
                <source src="../multimedia/{src}.mp4" type="video/mp4" />
            </video>
        """)
    html_gen.add_element("</section>")

    # --- Guardar HTML final ---
    salida = os.path.join(os.path.dirname(os.path.abspath(archivoXML)), "InfoCircuito.html")
    html_gen.generate_html(salida)


# --- EJECUCIÓN PRINCIPAL ---
if __name__ == "__main__":
    archivoXML = r"C:\Users\nati6\OneDrive\Escritorio\Informatica\4 Curso\Primer Semestre\SEW\SEW-PL\MotoGP-Desktop\xml\circuitoEsquema.xml"
    xml_a_html(archivoXML)

