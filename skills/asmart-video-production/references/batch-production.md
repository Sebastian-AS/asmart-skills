# Producción repetible y por lotes

Leer al producir un módulo desde un tema o una lista de temas. El perfil estable vive en `asmart-video-guide/references/working-agreement.md`; diseño y controles en ASmartDesign. Este proceso organiza el trabajo autorizado de la sesión: no crea por sí solo una automatización recurrente.

## Una base estable, contenido distinto

Usar el módulo aprobado como referencia de implementación si está disponible, no como contenido universal. Recuperar componentes útiles sin arrastrar guion, audio temático, fuentes factuales antiguas ni manifests de otra pieza. Usar fuentes editables y generadores; no mantener dos implementaciones de escena para web y MP4.

Centralizar en la configuración existente: identidad, contacto, voz, compresión, encuadre, opciones del player, versión de fuentes y runtime. En datos del módulo: ID, tema, objetivo, público, alcance, fuentes verificadas, guion, escenas, medios y marcas temporales. En cada beat: frase/intervalo, idea visible, cambio visual y estado siguiente. No llenar nuevos manifiestos si BRIEF, STORYBOARD y datos del proyecto ya expresan esto.

Cuando el usuario da una lista de temas, cada uno produce un módulo salvo otra agrupación indicada. Mantener un índice de lote en el proyecto con ID, tema, estado, ruta, revisión, duración, peso, evidencia y bloqueo concreto si existe. No dejar un fallo oculto bajo un promedio de éxito ni afirmar que todo el lote está listo porque el primer módulo pasó.

## Orden de trabajo

1. **Tema → brief y evidencia.** Investigar y escribir objetivo, alcance y guion. Usar los defaults y preguntar solo por incertidumbre material. Comprobar que la introducción y el contenido coinciden. No volver a negociar estética y voz por pieza.
2. **Guion → beats y diseño.** Mapear significado a texto/diagrama y elegir entre familias de layouts conocidas: definición, comparación, proceso, delegación, documento/código y síntesis. Variedad al servicio de la comprensión; misma escala de diseño. Preparar un frame denso y una transición representativa para detectar problemas compartidos antes de extenderlos.
3. **Voz y música → tiempos definitivos.** Kokoro em_alex; revisar muestra técnicamente y escuchar cuando sea posible, sin pedir una nueva selección al usuario si se conserva el perfil. Generar, transcribir con Whisper y corregir tiempos. Música local Mixkit con licencia, volumen bajo y salida musical sin voz. Verificar offsets reales tras concat/normalización. Fijar audio antes de coreografía fina.
4. **Escenas compartidas → plataforma y composición.** Índice, navegación, progreso y controles según ASmartDesign. Acoplar cues a significado, prever contexto al inicio, cambios de mapa dentro del capítulo y pausas legibles. Animación seek-safe y fondo continuo a tiempo absoluto. El shell no entra al render.
5. **Revisión propia → corrección.** Ejecutar el contrato de release descrito abajo. Corregir causas comunes y regenerar las piezas afectadas. Reutilizar pruebas previas solo si los archivos que las sustentan siguen vigentes.
6. **Exportación y paquete.** Exportar MP4 si forma parte del encargo, verificarlo, empaquetar solo runtime y audio comprimido, y habilitar su descarga al estar listo. Actualizar índice de lote y entregar enlaces funcionales.

En un lote nuevo, completar primero un módulo representativo con este proceso para estabilizar componentes y comprobaciones; continuar los demás sin esperar aprobación rutinaria. Cambios de una base compartida invalidan los módulos que la usan y requieren nueva comprobación de esos módulos. Aislar los recursos y nombres de salida para no mezclar audios, tiempos o contactos.

## Contrato de release por módulo

En verification/REVIEW.md o el registro existente, cada comprobación indica revisión/archivos, resultado, evidencia e instante/escena. Estados: pendiente, fallo, aprobado, no aplica con motivo. Un comando no demuestra una revisión editorial ni auditiva. No usar una puntuación global para ocultar una comprobación crítica fallida.

- **Información:** afirmaciones sustentadas; vocabulario claro; objetivo cumplido; portada promete lo que se enseña; cierre correcto. Revisar alcance sin ampliaciones accidentales.
- **Voz:** texto definitivo sin omisiones, pronunciación/naturalidad revisadas, niveles y mezcla inteligibles, uniones sin cortes. Whisper contrastado, no tomado como verdad automática.
- **Sincronía:** cada beat vinculado a una frase y escena correctas; revisar negaciones, palabras repetidas, comienzo, cambios de capítulo y final. Detectar explicación nueva sin apoyo visual y largas esperas vacías. El offset de audio se mide, no se supone.
- **Diseño/movimiento:** revisión de código con Review Animations y reproducción de transiciones con audio. Legibilidad, escalas comunes, semántica independiente del color, conectores completos visibles y destinos existentes. Cero doble revelado de filas. Estados antes/durante/después de entradas, incluido seek adelante/atrás y continuidad ambiental entre escenas.
- **Técnica:** checks de HyperFrames sobre la revisión actual; recursos y fuentes resolubles; IDs únicos, timeline sin gaps/solapes accidentales, cues dentro de su escena. Detectar texto recortado o fuera del encuadre en todas las escenas, no solo nueve muestras automáticas.
- **Web:** probar carga del paquete servido, play/pause, scrubbing, capítulos, índice abierto/cerrado, búsqueda y pins si existen, teclado, móvil, fullscreen y descarga real. Sin errores de recursos; el índice no mueve el lienzo ni oculta controles necesarios. Revisar estado de lectura completo frente a reproducción desde el inicio.
- **Entrega:** peso real desglosado, audio web comprimido, exclusión de masters/cachés, MP4 vigente con dimensiones/FPS/duración/pistas/decodificación verificados. Inspección del exportado, no solo preview. Integridad de audio conservado cuando se prometió.

Usar `asmart-video-guide/scripts/audit_web_module.py` para la parte mecánica de timeline, archivos, copia compartida, cues y tamaño cuando se use el manifiesto slides.json de este flujo. Su reporte indica un alcance limitado: no aprueba sincronía semántica, diseño, escucha, interacciones ni MP4. Para otras estructuras, adaptar las comprobaciones al formato del renderer en vez de crear un segundo manifiesto solo para la herramienta.

Los fallos de contenido, sincronía, legibilidad, recursos, reproducción o descarga bloquean la etiqueta final. Resolver antes de entregar. Una preferencia menor no exige iteraciones infinitas. Si hay un bloqueo externo, continuar módulos independientes y comunicar qué entrega sigue pendiente.

## Invalidación y costo de cambios

- Solo shell/controles: regenerar web y comprobar esas interacciones; no re-renderizar un video cuyo escenario y audio no cambiaron.
- Escenas o coreografía: comprobar layouts y tiempos afectados, regresión del patrón compartido, regenerar web y MP4 incluido. Mantener audio aprobado; si se conserva la pista comprimida sin recodificar, documentar esa operación.
- Guion/voz/cortes/velocidad: regenerar audio afectado, transcripción y cues, duraciones/global offsets y todos los artefactos dependientes. Volver a comprobar inicio y final, no solo la frase cambiada.
- Tema/fuentes: nueva revisión editorial y de hechos aunque la plantilla visual sea idéntica.

Mantener registros reanudables y checks por módulo. No repetir investigación de estilo ni instalaciones por costumbre; sí revalidar información temática mutable. La revisión rutinaria la hace el productor. Pedir al usuario únicamente lo que no pueda resolver con evidencia, defaults y su autorización vigente.
