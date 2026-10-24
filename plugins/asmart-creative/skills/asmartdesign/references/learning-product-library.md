# Biblioteca ejecutable de cápsulas ASmartSolution

Leer para producir/revisar cápsulas, presentaciones navegables o su biblioteca de acceso. Complementa web-presentations.md; no redefine toda interfaz de ASmartSolution.

## Estado de aceptación

La aprobación corresponde al módulo original Agentes y skills. La biblioteca extraída y las adaptaciones del catálogo siguen en revisión del usuario. Su reutilización no equivale a aprobación estética. Adoptar correcciones explícitas del usuario y verificarlas en las cápsulas generadas; no limitar la implementación a una galería de componentes.

## Fuente estable

`assets/learning-product/v1/` es la biblioteca portable, revisión 1.1.0-review (familia v1). `manifest.json` registra procedencia y SHA256. No depende de que exista el chat o el proyecto original. Se extrajo del módulo aprobado Agentes y skills; `fixtures/` conserva HTML original byte por byte, `reference/` conserva fuentes históricas que NO son API productiva. No ejecutar reference/build.py o covers-reference.py para un módulo nuevo: contienen el tema/agenda originales.

- `covers.py` y `covers.css`: portada y cierre parametrizados del original. Cada entrada de agenda recibe frase, icono y cue medido sobre la voz; no heredar agenda del módulo anterior.
- `ui.py` y `product-ui.css/js`: header/footer Campus, cuenta con adaptador de sesión y player con información modal.
- `renderer.py`: API `render_scene(scene)`; genera la misma subcomposición para web y HyperFrames. CSS original en `design.css`, fuentes/logo/Tabler y licencia en `assets/`.
- `examples.json`: nueve entradas ejecutables, no guiones narrados; ocho formas de referencia y una adaptación de proceso a evidencia. Cues comprimidos para inspección; no reutilizarlos como sincronía de otro audio.
- `presentation/`: shell, índice y player reutilizables. Player incluye correcciones de índice móvil, seek y fase del fondo observadas durante el lote. Conectar datos/audio/descarga del módulo; no copiar URLs del shell original. Verificar interacciones después de integrar.
- `catalogue.py`, `catalogue.css`, `catalogue-background.js`: catálogo de acceso derivado de Campus Landing/Portal, motor original en `campus/constellation-field.js`. Una acción principal por cápsula, video/miniatura real, público/requisitos y recursos en detalles secundarios. Adaptar datos, no crear otra portada desde colores.
- `serve.py`: servidor local con peticiones Range para audio/MP4.

Construir y abrir la galería antes de elegir componentes:

```bash
python3 scripts/build_learning_library.py --output /ruta/al/proyecto/web/diseno --proof /ruta/al/proyecto/verification/library-proof
```

Ruta del script relativa a asmartdesign. Servir la carpeta web, abrir diseno/index.html y probar entradas, lectura, reproducción/pausa, seek y reduced motion. La prueba HyperFrames vive fuera del paquete público, separada del módulo final. Ejecutar check sobre esa prueba cuando se cambie el renderer, y comprobar que sus auditorías realmente se ejecutaron. No instalar/actualizar el motor para una simple copia de recursos; registrar versión usada.

## Datos del catálogo

`catalogue.build_catalogue(output, modules)` devuelve el HTML y copia sus assets de estilo/motor. Cada módulo requiere id, title, objective, audience, prerequisites (lista de IDs/texto), group, duration y mp4_bytes, con rutas `modules/<id>/presentation.html`, recursos.html y renders/capsula.mp4 comprobadas por el empaquetador. Preparar `assets/posters/<id>.jpg` a partir de un fotograma real; también agentes-y-skills.jpg para el destacado de esta edición. El builder rechaza posters ausentes. Para otro curso, adaptar el destacado y su enlace en este componente; no representar la muestra anterior como el producto nuevo.

## Contrato de escena

Importar renderer.py desde la copia de biblioteca adoptada. La escena requiere `id` estable, `title`, `lead`, `chapter`, `note`, `start`, `duration`, `kind`, `surface`, `variant`, `times` y `items`. `series`, `number` y `total` son opcionales. Cada item: `title`, `body`, `icon` Tabler local y, cuando aporte significado, `role` y `label`. Ejemplo ejecutable: examples.json.

Familias actuales: rows (1–5 entradas); pair (2), columns (3), flow (3), code (2), hero (2), delegate (3). Superficies paper/floating explícitas. Variantes compatibles: bubble-list→rows/floating, agent-comparison→pair/floating, stagger-pair→pair/floating, fan-cards→columns/floating y open-paper→code/paper. No forzar cuatro pasos dentro de flow de tres: extender un componente conscientemente y verificarlo o dividir el relato por significado.

Icono y rol son decisiones editoriales explícitas. No decidir estados negativos por buscar palabras como «fallo», ni usar el índice de tarjeta para asignar icono. `avoid` requiere etiqueta visible; una alternativa válida no se vuelve error por no ser la recomendada. Un dato, documento, decisión o responsable debe verse como tal cuando es el objeto de la explicación; las tarjetas no sustituyen cualquier representación.

`times` contiene cues locales vinculados a frases definitivas. No incluye el start global. Reservar tiempo de llegada/lectura y señal hasta el final; renderer rechaza transferencias fuera de duración. El componente de proceso programa cada enlace con el cue del destino; delegación usa el de cada encargo. Fondo de filamentos usa tiempo absoluto del módulo en render; web mantiene fase entre lectura, play/pausa y navegación. El motor interactivo Campus del catálogo NO se carga en composiciones MP4.

## Estándar y comparación

Identidad estable: geometría por función, tipos y escala, iconos, paleta, controles y fondo. Variabilidad útil: contenido, relación explicada, componente/variante y cues. Cambiar de tema no autoriza degradar el componente. Reutilizar CSS sin sus formas/estados/coreografía no conserva el estándar.

Antes de extender un lote, comparar con fixtures/original una escena densa, una comparación y un mapa/proceso en movimiento. Registrar imágenes emparejadas, instantes, fuente y dictamen. La variedad de nombres kind no acredita variedad visual. Si pierde jerarquía, claridad o significado, corregir la base antes de replicar. Estas revisiones las ejecuta el productor; no requieren aprobación rutinaria del usuario.

La prueba de fondo requiere evidencia observable: varios segundos de lectura, play, pausa/reanudación, cambio de escena, seek y reduced motion. Tener tweens no demuestra movimiento visible. La revisión de diseño es independiente del check técnico: un MP4 decodificable o 0 errores de layout no aprueba el estándar visual. Conservar fallos y correcciones; no convertirlos en verdes modificando el criterio.

Revisar también el orden de aparición contra el relato: una lista que entra desde abajo por cues no monótonos deja huecos aunque su estado final sea legible. Reordenar los elementos según la explicación, vincularlos a su primera enumeración o mostrar juntos los datos que son contexto; elegirlo por significado. No basta inspeccionar el último frame.

`render_contract.py` permite registrar las huellas de escenas, timeline, medios y fuentes antes del render y contrastarlas al finalizar y empaquetar. Excluye la interfaz, que no se imprime en el MP4. Invalidar la descarga si cambian entradas del video; un marcador de existencia no prueba vigencia. Registrar si una huella fue tomada después de exportar, sin atribuirle una comprobación previa que no existió.

Para extender la biblioteca: añadir el componente al código, un ejemplo con contenido distinto y una comprobación de su riesgo real. Registrar procedencia y nueva revisión del manifiesto, integrarlo en el producto y comprobarlo en navegador/exportación. No acumular instrucciones para suplir código que debe reutilizarse.
