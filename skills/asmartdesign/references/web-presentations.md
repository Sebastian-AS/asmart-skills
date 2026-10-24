# Presentaciones web y cápsulas ASmartSolution

Contrato aprobado en la cápsula Agentes y skills, 15 de octubre de 2026. Aplicar a este tipo de producto; no imponer sus controles o duración a toda interfaz de marca.

## Identidad, variedad y significado

- Outfit en títulos, Source Sans 3 en cuerpo; fuentes locales para un paquete autónomo. Tabler SVG es la familia de iconos del manual activo de Campus; conservar sus trazos y licencia. Font Awesome en otras páginas históricas no es la referencia para estos controles.
- Mantener una escala común de títulos, cuerpo, alturas y espaciados entre tarjetas equivalentes. La estandarización permite variedad: burbujas separadas para conceptos y relaciones, tarjetas para comparaciones y procesos, una superficie común para código o listas que lo necesiten. No convertir toda la cápsula en una misma caja rígida.
- Asignar iconos por significado: conversación, agente, método, herramientas, ajustes, revisión, etc. Evitar iconos decorativos intercambiables.
- Errores, mitos y malas prácticas pueden usar rojo. Combinar color con texto explícito e icono: «Evitar», «Suposición», «Mito descartado». Un ejemplo aprobado usa fondo #432333, borde #dc8591 y texto #ffe4e8; verificar contraste efectivo. No marcar en rojo una alternativa válida solo por estar fuera de una skill.
- Debe entenderse qué conviene y qué se evita sin escuchar el audio. Sincronizar también las negaciones y el significado de cada tarjeta.

## Fondo y movimiento

Puede permanecer un mismo fondo animado durante toda la presentación. Elegir uno propio para el producto; Campus demuestra la integración y no obliga a copiar su hero. Originkit, Watermelon UI, HyperFrames Registry y otras fuentes son opciones, no dependencias estéticas obligatorias. Usar find-skills para una carencia concreta, leer la skill encontrada y conservar procedencia/licencia de los recursos usados.

El fondo es sutil, detrás del texto, con reduced motion. En render, toda animación depende del tiempo de composición, sin relojes paralelos aleatorios. El movimiento de contenido explica el relato y no es solo un cambio automático de slides.

En mapas de filas, etiqueta, icono, fondo y descripción entran como una unidad. No superponer la entrada de la fila con un segundo wipe/clipPath o deslizamiento del párrafo: produce sensación de doble carga. Referencia aprobada: desplazamiento horizontal de 24px, opacidad 0→1, 0.5s, power3.out, en el cue existente. Es una referencia adaptable, no un tiempo universal. Revisar a velocidad normal y al avanzar/retroceder; no basta el estado final.

## Header e índice

Para reproducir el manual de Campus, inspeccionar `assets/campus/` según campus-site.md y portar la implementación activa completa: geometría, colores, tipografía, animación, búsqueda, selección, Todo/Anclado y pins cuando se incluyan. No construir una aproximación solo con sus colores. Separar presentación de autenticación y datos privados.

En el reproductor aprobado hay un único toggle junto al logo, con los SVG de sidebar abierto/cerrado del manual, en el header. Abre el índice completo o lo oculta: sin modo intermedio ni botón interior redundante. El índice es overlay y no cambia la geometría del escenario. En pantallas estrechas, scrim, cierre con Escape y gestión de foco. Mantener controles accesibles cuando se abre el panel. Anclado es opcional si no se necesita.

## Controles del producto web

- Play/pause, descargar y pantalla completa: iconos Tabler en áreas circulares de interacción de al menos 44px. Sin rótulos enormes ni borde/círculo permanente; círculo discreto al pulsar, sin animación ornamental. Nombre accesible y foco visible por teclado.
- Pantalla completa: dos flechas diagonales, no cuatro; estado de salida coherente.
- No añadir anterior/siguiente por defecto: el índice y la línea de tiempo ya ofrecen navegación. Conservar atajos pertinentes.
- Progreso de video: línea fina casi transparente, progreso discreto y puntos por sección/capítulo; no waveform de audio ni grandes bloques de color. Mostrar tiempo y capítulo al explorar. No resaltar el contorno de toda la sección al interactuar con el scrub; conservar accesibilidad de teclado sin ese contorno envolvente.
- Los controles externos no se imprimen en el video. Su interacción no debe alterar posiciones o tamaños dentro del encuadre.

