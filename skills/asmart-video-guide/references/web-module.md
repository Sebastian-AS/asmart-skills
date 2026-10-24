# Entrega de módulos web

Para cápsulas y presentaciones ASmartSolution, el entregable principal acordado es la plataforma web navegable. El MP4 es una exportación complementaria cuando se solicita o ya forma parte del producto aprobado. Un tutorial de una plataforma real sigue requiriendo evidencia/captura real; no recrear su interfaz como si probara funcionamiento.

## Fuente única y dependencias

Leer asmart-video-production como coordinador del stack y asmartdesign, incluida su referencia web-presentations.md, antes de diseñar. Reutilizar skills de terceros instaladas: HyperFrames y sus dominios, Motion Design, Review Animations, media-use; asmart-audio integra Kokoro, Whisper y música Mixkit. No fabricar implementaciones alternativas de esas skills ni copiar sus manuales dentro de esta. Si falta una capacidad, usar find-skills para localizarla dentro de la autorización vigente. No sustituir el diseño aprobado por el gusto del modelo o una plantilla frontend.

Una fuente de escenas y tiempos alimenta el player y HyperFrames. El player selecciona escenas/tiempos; el render tiene su propio reloj determinista bajo HyperFrames. Mantener IDs estables, índice y scrubbing. Las ramas interactivas requieren elegir y documentar un recorrido lineal para el MP4. Editar generadores/fuentes y regenerar el paquete; no corregir solo HTML generado. HTML/CSS/JS es suficiente: React es opcional, según el proyecto.

## Apertura y cierre

Añadir una portada con bienvenida breve (referencia 10–20s), tema y resumen fiel del contenido real. Comprobar la cobertura contra el guion; no prometer temas ausentes. Cues visuales y voz deben presentar las mismas ideas: no mostrar solo «agente/skill» mientras la voz está desmintiendo mitos. Si se tratan mitos, representarlos explícitamente como tales.

Al final de la explicación, dejar una tarjeta de marca unos segundos con música de fondo sin nueva narración, y salida suave. Referencia aprobada: 9s; adaptar al encargo. Contacto confirmado: **asmartsolution.com.mx**, **+52 (442) 376-2185**. Por ahora no mostrar correo ni redes inventadas; puede reservarse espacio sin enlaces o etiquetas ficticias. Mantener el contacto en una única configuración del proyecto. En navegación detenida, el cierre debe seguir legible aunque en reproducción termine en negro.

## Audio y peso para web

Conservar masters locales editables y entregar audio comprimido por separado del HTML. Referencia comprobada: voz AAC/M4A mono a 96 kb/s y música estéreo a 128 kb/s; ajustar tras revisar calidad. No incrustar WAV/base64 ni distribuir modelos TTS, node_modules, cachés, masters o herramientas en el paquete público. Fuentes, SVG, JS y demás recursos deben resolver en el paquete.

Medir tamaño real del paquete, audio y MP4 por separado; indicar si el MP4 está incluido o alojado aparte. No estimar almacenamiento mirando solo presentation.html. Un paquete estático puede servirse desde Pages y el MP4 opcional desde R2; eso no autoriza desplegar ni presume cuotas o precios actuales.

Si se concatena o normaliza audio, verificar duración y offsets reales en muestras. Los filtros pueden cambiar duración aunque sus parámetros parezcan correctos. Un cambio de intro desplaza audio, escenas, cues globales y subtítulos de manera coherente. Conservar la parte aprobada y comprobar la preservación prometida. No generar voz otra vez para una corrección solo visual.

## Descargar y validar

El HTML reproduce escenas y audio; no contiene automáticamente un MP4. El botón de descargar apunta a un archivo ya exportado y comprobado, local o remoto. No simular generación desde el navegador ni mostrar una descarga que devuelve un archivo ausente o una revisión anterior como si fuera actual. Si se ofrece exportación bajo demanda, implementar y verificar explícitamente el servicio necesario antes de anunciarla.

Tras cambiar escenas, actualizar tanto la web como el MP4 si la descarga forma parte de la entrega. Publicar el archivo y su indicador de disponibilidad tras validar; nunca confundir que el original no cambió con que la pista exportada sea idéntica.

Revisar: carga de recursos; audio comprimido y seek; sincronía semántica; navegación e índice; teclado, móvil y fullscreen; continuidad al cruzar escenas; mapas a velocidad normal y seek ida/vuelta. En filas no apilar movimiento del contenedor y revelado posterior del párrafo. Las comprobaciones de código no certifican por sí solas el resultado visual o auditivo.

Para MP4, validar dimensiones, FPS, duración, pistas y decodificación completa, además de inspeccionar las transiciones afectadas. Informar con precisión qué se verificó y cualquier revisión pendiente. Entregar enlace a la plataforma y a la descarga disponible; el proyecto editable y licencias permanecen resolubles.

## Auditoría mecánica reutilizable

Ejecutar desde cualquier carpeta, resolviendo la instalación real de la skill:

```bash
python3 scripts/audit_web_module.py --project /ruta/al/proyecto --output /ruta/al/proyecto/verification/web-audit.json
```

La ruta del script es relativa a esta skill. Por defecto inspecciona `presentation/slides.json` y `web/`; admite `--scenes` y `--web`. Usarlo si ese es el formato real, sin imponerlo a otro renderer. Comprueba timeline, cues, composición compartida, manifiesto enviado, archivos excluidos y peso. No sustituye la revisión de contenido, sincronía semántica, navegador, escucha ni MP4. Para producción repetida, leer también `asmart-video-production/references/batch-production.md`.
