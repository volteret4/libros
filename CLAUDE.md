# Music_Books

Webs estáticas (HTML + JS sin dependencias, se abren con doble clic) que convierten
un libro de historia de la música en un timeline interactivo de géneros o escenas,
sus influencias, los discos y canciones citados (con vídeo de YouTube) y los pasajes
del libro. Una carpeta por libro; el libro (PDF o ePub) vive dentro de su carpeta.
Toda la interfaz y los textos, en español.

**Portada común**: `index.html` en esta carpeta enlaza a todos los libros con una tarjeta por libro
(cubierta en `img/`, sacada del ePub; los que no tienen cubierta usable llevan una tipográfica)
con la paleta y las tipografías de su web. Las cifras de cada tarjeta se copian a mano: al añadir
o rehacer un libro, actualizarlas y añadir su tarjeta (y su clase de identidad en el `<style>`).
Cada web enlaza de vuelta con «← Todos los libros» encima del título.
En GitHub Pages cada web es su propio repo (`volteret4.github.io/scaruffi/`, `/loops_timeline/`,
`/Postpunk/`, `/jazz/`, `/HeavyMetal/`, `/1966/`, `/Funk/`, `/ComeUp/`, `/TechnoRebels/`, `/Flamenco/`, `/Salsa/`, `/DarkWaves/`) y esta carpeta es el repo `libros` (`/libros/`), que solo sube
`index.html`, `img/` y este fichero (lista blanca en `.gitignore`). Los enlaces llevan `data-pages`
con la ruta en Pages; un script (en línea en la portada, en `vistas.js` en las webs) los usa solo
cuando la página se sirve desde github.io, así que en local siguen siendo relativos. Un libro nuevo
necesita su `data-pages` en la tarjeta y en su «← Todos los libros».

Las cuatro webs tienen una pestaña **Portadas** (rejilla de portadas; al pulsar una, ficha con
portada, foto del artista, textos de Last.fm, iconos a los servicios que Wikidata conoce del
artista y los vídeos de todo lo que el libro cita de él). Su código es común y se copia igual
en cada carpeta: `covers.js` (web), `tools/covers.py` (datos) y el bloque
`/* ---------- Portadas (covers.js) ---------- */` al final de `style.css`. Si se cambia,
copiarlo a todas.

También comparten la pestaña **Menciones** (`menciones.js` y el bloque
`/* ---------- Menciones (menciones.js) ---------- */` de `style.css`): un desplegable para añadir
uno o varios géneros (fichas que se quitan con ✕; cada timeline se reordena arrastrando el asa ⠿ de su título; la selección va en
`#menciones=id1,id2|Artista`) y, para cada uno y en ese orden, un timeline con una barra por artista partida en los discos que el libro cita
de él (agrupados como en Portadas, que le pasa `groups` y `byArtist`), cada tramo del color de su
género. Al pulsar un artista, la ficha muestra los pasajes del libro que lo nombran y sus discos
con vídeo. Los pasajes salen de `data/mentions.js` (generado por `tools/pdfpages.py` a partir del
PDF; se carga la primera vez que se abre una ficha). Cada `app.js` llama a `Menciones({…})` con
`pageLink(m)`, que convierte una mención `[libro, página del PDF, página impresa, fragmento]` en
el enlace de página de esa web. Scaruffi la genera con
`python3 -I tools/pdfpages.py --sin-discos - <su PDF>` (no tiene `refs.js` y sus discos ya traen página).
En cada fila, además de los discos citados (en color, del género en que el libro los cita), salen
con borde el resto de álbumes de estudio del artista según MusicBrainz, cada disco en su año y una
línea de su primer a su último disco. Los trae `tools/discos.py` (común; una consulta por segundo,
así que un libro con mil artistas tarda más de media hora: lanzarlo en segundo plano) a la tabla
`discog` de `music.db` y genera `data/discos.js`. Quita recopilatorios, directos y remezclas, los
títulos de recopilatorio y lo publicado después de la muerte o disolución (Wikidata P570/P576).
`--retry` repite los artistas no encontrados o sin álbumes. `build.sh` lo ejecuta tras `covers.py`.

