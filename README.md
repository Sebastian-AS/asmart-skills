# ASmartSolution · Skills compartidas

Fuente mantenida de identidad visual, presentaciones y coordinación de video. Una misma base de instrucciones y recursos; el empaquetado del plugin permite descubrirla en Claude. No contiene la aplicación Campus ni los trabajos de sus clientes.

## Claude chat

En Customize > Plugins > Add > Add marketplace, introducir `https://github.com/Sebastian-AS/asmart-skills` y añadir **ASmart Creative**. Para contenido visual invocar ASmartDesign; para cápsulas/video, asmart-video-guide. No pegar solamente una URL en un chat suponiendo que instala todas las referencias.

Los planes de pago admiten plugins. La adición personal desde un repositorio está documentada, pero la actualización automática entre cuentas personales queda pendiente de verificar. La distribución administrada y sincronizada desde GitHub en Team/Enterprise requiere un repositorio privado/interno y configuración del propietario. Una copia ZIP no se sincroniza por sí misma.

Fuentes oficiales consultadas el 24 de octubre de 2026: [Uso de plugins](https://support.claude.com/en/articles/13837440-use-plugins-in-claude), [Distribución administrada](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization).

## Comprobaciones de la primera publicación

Cuatro skills instaladas en un directorio vacío con el bootstrap en modo solo incluidas; hashes de las fuentes visuales verificados; nueve ejemplos generados por la biblioteca. Manifiestos JSON y referencias directas de las entradas comprobados. No se ha probado la instalación ni actualización en una cuenta receptora de Claude, ni se ha renderizado un video como parte de esta publicación.

## Contenido y límites

Incluye cuatro skills propias y la biblioteca visual reutilizable. HyperFrames y otros especialistas se resuelven por el bootstrap existente y sus commits fijados; no son un servicio de render ni transfieren credenciales. El runtime de video/audio y los modelos de voz deben comprobarse en el entorno receptor. La biblioteca derivada conserva su estado de revisión y no representa una aprobación universal de diseño.

Se excluyen los componentes React capturados de cuentas/clientes y los datos de esos ejemplos. Algunas referencias históricas conservan nombres de archivos ausentes como procedencia; no son imports disponibles. Los manifiestos describen exclusivamente los recursos efectivamente incluidos. Los logos son SVG.

## Mantenimiento

Editar las skills en este repositorio una vez adoptado como fuente de distribución. Incrementar la versión del plugin y de su entrada en el marketplace al publicar cambios. Revisar los cambios y probar la instalación del destinatario. No mantener una segunda traducción manual por herramienta: cualquier adaptación futura debe limitarse al empaquetado y a capacidades reales del entorno.

## Derechos

Publicar el repositorio no concede una licencia abierta de la marca. Los recursos de terceros conservan sus propias condiciones y avisos. Ver THIRD_PARTY_NOTICES.md.
