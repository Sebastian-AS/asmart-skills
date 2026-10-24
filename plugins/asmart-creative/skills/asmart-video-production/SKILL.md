---
name: asmart-video-production
description: Producir y corregir videos de ASmartSolution con ASmartDesign, HyperFrames, voz seleccionada por calidad, Whisper, música de Mixkit y auditoría de movimiento. Usar para tutoriales, cápsulas, presentaciones en video y previews del curso con este flujo acordado.
---

# Producción de video ASmartSolution

Esta es la entrada única al proceso. Coordina las skills especializadas; no las fusiona ni copia sus manuales. Para cápsulas y presentaciones, el resultado principal es una plataforma web navegable fiel al contenido y a ASmartDesign; el video es una exportación complementaria cuando se solicita o forma parte del producto. Para encargos de video independiente, conservar ese formato. Ambos conservan proyecto editable y evidencia de revisión. Leer `asmart-video-guide/references/web-module.md` para el contrato web, apertura/cierre, compresión y descarga.

## Contrato obligatorio

1. **ASmartDesign es la autoridad visual.** Leer su SKILL.md, `references/visual-identity.md`, `references/element-library.md` y las fuentes pertinentes ANTES de diseñar escenas. Nombrarla no equivale a aplicarla. No reemplazar su identidad por preferencias del modelo, una plantilla, una paleta de catálogo ni el estilo de otra skill.
2. **Stack acordado:** HyperFrames compone y renderiza; Motion Design aporta coreografía; Review Animations revisa movimiento; la voz se selecciona por calidad y costo mediante una muestra; Kokoro es el proveedor local elegido por el usuario; Whisper transcribe la toma definitiva con tiempos; Mixkit proporciona música de fondo cuando corresponda. Leer las instrucciones aplicables antes de actuar. No cambiar proveedor o motor silenciosamente.
3. **No avanzar con una comprobación fallida o pendiente que afecte la etapa siguiente.** Corregirla o detener solo el trabajo dependiente. No presentar una prueba técnica aprobada como aprobación de diseño, comprensión o sincronía.
4. **Las instrucciones explícitas del usuario prevalecen.** Registrar cualquier cambio de identidad, herramienta, contenido o formato antes de ejecutarlo. Una petición de mayor movimiento no autoriza cambiar diseño, audio o guion aprobados.
5. Este archivo dirige un proceso de trabajo del agente. No instala herramientas, ejecuta otras skills automáticamente, impone controles técnicos al modelo ni programa trabajo de fondo por sí solo. Los controles requieren ejecución y evidencia; no prometer infalibilidad.

## Reutilización comprobable de la línea formativa

Para cápsulas, presentaciones y portada de biblioteca, leer `asmartdesign/references/learning-product-library.md`. Adoptar su renderer, mapas, geometría, estados/iconos explícitos y coreografía antes de crear componentes nuevos. Registrar versión y fuentes. Conservar los aciertos del original; no reducir todos los conceptos a una tarjeta genérica con la misma entrada.

Antes de replicar una base en un lote, comparar imágenes y movimiento con la referencia aprobada. Jerarquía, apoyo al significado y movimiento perceptible son criterios propios: los metadatos o un check aprobado no los sustituyen. Si falta esa evidencia, no presentar el estándar visual como aprobado ni multiplicar el patrón fallido. Corregir la biblioteca y volver a probar el módulo representativo, sin pedir aprobación rutinaria.

## Producción desde un tema y por lotes

Leer `asmart-video-guide/references/working-agreement.md` como perfil de colaboración, contenido y entrega. Con un tema basta para iniciar: investigar, completar la información, escribir el guion y dirigir con los defaults establecidos. Leer [producción por lotes](references/batch-production.md) para el orden de trabajo, comprobaciones por módulo e invalidación de resultados. El usuario revisa una propuesta concreta si lo desea; no es el auditor técnico ni debe escoger cada decisión.

## Resolver las dependencias

Usar el catálogo de skills del entorno y abrir el archivo real. No asumir que todas viven en una misma carpeta. Si una ruta cambió, buscar por el nombre del frontmatter. Leer [dependencias y prioridades](references/dependencies.md) al iniciar el proyecto o cuando cambie una dependencia.

- **Siempre, antes de diseñar:** `asmartdesign`.
- **Para composición y render:** `hyperframes`, seguido de su ruta y dominios aplicables. `hyperframes-core` antes de escribir HTML; `hyperframes-cli` para comprobaciones, preview y exportación; creative, animation, keyframes, registry, studio y audio cuando corresponda.
- **Para crear o modificar movimiento:** `motion-design` (puede estar en una carpeta llamada `howseen-motion-design`).
- **Para revisar ese movimiento:** `review-animations`, con una pregunta concreta y los archivos de animación como objeto de revisión. Cargar sus estándares cuando se necesiten valores precisos.
- **Para voz, transcripción y música:** `asmart-audio`, módulo independiente que consulta `media-use` y `hyperframes-audio`; leer [integración de audio](references/audio.md). No copiar sus procedimientos en este coordinador.
- **Para revisar texto destinado al espectador:** `unslop`.
- **Para un recorrido real de una web:** `agent-browser`. `campus-tool-workflow` únicamente si el producto es Campus y se necesitan sus recursos.
- **Para descubrir una capacidad faltante:** `find-skills`. Buscar no equivale a instalar, y una recomendación en un chat no equivale a aprobación de uso.

