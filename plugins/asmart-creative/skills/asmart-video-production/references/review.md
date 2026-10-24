# Revisión obligatoria y entrega

Registrar en el proyecto qué se inspeccionó, con archivo, escena o tiempo y resultado. Una lista marcada sin comprobar el artefacto no es evidencia. El productor realiza una pasada separada de revisión; usar otro agente solo cuando esté autorizado. No llamar independiente a una revisión propia.

## Antes de exportar

1. **Identidad:** contrastar apertura, escena densa y cierre con ASmartDesign. Revisar tokens efectivos, fuentes realmente cargadas, componentes y jerarquía. Inspeccionar las imágenes además del CSS: declarar variables de marca no demuestra que se usen. Bloquear paletas o tipografías ajenas no autorizadas.
2. **Mensaje y verdad:** cada afirmación importante corresponde al guion y a su fuente. Un ejemplo ilustrado no se presenta como ejecución real. En tutoriales, los pasos necesarios y el resultado son visibles. En cápsulas conceptuales, los diagramas explican relaciones correctas. En previews comerciales, la promesa y el siguiente paso se apoyan en evidencia.
3. **Sincronía semántica:** recorrer todas las unidades del plan de escenas con audio. Comprobar que una idea no aparece antes de que se introduzca ni llega después de su explicación. Revisar especialmente negaciones, comparaciones y palabras repetidas. El cue debe corresponder a la frase correcta, no a la primera mención de una palabra.
4. **Apoyo visual:** cada desarrollo tiene apoyo pertinente; cambiarlo dentro del capítulo cuando el relato lo necesite. Detectar largos tramos con un mapa agotado, entradas simultáneas que compiten o efectos sin función explicativa. Las pausas legibles son válidas.
5. **Movimiento:** ejecutar Review Animations con una solicitud específica de revisión del código y documentar sus hallazgos y dictamen. Corregir bloqueos aplicables. Ver las transiciones a velocidad normal y examinar los instantes conflictivos con mayor detalle. El chequeo técnico no sustituye esta revisión.
6. **Legibilidad:** revisar la escena más densa a tamaño de destino, texto superpuesto, etiquetas, recortes y tiempo de lectura. No esconder acciones o código importantes con subtítulos. Revisar inicio, mitad y fin de cada transición entre mapas.
7. **Audio y subtítulos:** escuchar toda la toma usada en la composición; detectar palabras cortadas, pronunciación problemática, saturación y música que enmascare la voz. Revisar subtítulos contra voz y tiempos. No usar labels instructivos como si fueran una transcripción.
8. **Técnica:** ejecutar los checks correspondientes de HyperFrames sobre la revisión actual; resolver fallos y explicar avisos que queden. Verificar fuentes, medios locales y seek determinista en escenas con lógica propia.

## Mapas y conectores

Comprobar en estado estable y durante entradas, salidas y cambios de disposición:

- Toda línea tiene un origen y destino visibles mientras se representa la conexión. No dibujar retornos a un nodo que todavía está oculto.
- Los extremos se calculan desde los bordes reales de las figuras transformadas. Una curva no sobrepasa el punto de llegada ni vuelve a meterse bajo el nodo.
- El trazado completo es visible y no queda enterrado bajo tarjetas ajenas; resolver rutas y capas sin poner líneas sobre texto. No basta con que se vea la bolita animada.
- Las curvas son moderadas y no generan bucles o giros cerrados en distancias cortas. Revisar las ramas reales, no solo la ruta principal.
- Los rótulos no se montan sobre conectores o entre sí. Los cambios de mapa despejan el anterior antes de introducir elementos incompatibles.
- Los agentes mantienen proporciones circulares; las tarjetas son rectángulos redondeados, sin elipses largas accidentales.
- Cuando un marcador animado ya comunica dirección, usar conectores sin puntas redundantes. Si el estado detenido necesita una dirección explícita, resolverla de forma inequívoca y comprobarla.

Las capturas permiten encontrar cruces, pero no prueban continuidad. Reproducir las conexiones completas con audio y revisar alrededor de cualquier anomalía.

En mapas de filas, revisar que etiqueta, icono y cuerpo aparezcan una sola vez como conjunto. No apilar la entrada del contenedor y un wipe posterior del párrafo. Verificar reproducción continua y seek hacia delante y atrás.

## Después de exportar

- Abrir el archivo final y reproducirlo completo a velocidad normal con audio. Las verificaciones del preview no prueban el MP4. Si no hay capacidad para verlo o escucharlo, dejar esa comprobación pendiente y declarar el archivo como borrador.
- Comprobar duración, dimensiones, FPS, pistas y archivo decodificable con las herramientas del renderer y ffprobe/ffmpeg disponibles. Ajustar expectativas al brief; no imponer la duración de una entrega anterior.
- Examinar nuevamente los tramos con conectores, cambios de mapa y transiciones densas del archivo exportado. Corregir discrepancias entre preview y exportación.
- Reabrir el proyecto editable y comprobar que resuelve sus recursos. Incluir subtítulos/transcripción si forman parte del encargo y conservar fuentes/licencias de medios.
- Para cambios visuales sobre un audio aprobado, verificar la preservación prometida y registrar qué archivos o pistas se compararon. No afirmar «audio idéntico» basándose únicamente en que el WAV original no cambió.

## Decisión

Bloquean la entrega como final: identidad sustituida sin autorización, significado visual incorrecto, desfase que cambia la comprensión, conectores huérfanos u ocultos, texto esencial ilegible, audio incomprensible, contenido falso, exposición de datos privados o exportación no reproducible.

Corregir y repetir las comprobaciones afectadas. Si una herramienta o recurso impide hacerlo, reportar el bloqueo concreto y conservar el estado como borrador; no cambiar de stack para ocultarlo. No convertir una preferencia estética menor en un ciclo infinito de revisión.

Entregar el resultado y una síntesis breve de cambios, verificaciones realmente completadas y limitaciones. No trasladar al usuario el papel de auditor técnico para poder declarar terminado el trabajo.
