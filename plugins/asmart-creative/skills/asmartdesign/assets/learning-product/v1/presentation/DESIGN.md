# Diseño de la reconstrucción

ASmartDesign como autoridad: visual-identity.md y element-library.md. Se reutilizan las fuentes locales y el lenguaje de hojas de lectura de manual-reader.css; el mapeo de procesos guía los conectores. No se importan estilos de plantillas externas.

Paleta: navy #0f1f38, principal #1a365d, secundario #2d4a7a, acción #4a6fc1, papel #f8fafc, tinta #1e293b. Outfit para titulares y Source Sans 3 para cuerpo.

Lienzo compartido 1920×1080. Márgenes horizontales 192px. Titular 66px, entradilla 32px. Hoja de contenido 1536×574px; filas de definición de altura fija de 88px, concepto 31px y explicación 31px. Paneles comparativos de 390px de alto y padding compartido. Agentes circulares, tarjetas rectangulares redondeadas. La homogeneidad se aplica por función: no se fuerza a un agente circular a ser un cuadro.

Primero se comparó el tratamiento con el brief: se descartó un mosaico genérico de tres tarjetas para todo. Definiciones usan filas, contrastes usan dos paneles, contratos usan documento y los procesos reales usan secuencias. Los controles de revisión viven fuera del lienzo y nunca aparecen en el render.

presentation.html y HyperFrames leen las mismas subcomposiciones. Leer muestra el estado completo; reproducir busca el tiempo local de la escena con el audio existente. IDs estables para las correcciones. La presentación escala el lienzo completo y mantiene geometría; los controles se adaptan a pantalla pequeña.

## Revisión Campus y movimiento · 15 octubre 2026

La fuente principal actual es `<local-workspace>/Workshop/Campus`, revisión `49ea822f6c95ace7a7dfb5ab521bf2c4dcf752e2`. ASmartDesign incorpora 69 archivos de esta fuente, con manifiesto y verificador, además de 40 referencias anteriores. El manual activo usa ManualPage → ManualWatermelon, con la cascada final de codex.css y manual-watermelon.css. La portada se observó en navegador; el manual autenticado se verificó por fuente porque su acceso está protegido.

El shell adopta el logo horizontal blanco oficial, header transparente, campo oscuro, índice de cristal con esquinas de 4px, búsqueda, Todo/Anclado, estrellas persistentes, colapso y selección. Se portaron estados y proporciones a HTML local. No se copiaron cuenta, autenticación, descarga o edición ajenas al propósito de esta presentación. Overlay móvil con scrim y Escape; foco devuelto al botón de apertura. Controles accesibles de 44px.

15 escenas usan piezas flotantes separadas (hero, columnas, flujos, delegación y comparaciones seleccionadas); 14 mantienen hoja de lectura. Se conservan 29 escenas, todas sus marcas de tiempo, guion y WAV originales. Entradas de burbujas de 480ms con desplazamiento lateral de 24px y escala 0.97 → 1; los conectores se trazan en 600ms. En procesos, un pulso atraviesa cada conexión entre tarjetas; en delegación, dos señales siguen las curvas hacia los encargos. La geometría de las curvas se calcula desde coordenadas fijas antes de registrar la timeline, sin mediciones ni callbacks de dibujo durante reproducción. No hay deriva continua ni movimiento de fondo en el video. Reduced motion elimina traslaciones, escalas y señales móviles, conservando la aparición del contenido.

La pose completa de lectura detiene las señales transitorias. Para revisar movimiento hay que reproducir con audio o mover el cursor de narración. `presentation/shell.css` contiene la adaptación de controles; `presentation/build.py` sigue siendo la única fuente de las escenas tanto navegables como renderizables.

## Dirección vigente: movimiento y fondo propio

Esta sección sustituye la decisión anterior de mantener estático el fondo del video. Campus es una referencia de integración del shell. El usuario pidió un fondo diferente y confirmó que puede mantenerse el mismo durante toda la presentación.

Plan aplicado: azul noche `#0b172b`, superficie `#182e4f`, azul medio `#295080`, acción `#4a6fc1`, luz `#a8c0ef`, papel `#f8fafc`; Outfit y Source Sans 3 conservadas. Un campo de filamentos atraviesa la zona inferior y el lateral derecho, dejando quieta y despejada la cabecera. El mismo dibujo de 18 curvas se reutiliza en las 29 escenas; velocidad, color y fase dependen del tiempo absoluto, sin volver a empezar en cada corte. En lectura pausada, únicamente el fondo sigue vivo mediante el controlador externo de la presentación. En render, todo está bajo la timeline registrada de HyperFrames.

