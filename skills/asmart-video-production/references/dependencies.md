# Dependencias y prioridades

## Qué se acordó y qué significa

El chat «Elegir modelo para video de curso (4)» documentó el uso de ASmartDesign y HyperFrames; la solicitud y ejecución de Kokoro y Whisper; música de Mixkit; y la instalación y prueba de Howseen Motion Design y Review Animations. El usuario reafirmó ese stack al encargar esta skill. Son decisiones del flujo, no pruebas de que los ejecutables sigan operativos.

Kokoro y Whisper son herramientas, no nombres de skills independientes que deban inventarse. media-use ofrece procedimientos de integración. HyperFrames carga sus dominios técnicos. Las dependencias se leen desde sus instalaciones vigentes, no desde copias de sus instrucciones dentro de esta skill.

Marketing, copywriting, teach, grilling y doc-coauthoring se propusieron en el chat, pero no quedaron instaladas ni adoptadas como dependencias obligatorias. No tratar cifras de popularidad o recomendaciones como consentimiento. frontend-design puede apoyar una implementación cuando corresponda; no redefine la marca. find-skills descubre capacidades, no dirige el video.

## Resolver conflictos antes de producir

- **ASmartDesign y otras estéticas:** manda ASmartDesign. Leer las fuentes actuales para obtener tokens, geometría y componentes. Outfit para títulos y Source Sans 3 para cuerpo son las familias acordadas; comprobar la carga efectiva. Las plantillas y demos de otras skills no sustituyen estos recursos. Una variación de marca exige una instrucción del usuario.
- **Motion Design y HyperFrames:** tomar continuidad de objetos, cámara, composición, crítica y movimiento con propósito de Motion Design. Conservar la estructura, timeline, medios, preview y render de HyperFrames. No copiar rutas de Howseen, su paleta, su obligación de movimiento cada segundo, sus renders paralelos ni sus propuestas múltiples. Las pausas de comprensión siguen siendo válidas.
- **Review Animations y cine:** pedir una revisión concreta de los archivos de movimiento. Aplicar propósito, continuidad, origen, cohesión y rendimiento. Sus presupuestos de milisegundos para interfaces interactivas no fijan cuánto debe durar una explicación cinematográfica; documentar la distinción cuando sea pertinente. No usar esto para descartar fallos reales de movimiento. Su revisión de código no sustituye ver y escuchar el resultado.
- **media-use y proveedores:** seleccionar explícitamente la voz acordada y Whisper; Kokoro es el proveedor local elegido; conservarlo salvo nueva indicación del usuario. Consultar la skill independiente asmart-audio para selección de voz y Mixkit para fondo musical; references/audio.md solo enlaza esa integración. Su proveedor predeterminado puede ser HeyGen y su transcripción predeterminada Parakeet: no asumir que ejecutar el comando sin opciones respeta este flujo. Inspeccionar ayuda y referencias instaladas para elegir el proveedor acordado. No confundir las cuotas de ChatGPT con facturación API ni suponer una herramienta nativa de voz que el entorno no expone. Si el wrapper no lo admite, usar una integración local comprobada de la misma herramienta, con sus rutas y comando en el proyecto. No inventar flags.
- **ASmartDesign y determinismo:** adaptar sus efectos al reloj seekable de HyperFrames; no introducir bucles ambientales en tiempo real que produzcan resultados distintos entre preview y render.

## Ausencias y cambios

Resolver primero instalaciones existentes y recursos del proyecto. Cuando falte una dependencia requerida, usar find-skills para localizar su fuente si es necesario, verificar sus instrucciones y proceder solo dentro de la autorización de instalación existente. No instalar un catálogo completo ni actualizar todas las skills por rutina.

Una dependencia ausente bloquea su etapa, no concede permiso para diseñar de otra manera o cambiar el proveedor. Continuar tareas independientes y comunicar la carencia concreta. Si se necesita otra herramienta, presentar la sustitución y su efecto para decisión del usuario antes del trabajo dependiente.

No hay selección forzada de modelo en este archivo. Cambiar el modelo no elimina las condiciones de salida ni autoriza omitir dependencias. No afirmar que un SKILL.md puede impedir técnicamente que otro modelo incumpla estas instrucciones.
