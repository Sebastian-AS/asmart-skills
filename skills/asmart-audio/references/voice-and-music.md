# Voz y música de fondo

Leer media-use y sus referencias aplicables para la integración técnica. Esta referencia fija las decisiones del flujo del usuario, no copia comandos cuyo soporte pueda cambiar.

## Selección de voz

El usuario eligió Kokoro después de comparar muestras. Usar Kokoro local con `em_alex` como punto de partida y conservar audio aprobado; para voz nueva, priorizar naturalidad en español, acento adecuado, intención docente, pausas, pronunciación de términos técnicos y consistencia entre escenas.

Con el perfil Kokoro em_alex ya elegido no reabrir una comparación de proveedores ni pedir al usuario aprobar la misma voz en cada módulo. El productor comprueba una muestra y continúa; solo consultar si aparece una preferencia nueva o un problema que no puede resolver.

Antes de generar una pieza completa, producir una muestra de 15–25 segundos con una frase explicativa, una pregunta y nombres técnicos del guion. Escuchar y comprobarla. Cuando la preferencia de timbre o actuación sea la incógnita real, pedir al usuario evaluar esa muestra; no trasladarle la dirección visual ni producir variantes completas. No afirmar superioridad de una voz sin haberla escuchado.

- **Kokoro local:** proveedor elegido para narración; comprobar la muestra para cada pieza; sin cargo por generación de un servicio. No confundir ahorro con calidad asegurada.
- **Proveedor externo:** OpenAI o ElevenLabs pueden evaluarse cuando el usuario acepte la facturación correspondiente. Verificar modelo vigente, voces, precio y derechos en fuentes oficiales antes de estimar o generar. No suponer que los tokens de ChatGPT pagan las llamadas API. Investigar costos no autoriza gastar.

Revisión de fuentes: 15 de octubre de 2026. La guía TTS de OpenAI describe control de acento, entonación, tono y velocidad, y recomienda marin/cedar; el catálogo marca gpt-4o-mini-tts como deprecated. Consultar la página de deprecaciones y el reemplazo vigente antes de elegirlo para un flujo nuevo. No fijar este modelo como dependencia estable ni inventar un precio por minuto cuando la tarifa consultada solo establece tokens.

Si el entorno expone una herramienta nativa de generación de audio, verificar que permite obtener un archivo utilizable, sus límites y su costo. La voz conversacional o leer una respuesta en voz alta no demuestra acceso a un generador de narración exportable. Sin esa herramienta, no prometer generación incluida en el chat.

Una vez elegida la voz, registrar proveedor, modelo, voz, instrucciones, velocidad y audio local. Transcribir con Whisper la toma final editada. Si cambian cortes, ritmo o velocidad, invalidar los tiempos afectados. No cambiar proveedor en una corrección puramente visual.

## Biblioteca de música: Mixkit

Mixkit es una biblioteca de pistas, no un sintetizador ni una skill independiente. Para este flujo, usarla como fuente explícita de música de fondo cuando el brief pida o admita música; respetar silencio o una pista aprobada.

1. Definir la función musical según la pieza: fondo instrumental discreto que acompañe el tono y deje espacio a la voz. Buscar en la biblioteca oficial; no fijar una pista universal ni usar un ID de ejemplo como selección automática.
2. Escuchar la candidata y comprobar que no contiene voces, golpes o cambios que distraigan del relato. Seleccionar una recomendación concreta; no exigir al usuario escoger entre un catálogo.
3. Verificar la licencia aplicable a la pista y al canal de entrega. No asumir uso irrestricto: la licencia de música de Mixkit enumera usos permitidos y restringidos. Conservar en el proyecto página de origen, título, autor cuando conste, URL/archivo de licencia y fecha de consulta.
4. Descargar mediante el mecanismo permitido por la fuente y guardar el archivo local como recurso del proyecto. Confirmar que se reproduce; no dejar una URL temporal como dependencia del render.
5. Integrar con hyperframes-audio. Ajustar duración mediante cortes o bucles musicales revisados, entrada y salida suaves, y atenuación bajo la voz. Revisar uniones, inicio y cierre. No acelerar o estirar la voz para adaptarla a una canción.
6. Escuchar la mezcla completa y comprobar niveles, saturación y comprensión en pasajes suaves y densos. Si hay correcciones solo visuales, preservar la mezcla aprobada. Entregar el stem musical y el de voz si forman parte del proyecto editable.

**Salida de la etapa:** archivo musical local reproducible, procedencia y licencia registradas, colocación en el timeline y mezcla escuchada. Una búsqueda o una mención de Mixkit no cumple la etapa. No generar música por API ni contratar un proveedor sustituto sin autorización.

## Fuentes para revalidar

- Mixkit, licencia de música: https://mixkit.co/license/modal/musicFree/
- OpenAI, guía de voz: https://developers.openai.com/api/docs/guides/text-to-speech
- OpenAI, deprecaciones: https://developers.openai.com/api/docs/deprecations
- ChatGPT, cuotas y facturación: https://learn.chatgpt.com/docs/pricing
- ElevenLabs, precios: https://elevenlabs.io/pricing
