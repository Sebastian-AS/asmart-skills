---
name: asmart-audio
description: Coordinar voz en español, transcripción y música de fondo para piezas ASmartSolution o pruebas de audio independientes, reutilizando media-use, herramientas TTS y HyperFrames Audio.
---

# Audio ASmartSolution

Módulo independiente de integración. Usarlo sin exigir un proyecto de video para una muestra de voz, una narración, una transcripción o una selección musical. No implementa motores propios de síntesis, reconocimiento ni mezcla.

## Dependencias y ejecución

1. Leer `media-use` y las referencias de audio/proveedores pertinentes. Para mezcla dentro de una composición, leer `hyperframes-audio`; no exigir HyperFrames para generar un WAV independiente. Usar `find-skills` solo si falta una capacidad real y verificar la fuente antes de instalarla.
2. Leer [voz y música](references/voice-and-music.md) para seleccionar proveedor, comprobar calidad, resolver la pista Mixkit y registrar derechos. Las preferencias del usuario prevalecen sobre proveedores predeterminados de dependencias.
3. Reutilizar entornos y herramientas existentes; instalar dependencias faltantes en un entorno aislado cuando el encargo lo autorice. Una instalación anterior no prueba que funcione ahora. Registrar modelo, versión, voz, idioma, instrucciones y comandos efectivos junto a la entrega.
4. Kokoro es el generador local de voz elegido por el usuario. Usar em_alex como voz de partida, salvo que el usuario elija otra voz de Kokoro. No imponer una voz ni declarar naturalidad sin escucharla. No usar API de pago sin autorización. No confundir tokens de conversación con costos de generación externa.
5. Whisper produce tiempos sobre la toma final cuando se necesitan transcripción/subtítulos o cues. Una muestra breve de comparación no necesita transcripción si no es parte del encargo. Mixkit es biblioteca de música; comprobar licencia, guardar archivos locales y procedencia antes de mezclar.

## Comparaciones breves de voz

Usar el mismo texto, idioma e intención, preferentemente 15–25 segundos, con una explicación, pregunta y términos técnicos. Conservar los originales y producir copias de escucha a nivel comparable sin alterar el ritmo para fingir similitud. Identificar modelo y voz reales en cada muestra.

Generar archivos reproducibles, comprobar duración, muestras finitas, nivel y ausencia de recorte. Escuchar cuando el entorno permita inspección auditiva; si no, indicar que la revisión fue técnica y dejar al usuario evaluar naturalidad. No afirmar una comparación auditiva no realizada. No añadir música a pruebas de timbre salvo petición, para no enmascarar diferencias.

## Entrega

Entregar archivos de audio y el registro de generación; transcripción, subtítulos y stems solo cuando correspondan. Informar proveedor, voz y cualquier limitación material. Aplicar esta skill no autoriza publicación ni envío a terceros.
