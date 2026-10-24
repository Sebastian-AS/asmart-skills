# Instalación y entorno

Este repositorio contiene cuatro skills propias en formato Agent Skills y sus recursos de diseño. Se instalan desde GitHub con skills.sh (`npx skills add Sebastian-AS/asmart-skills`) o copiando las carpetas `skills/<nombre>` al directorio de skills del agente. Para seleccionar una skill, añadir `--skill <nombre>`.

El bootstrap local incluido conserva los commits fijados de dependencias públicas y puede instalar skills en agentes que acepten carpetas Agent Skills. Para ejecutar el flujo audiovisual, comprobar por separado Python, Git, Node.js, FFmpeg, HyperFrames, modelos y utilidades de audio disponibles en el entorno. La skill no instala modelos de voz ni concede acceso a Campus.

Las dependencias opcionales `unslop` y `campus-tool-workflow` se detectan en el entorno cuando están instaladas; si faltan, hacer la revisión editorial directamente y limitar la integración de Campus a las capacidades observables.

La biblioteca visual incluye fuentes, iconos, logo SVG, ejemplos y código reutilizable. Los manifiestos enumeran recursos distribuidos; los componentes React capturados de aplicación y ejemplos de clientes no forman parte del paquete. La revisión visual compartida conserva su estado de aprobación indicado en sus referencias.