Autocrítica antes de aplicar: repetir dos tarjetas idénticas con fade/slide conservaba el aspecto de diapositivas automáticas. Se sustituyó por cinco familias: etiquetas y explicaciones desplegadas, comparaciones asimétricas (agente circular cuando corresponde), abanico de tarjetas, procesos en cápsulas conectadas y documentos abiertos. Las entradas parten de posiciones y giros coherentes con su composición, y revelan el texto mediante máscaras. Los tamaños por función, los márgenes de lectura y las marcas de voz siguen fijos. La restricción de usar un único fondo evita que la variedad de escenas se convierta en cambios constantes de estilo.

Referencias investigadas: Originkit Light Cables, Line Ripple Background y Blinking Squares; Watermelon Expandable Event Card, Onboarding Checklist e Integration Card; catálogo HyperFrames constellation-hub y sine-wave. Se eligió un campo vectorial original inspirado en el concepto de Light Cables, no una copia de su componente WebGL ni de Campus. El bloque sine-wave se descartó y se retiraron sus archivos de exploración; constellation-hub queda como referencia de composición de mapas. Las referencias Watermelon se descargaron al proyecto para inspección; se adaptan sus patrones de agrupación, expansión y estados al reloj GSAP existente, sin añadir React/Motion/Tailwind al deck.

Find Skills: búsqueda de animated diagrams y motion graphics, revisión de catálogo y repositorio. Se instaló `supermemoryai/skills` → `svg-animations` en `~/.agents/skills/svg-animations`. Se aplican grupos SVG, curvas Bézier, máscaras y trazado; sus ejemplos SMIL/CSS autónomos se traducen a la timeline determinista de HyperFrames. No se sustituye el motor ni se instala Manim para esta corrección.

## Semántica visual: errores, mitos y funciones

Se revisó SCRIPT-CAPSULA.md para asignar estados por significado. Las tres malas prácticas de la escena 3 usan fondo rojo oscuro #432333, borde #dc8591, texto #ffe4e8 y etiqueta Evitar. En la escena 11, la descripción demasiado amplia tiene el mismo tratamiento y la alternativa lleva Recomendado en azul. En la escena 24, Sí activa revisión se contrapone a No activa esta skill: esta última conserva un estado neutral, porque una consulta conceptual válida no es un error.

Cinco escenas muestran la afirmación falsa con la etiqueta inequívoca Mito descartado: entrenar un modelo al abrir otro chat, una skill autónoma, diseñar como entrenamiento de pesos, instrucciones como barrera técnica y ajustes de instrucciones como fine-tuning. El texto principal correcto mantiene su color normal. El color nunca es la única señal.

Iconos Tabler Outline, misma familia que Shell y Tasks de Campus. SVG locales con licencia MIT en assets/icons. La asignación editorial de los 85 iconos y los estados se conserva en presentation/card-semantics.json: conversación/hilo, robot/agente, libro/skill, herramienta/capacidades, engranaje/configuración, lupa/investigación, escudo/seguridad, tubos/pruebas, bifurcación/delegación, fusión/integración, lista/proceso, archivo comprobado/evidencia y llave/acceso. Los iconos son decorativos para accesibilidad porque los títulos describen su significado; aparecen junto con la tarjeta, sin añadir movimiento repetitivo.

## Portada y cierre del módulo

Introducción de 14.5 s con Kokoro em_alex, idioma español, velocidad 1.0 y nivel de voz objetivo -18 LUFS; agenda de cuatro puntos guiada por Whisper sobre la nueva toma: qué son y qué no son, elección de recursos, errores/mitos, buenas prácticas. La portada usa logo oficial, tipos y fondo existentes. La cápsula original entra a 14.5 s y conserva sus tiempos locales y audio narrado.

La primera escena interna se corrigió para que «entrenar un modelo», «un gran prompt» y «llenar de reglas» aparezcan a 5.26, 6.43 y 7.68 s locales, tomadas de Whisper, en vez del contraste agente/skill que no correspondía a esa frase. Sus tres tarjetas se identifican como suposiciones.

Cierre de 9 s después del fin de la cápsula, solo música, logo oficial, Consultas, asmartsolution.com.mx y +52 (442) 376-2185. Dominio confirmado expresamente por el usuario; teléfono de Campus/components/codex/Landing.tsx. Sin correo ni iconos/enlaces de redes. El espacio inferior queda libre para redes futuras. La tarjeta sostiene hasta el segundo 8 y se funde a negro durante el último segundo; la música termina con un fundido de 2.5 s. La vista de lectura muestra el contacto antes del fundido para no presentar una tarjeta negra al seleccionarla desde el índice.

Configuración reutilizable de esta pieza: presentation/module-config.json. Fuente de las dos escenas: presentation/covers.py, llamada desde build.py. Duración total 428.812 s, 31 escenas. El resto del contenido mantiene IDs estables y recibe un desplazamiento global de 14.5 s. El controlador web obtiene duración y número de escenas desde los datos, sin constantes de 6:45.