Al revisar este reproductor, probar también una reducción de ventana con reproducción pausada cerca del final. El marcador debe recalcular su posición al cambiar el ancho de pista; no basta actualizar el ancho cacheado para el siguiente tick. Comprobar el estado después de un repintado: una pestaña oculta puede aplazar ResizeObserver. La comprobación inicial móvil a tiempo cero no detecta este fallo.

## Implementación reutilizable

Para esta línea de producto, adoptar [la biblioteca ejecutable](learning-product-library.md), sus componentes y galería. La referencia original de abajo permite contrastar decisiones históricas; la biblioteca permite producir sin depender de ese proyecto. No sustituirla por otro generador que conserve solo colores y fuentes.

## Referencia verificable

Proyecto original, si sigue disponible: `<local-workspace>/Curso IA/videos/codex-skills-agentes`. Fuentes editables: `presentation/build.py`, `covers.py`, `player.js`, `campus-index.css`, `shell.css`, `card-semantics.json`. `web/` es generado. Consultar DESIGN.md y verification/REVIEW.md para decisiones y evidencia. Este documento contiene el contrato reutilizable; la skill no depende de que ese proyecto exista.

## Consistencia en una serie

Lo estable es la identidad, escala tipográfica, controles y calidad; lo variable es la composición que explica cada tema. Elegir una dirección y construirla sin pedir opciones A/B/C. Conservar componentes y datos de diseño compartidos para lotes, pero no repetir mecánicamente el mismo mapa, tres tarjetas o efecto en todas las escenas. Probar la escena más densa y el movimiento representativo antes de extender el patrón.

La unidad de coreografía es el significado: mantener orientación visual desde el inicio y renovar el diagrama cuando la voz desarrolla otra relación dentro de un capítulo. En comparaciones puede mostrarse el conjunto y enfatizarse al mencionarlo; no dejar pantallas vacías esperando la última palabra. No activar por mera coincidencia de vocabulario. Para el perfil de colaboración y contenido, consultar asmart-video-guide/references/working-agreement.md.

## Fondos y variedad por pieza

Elegir el fondo según el encargo, sin repetir un efecto por defecto. Revisar primero las variantes reales de ASmartSolution y las fuentes locales disponibles; si ninguna encaja, buscar una alternativa instalada y adaptarla a la paleta y legibilidad de la marca. Reutilizar la fuente local cuando se elige una variante concreta; no volver a investigar ni instalarla. Mantener un solo efecto por vista y dejarlo sutil detrás del contenido.


## Ajustes explícitos de plataforma · 16 de octubre de 2026

El original Agentes y skills es la referencia aprobada; la biblioteca extraída, la portada nueva y sus adaptaciones siguen en revisión del usuario. No llamar aprobado a un resultado por ser reutilizable o pasar pruebas.

En esta línea, cada cápsula tiene apertura narrada con bienvenida, tema y avance de su contenido, con agenda visual sincronizada por frases; luego desarrollo y cierre de marca. Verificar esa cobertura en el módulo real y su MP4, no solo en una galería.

Usar header/footer Campus, logo enlazado al inicio de la sección, Curso IA y Materiales de práctica juntos, cuenta arriba a derecha con comportamiento real de desplegable y contrato de integración de sesión. No simular autenticación en un paquete estático. Índice cerrado al abrir; toggle permanece accesible. Colección/Guion y fuentes dentro del índice, sin esos enlaces en header. Información bajo botón i circular sin borde junto a descargar; sin descripción ni botones informativos debajo del video. No añadir flechas diagonales decorativas a enlaces de cápsula o materiales; el affordance de hover/foco basta. La flecha de explorar puede conservarse. Intentar reproducción directa cuando el navegador lo permita; conservar play si bloquea autoplay con audio.