En la rejilla, los títulos de un mismo artista que comparten disco (misma portada o el mismo
álbum según Last.fm) se agrupan en una sola portada con un contador; la ficha muestra un
vídeo por canción.

Cada web tiene **identidad propia, siempre en tema oscuro**, con la misma estructura: la
paleta (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--grid`, `--accent`) y las fuentes
(`--font-title`, `--font-def`) están en el `:root` del principio de `style.css`; el bloque
`/* ---------- Identidad de esta web ---------- */` del final las aplica a títulos y
definiciones, y `index.html` carga las fuentes de Google Fonts. Los colores de las familias
del timeline (en `data/core.js`) no dependen de la paleta. Postpunk: negro, blanco roto y
rojo, Anton + Courier Prime. Loops: azul medianoche y cian, Syne + Space Grotesk. Scaruffi:
marrón tabaco y ámbar, Playfair Display + Source Serif 4. Jazz: negro de club y azul cobalto
Blue Note, Josefin Sans + Libre Baskerville. Metal (Weinstein): negro acero y carmesí, Metal Mania
+ Crimson Pro; es la **identidad de los libros de metal** (Sound of the Beast, Choosing Death,
Señores del caos… deben reutilizarla). 1966 (Savage): la de Postpunk por petición expresa, con acento
amarillo Day-Glo (`#f2c12e`) y una franja op art bajo el título. Funk (Vincent): berenjena y naranja,
Shrikhand + Karla, títulos con sombra púrpura. The Come Up (Abrams): asfalto y magenta (`#ff2e88`),
Bungee + Barlow, títulos con sombra amarilla y barra de progreso a rayas. Techno Rebels (Sicko): grafito y
verde ácido (`#b4ff39`), Michroma + IBM Plex Sans, títulos espaciados con resplandor de fósforo. Flamenco (Arbelos):
negro vino y rojo clavel (`#ef3e4a`), Rye + Lora, franja de lunares bajo el título y en la barra de progreso. Salsa (Rondón): noche caribeña verde petróleo y coral (`#ff6b4a`), Ultra + Alegreya, títulos con sombra turquesa y franja de atardecer (coral, mango, turquesa) bajo el título y en la barra de progreso. Dark Waves (O’Connor): negro azulado de CRT y violeta ultravioleta (`#a682ff`), Major Mono Display + Archivo, títulos con resplandor de tubo y líneas de barrido bajo el título y en la barra de progreso. Un libro nuevo de otro género debe
elegir una paleta y un par de fuentes distintos.

Las vistas (Timeline, Discos, Portadas…) se eligen en un **desplegable** (`vistas.js`, común, se carga
después de `app.js`): los botones `.views` siguen en el HTML, ocultos, porque el código los pulsa
para cambiar de vista, y el desplegable se sincroniza con ellos. Así la barra deja el ancho a los
filtros de familia.

**`music.db`** (SQLite, en esta carpeta) guarda todo lo consultado a Last.fm, Deezer y
Wikidata, tablas `release` (clave `artista|título` en minúsculas) y `artist` (clave = nombre
en minúsculas), cada fila con su JSON. Es común a todos los libros: un libro nuevo solo
consulta los discos y artistas que ningún otro trajo ya. `tools/covers.py` lo rellena y genera
`data/covers.js` (`window.<ESPACIO>_COVERS`, solo lo que usa ese libro). Necesita
`LASTFM_API_KEY` en el entorno. No borrar `music.db`: rehacerla cuesta horas.

**Enlaces a la página del libro.** Como en Scaruffi (que ya es un PDF), cada cita de las webs
de ePub enlaza a su página en un PDF del libro (`libro.pdf#page=N`, se abre en el visor del
navegador). `tools/pdfpages.py` (común; copiarlo igual en todas) genera el PDF desde el ePub
con Calibre (`ebook-convert`, A5, sin números de página impresos para que la página del visor
sea la del enlace) si no existe, busca cada cita en el texto de cada página comparando solo
letras y añade `pdf: N` a `data/refs.js`. También genera `data/pages.js` con las páginas que
mencionan cada disco o canción (título como palabras completas y el artista en la misma página
o la de al lado; los títulos corrientes solo cuentan entre comillas), que `trackHtml` muestra
junto a cada disco en todas las listas. Con `--impresas build/chapters/book.json` (Postpunk)
cada mención lleva también la página impresa. `build.sh` lo ejecuta tras `refs.py`. Postpunk
muestra la página impresa de Caja Negra (el enlace lleva a la del PDF); Jazz y Loops, que no
tienen paginación impresa, muestran la del PDF. Los PDF generados se quedan en la carpeta del
libro (Loops: `Loops_1_Javier_Blanquez.pdf` y `Loops_2_…`, hechos desde los ePub de
`/mnt/windows/FTP/moviles/books/musica/generos/electronica/`).

| Carpeta | Libro | Método |
|---|---|---|
| `Scaruffi_Historia_del_Rock/` | *A History of Rock Music 1951-2000* (PDF) | extracción automática + curación (`tools/curado.txt`) |
| `loops-timeline/` | *Loops 1* y *Loops 2* (ePub) | datos escritos a mano por capítulo |
| `Postpunk/` | *Postpunk. Romper todo y empezar de nuevo* (ePub escaneado) | datos escritos a mano por capítulo; **plantilla más reciente** |
| `Jazz/` | *Historia del jazz* de Ted Gioia (ePub en español) | datos a mano por capítulo; ★ = discografía recomendada del libro; páginas del PDF generado |
| `Heavy_Metal_Weinstein/` | *Heavy Metal: The Music and Its Culture* de Deena Weinstein (ePub de Da Capo, 2009, en inglés) | datos a mano por capítulo desde la plantilla de Jazz; ★ = los «100 Definitive Metal Albums» del apéndice A; citas literales en inglés; páginas del PDF generado. El PDF escaneado antiguo y `tools/extract.py` quedan de un primer intento |
| `1966_Savage/` | *1966: The Year the Decade Exploded* de Jon Savage (ePub de Faber, 2015, en inglés) | datos a mano mes a mes desde la plantilla de Weinstein (capítulo 1 = introducción, 2-13 = enero-diciembre, 14 = discografía); ★ = los singles de cada mes de la discografía del libro, volcados con un script y repartidos entre escenas; citas literales en inglés; eje de 1945 a 1971 con una etiqueta por año y 1966 destacado |
| `Funk_Vincent/` | *Funk: The Music, the People, and the Rhythm of the One* de Rickey Vincent (ePub de St. Martin’s Griffin, 1996, en inglés) | datos a mano por capítulo desde la plantilla de 1966 (capítulo 1 = prólogo y prefacio, 2-23 = capítulos 1-22, 24 = discografía); las cabeceras de sección salen de `toc.ncx`; ★ = la discografía esencial por capítulo del apéndice, que en el ePub son imágenes escaneadas (pg326-345): transcrita a mano y volcada con un script a las escenas; citas literales en inglés; eje de 1900 a 2000 |
| `ComeUp_Abrams/` | *The Come Up: An Oral History of the Rise of Hip-Hop* de Jonathan Abrams (ePub de Crown, 2022, en inglés) | datos a mano por capítulo desde la plantilla de Funk (capítulo 1 = nota del autor, 2-24 = capítulos 1-23); `split.py` lee los XHTML y saca la página impresa de los `pagebreak` del ePub (Postpunk: se muestra la impresa y se enlaza la del PDF); sin discografía, ★ = discos clave según el libro; citas literales en inglés; eje de 1965 a 2023 |
| `TechnoRebels_Sicko/` | *Techno Rebels: The Renegades of Electronic Funk* de Dan Sicko (ePub de Wayne State University Press, 2.ª ed., 2010, en inglés) | datos a mano por capítulo desde la plantilla de The Come Up (capítulo 1 = prólogo de Bill Brewster y prefacio, 2-8 = capítulos 1-7); `split.py` lee los HTML y saca la página impresa de las anclas `page_N`; sin discografía, ★ = discos clave según el libro; citas literales en inglés; eje de 1965 a 2011 |
| `Flamenco_Arbelos/` | *El flamenco contado con sencillez* de Carlos Arbelos (ePub de Epublibre de la edición de Maeva, 2003, en español) | datos a mano desde la plantilla de Techno Rebels; los capítulos largos se parten por apartados (1 = prólogo de Cristina Hoyos e introducción, 2 = el origen, 3 = su desarrollo, 4-6 = los palos, 7-9 = cantaores, tocaores, baile, piano y fusión, 10 = glosario y «Para leer, ver y escuchar»); `split.py` lee los XHTML y une cada bloque de versos en una línea con « / »; sin paginación impresa: se muestra y enlaza la página del PDF; ★ = la discografía del apéndice; eje de 1700 a 2005 (lo anterior, como la llegada de los gitanos en 1425, arranca en el borde) |
| `Salsa_Rondon/` | *El libro de la salsa* de César Miguel Rondón (ePub de Epublibre de la edición de Turner Noema, 2017, con el prefacio-coda de 2017, el de 2004, el prólogo de Leonardo Padura y la coda de 2004) | datos a mano desde la plantilla de Flamenco; los apartados se agrupan en 21 capítulos (1 = prefacios y prólogo, 2-3 = «Salsa cero», 4-6 = «Salsa uno», 7-14 = «Salsa dos (El boom)», 15-18 = «Salsa tres», 19-20 = coda, 21 = discografía básica); `split.py` lee los XHTML y une cada letra de canción (una tabla, a veces a dos columnas) en una línea, versos con « / » y columnas con « // »; las citas de letras a dos columnas, de un solo verso, porque el PDF intercala las columnas; sin paginación impresa: se muestra y enlaza la página del PDF; ★ = la discografía básica del apéndice y discos clave según el libro; eje de 1920 a 2016 |
| `DarkWaves_OConnor/` | *Dark Waves: The Synthesizer and the Dystopian Sound of Britain* de Neil O’Connor (ePub de Rowman & Littlefield, 2023, en inglés) | datos a mano por capítulo desde la plantilla de Techno Rebels (capítulo 1 = prólogo de Stephen Mallinder e introducción, 2-12 = capítulos 1-11); `split.py` lee los XHTML, saca la página impresa de los `doc-pagebreak` y descarta las notas; sin discografía, ★ = el disco analizado de cada artista y discos clave; citas literales en inglés; como el libro marca las canciones con comillas simples, `mentions.py` no las ve y hay que buscarlas aparte; eje de 1900 a 2022 (Hall, Baudelaire y el dandismo arrancan en el borde) |

## Cómo hacer la web de un libro nuevo

Partir de `Postpunk/` (es la versión más pulida de la plantilla de Loops):

1. Crear `NuevoLibro/` con el ePub/PDF dentro. Copiar `index.html`, `app.js`,
   `style.css`, `covers.js`, `menciones.js`, `vistas.js`, `data/core.js` y `tools/` de `Postpunk/`
   (o de `Jazz/` si el ePub no trae paginación impresa, como se hizo con Weinstein). Renombrar el espacio
   de nombres (`POSTPUNK`, `POSTPUNK_REFS`, `POSTPUNK_YT`) en `core.js`, `app.js`,
   `tools/refs.py`, `tools/yt.py` y `tools/check.js` (`covers.js` y `tools/covers.py` no
   se tocan: detectan el espacio de nombres solos); cambiar título, subtítulo y
   textos de `index.html`; ajustar en `app.js` `TOTAL` (capítulos), `Y0`/`Y1`/`PX`
   (rango de años y píxeles por año), el rango del eje (`drawAxis`) y el año de
   arranque del scroll, y en `chapterName` las etiquetas de prólogo/epílogo.
2. Extraer el texto: `tools/build.sh` descomprime el ePub, ordena el *spine* y
   convierte cada HTML a texto con pandoc. Revisar `tools/split.py`: las cabeceras
   de capítulo (`HEAD`) y la detección de números de página cambian según el libro
   (en Postpunk el escaneo dejaba los números impresos pegados al texto). Comprobar
   que los rangos de páginas por capítulo cuadran con el índice impreso.
   Si el libro es un PDF, ver el método de `Scaruffi_Historia_del_Rock/tools/`.
   Si el ePub no trae paginación impresa (Jazz), `split.py` estima la página a 300 palabras
   y guarda la sección de cada párrafo en `book.json`; `refs.py` la devuelve como `sec`.
   Si el libro trae una discografía recomendada, se vuelca en el último `data/NN-*.js` con
   `ess: 1` usando el artista y título exactos de los capítulos, para que se fusionen.
3. Definir 8-10 familias (con color) en `data/core.js`: son los carriles del timeline.
4. **Leer cada capítulo entero** (`build/chapters/NN.txt`; los de más de ~10.000
   palabras hay que leerlos en dos partes con `offset`) y escribir `data/NN-slug.js`
   inmediatamente después, antes de pasar al siguiente. Formato:
   ```js
   POSTPUNK.chapter({ n: 7, title: 'Título del capítulo', label: 'Prólogo' /* opcional */ });
   POSTPUNK.add([
     { id: 'joy-division', name: 'Joy Division', family: 'oscuro', start: 1977, end: 1980, place: 'Mánchester',
       aka: ['Warsaw'], desc: 'Resumen propio, en español, de lo que dice el libro…',
       artists: ['…'], labels: ['sellos, clubes, revistas, lugares'],
       tracks: [{ a: 'Joy Division', t: 'Unknown Pleasures', y: 1979, ess: 1 }],
       influences: ['punk-77', 'berlin'],          // ids de escenas de las que viene
       refs: [{ q: 'texto literal de una línea del capítulo' }] },
     { id: 'factory', note: 'Lo que añade este capítulo sobre una escena ya definida', tracks: [/* … */] },
   ], 7);
   ```
   - Una escena se define (name/family/start/end/desc) una vez; los demás capítulos
     solo añaden `note`, `tracks`, `refs`, `artists`… Se puede referenciar una escena
     antes de definirla (se fusiona por id).
   - `ess: 1` marca los discos clave (los que el libro destaca); usarlo con moderación.
   - Las citas `q` deben copiarse **literalmente de una sola línea** del capítulo, con
     las erratas del OCR incluidas; `tools/refs.py` las localiza (página impresa y
     párrafo) y falla si alguna no aparece.
   - Los años de los discos salen del conocimiento propio cuando el libro no los da.
5. Al terminar todos los capítulos: `python3 -I tools/mentions.py build/chapters/NN.txt data/NN-x.js`
   lista canciones citadas entre comillas (rectas o tipográficas) que faltan; añadir las reales en un segundo
   `POSTPUNK.add([...], NN)` al final de cada fichero.
6. `tools/build.sh --yt` (comprueba datos, localiza citas, busca vídeos con yt-dlp,
   portadas e información con `tools/covers.py` y actualiza las etiquetas `<script>` de
   `index.html`). La búsqueda de ~1000 títulos tarda varios minutos en YouTube y otros
   tantos en Last.fm (unas 5 consultas por segundo; lo que ya está en `music.db` no se
   repite): lanzarla en segundo plano. Revisar los `DUDOSO` del log;
   `tools/yt-ok.txt` acepta los correctos y `yq: 'consulta'` (o `yq: '-'`) en un
   disco fuerza otra búsqueda.
7. Verificar en un navegador sin interfaz:
   `chromium --headless=new --no-sandbox --window-size=1400,900 --screenshot=/ruta/tl.png "file://$PWD/index.html"`
   (y con `#id-de-escena` al final de la URL para ver una ficha, o
   `#portada=Artista%7CTítulo` para la de un disco).
   Abiertas con doble clic (`file://`), YouTube rechaza los vídeos incrustados (error 153:
   no hay *referrer*); servidas por HTTP funcionan. Para probarlas:
   `python3 -m http.server 8000` en la carpeta del libro y abrir `http://localhost:8000/`.

## Convenciones

- `node tools/check.js` debe dar 0 problemas: toda escena con name/family/start/end/desc
  e influencias que existan.
- Los ficheros generados (`data/refs.js`, `data/yt.js`, `data/yt.json`,
  `data/covers.js`, `data/pages.js`, `data/mentions.js`, `data/discos.js`, `build/`) no se editan a mano.
- Python siempre con `python3 -I`.