No incorporar como obligatorias skills de marketing, docencia o documentación que solo se propusieron. Las responsabilidades de mensaje, aprendizaje y evidencia siguen siendo del productor. No inventar dependencias instaladas.

## Flujo con condiciones de salida

Usar BRIEF.md, STORYBOARD.md y los registros que ya tenga HyperFrames. Integrar ahí las decisiones y enlazar las pruebas; evitar manifiestos duplicados. Si falta un lugar para las comprobaciones, crear `verification/REVIEW.md` dentro del proyecto. Registrar por comprobación: resultado, archivo o comando, instante o escena, hallazgo y corrección. Los resultados posibles son pendiente, fallo, aprobado o no aplica con motivo. Solo aprobar lo inspeccionado.

### 1. Entender el encargo

Revisar conversación, materiales y proyecto existente. Fijar público, resultado esperado, tema, contenido obligatorio, canal, idioma, duración aproximada, formato, voz y música. Distinguir cápsula, curso, presentación y tutorial: no ampliar una cápsula a un minicurso por iniciativa propia.

Resolver primero los huecos mediante investigación, contexto y defaults del acuerdo de trabajo. Preguntar solo por los que cambien materialmente el resultado y no se puedan resolver así, antes o durante el trabajo; no repetir datos conocidos ni exigir un guion al usuario. Elegir una sola dirección cuando haya contexto suficiente. No entregar menús de conceptos ni pedir al usuario que dirija decisiones rutinarias. Conservar las autorizaciones existentes; identificar las respuestas tardías a preguntas antiguas y contrastarlas con la instrucción vigente antes de alterar el alcance.

**Salida:** brief con alcance, criterios de éxito y decisiones pendientes explícitas. No producir voz definitiva ni animación detallada mientras una incógnita invalide ese trabajo.

### 2. Fijar diseño y comprobar herramientas

Leer ASmartDesign y seleccionar sus componentes y fuentes reales. Registrar en el documento de diseño del proyecto: tipografías, tokens, componentes elegidos, referencias consultadas y adaptaciones para video. Comprobar que las fuentes cargan realmente, sin sustitución silenciosa. Si falta un recurso obligatorio, resolverlo antes de construir las escenas dependientes.

Inspeccionar el runtime y las herramientas existentes antes de instalar. Verificar versiones y una prueba mínima de las herramientas que se van a usar. Si habrá voz nueva, comprobar una muestra breve en español del proveedor elegido según [voz y música](references/audio.md). Usar Kokoro con `em_alex` como punto de partida según la selección del usuario; verificar que la muestra cumpla el encargo. Comprobar Whisper para tiempos de palabra. No asumir disponibilidad por haber funcionado en otro chat.

**Salida:** identidad aplicada a un fotograma representativo inspeccionado, referencias y runtime comprobados. No avanzar a la composición completa si el diseño ignora ASmartDesign. Un fotograma correcto no acredita todavía el movimiento.

### 3. Guion, evidencia y plan de escenas

Escribir el mensaje antes de los efectos. Comprobar afirmaciones con fuentes o ejecuciones reales. En tutoriales, recorrer la función real, sus requisitos y su señal de éxito; no usar una interfaz recreada como prueba de funcionamiento. Identificar las ilustraciones cuando puedan confundirse con capturas reales.

Revisar el guion con unslop. Planear por unidades de significado: qué dice cada frase, qué se ve, qué acción visual la explica y qué estado deja para la siguiente. Renovar el apoyo visual cuando cambia el desarrollo de una idea aunque no cambie el capítulo. No confundir avance narrativo con añadir títulos.

**Salida:** guion y plan de escenas coherentes con el alcance, evidencia y diseño. La duración se ajusta a la explicación y a la voz real; no heredar los 30 segundos o los 6:45 de un proyecto anterior.

### 3b. Presentación HTML como base compartida

Para nuevas cápsulas, presentaciones y explicaciones creadas en código, construir una presentación navegable con las mismas escenas, componentes, tokens y recursos que usará el video. Permitir índice, teclado y navegación por escena/estado; scroll puede controlar avance. Mantener IDs estables para pedir correcciones de posición, tamaño y forma. Revisar diseño en esa presentación antes de animación detallada.

Separar el controlador interactivo del reloj de video: navegación y scroll seleccionan estados o tiempos de la misma escena; HyperFrames determina el tiempo durante render. No duplicar el diseño en una presentación y un video independientes ni convertir capturas de las diapositivas en la fuente principal del video. Para interacciones o ramas, registrar el recorrido lineal elegido. Mantener un encuadre de video definido aunque la presentación tenga controles responsivos externos.

Seguir la ruta HyperFrames aplicable; para un deck HyperFrames, leer su contrato slideshow y usar present cuando corresponda. No asumir que un deck navegable ya es un video renderizable. La presentación es la superficie de revisión; los tiempos y transiciones del video se verifican después. Este paso no convierte un tutorial de interfaz real en una recreación: los pasos reales siguen requiriendo captura. En cambios puntuales de proyectos existentes, no reconstruir todo como deck sin que forme parte del alcance.

**Salida:** presentación navegable revisada, escenas identificables y fuente de diseño compartida con la composición.

### 4. Voz y tiempos de referencia

Si existe audio aprobado, reutilizarlo. Si se pidió voz nueva, seleccionar proveedor y voz mediante [voz y música](references/audio.md), escuchar pronunciación, cortes, acento, expresividad y naturalidad antes de extender la toma. Conservar Kokoro como proveedor elegido y no sustituir una voz acordada silenciosamente. Investigar alternativas no autoriza cargos ni el uso de una API. La ausencia de voz es válida cuando el encargo así lo define.

Transcribir con Whisper el audio definitivo, después de los cambios que alteren sus tiempos. Contrastar transcripción y guion; corregir omisiones, alucinaciones y límites temporales. Conservar una fuente común de tiempos para subtítulos y cues visuales. Vincular cada cue a la frase completa y su significado: la coincidencia de una palabra no decide cuándo aparece una idea.

Mixkit es la biblioteca acordada para música instrumental de fondo cuando no hay una pista aprobada. Ejecutar el procedimiento de selección, licencia, descarga local, edición y mezcla de [voz y música](references/audio.md). Registrar la pista y su licencia; mencionar la biblioteca no equivale a incorporarla. Usar hyperframes-audio para mezcla; comprobar con escucha que la música permite comprender la voz.

**Salida:** toma escuchada, tiempos revisados y cues semánticos. Un cambio de velocidad, voz o corte invalida los tiempos afectados y exige recalcularlos.

### 5. Componer y animar

Usar HyperFrames como único dueño del reloj, medios y render. Adaptar las ideas de Motion Design a su contrato determinista. No crear un motor paralelo, adoptar colores Howseen ni imponer movimiento permanente para cumplir una receta de promoción.

Representar procesos con objetos que actúan: salir, llegar, transformar, dividir, trabajar y devolver evidencia. Mantener estados comprensibles y tiempo de lectura. Los movimientos responden al relato, no a resaltar palabras ni a llenar silencios con decoración.

Para mapas de filas, animar etiqueta, icono, fondo y descripción como una unidad: no sumar un segundo wipe o deslizamiento del párrafo a la entrada de su contenedor. Comprobar entradas y seek ida/vuelta para detectar la sensación de doble carga.

Para mapas y conectores, aplicar las comprobaciones específicas de [revisión y entrega](references/review.md). Usar círculos para agentes y rectángulos redondeados para tarjetas en este lenguaje de mapas; evitar óvalos estirados y rótulos sobre líneas. Preservar el diseño de controles reales capturados.

**Salida:** preview reproducible con diseño aplicado y movimiento sincronizado. Revisar tramos en reproducción, no únicamente capturas. Mostrar el preview de HyperFrames; no confundir una presentación de escenas con reproducir el MP4 ni cambiar el formato del proyecto para inspeccionarlo.

### 6. Revisar, corregir y exportar

Leer y ejecutar [revisión y entrega](references/review.md). Pasar Review Animations sobre el código modificado y una revisión audiovisual sobre la composición. Separar esos resultados de los comandos de HyperFrames. Atender las condiciones de preview y render de su flujo, aprovechando autorizaciones ya concedidas sin pedirlas otra vez.

**Salida:** cero fallos bloqueantes abiertos de diseño, sincronía, conectores, legibilidad, verdad del contenido o reproducción. Un informe sin evidencias no habilita la entrega. Si no puede realizarse una revisión requerida, describir exactamente la limitación y entregar solo como borrador pendiente de esa revisión.

Entregar la plataforma web cuando corresponde, con audio comprimido y controles según ASmartDesign. Si hay descarga MP4, exportar y revisar también el archivo final de la misma revisión; no mantener una descarga obsoleta. Entregar el video cuando corresponda, proyecto editable con recursos resolubles y subtítulos/transcripción cuando correspondan. Informar duración, resolución, estado de audio y limitaciones reales. No publicar ni enviar a terceros sin autorización.

## Correcciones de alcance limitado

Al reanudar, leer el estado del proyecto y la última instrucción antes de editar. Entrar en la etapa afectada y repetir sus comprobaciones y las posteriores que queden invalidadas; no rehacer el brief para corregir una línea.

Si solo se corrige lo visual, conservar guion, voz, música y cortes aprobados. Registrar hashes de los originales y compararlos después. Si se prometió identidad exacta del audio del MP4, verificar la pista extraída o los datos de audio decodificados según el contrato de exportación; el hash del archivo fuente no demuestra el audio del exportado. No afirmar identidad si hubo recodificación sin haber establecido qué se comparó.

## Distribution capabilities

In Claude chat, verify actual file, network, execution and media capabilities before using local CLI workflows. When a specialist is absent, preserve the editorial/visual checks and disclose the substitution. Loading these skills does not install a video runtime or grant access to Campus. See asmart-video-guide/references/portable-setup.md.
