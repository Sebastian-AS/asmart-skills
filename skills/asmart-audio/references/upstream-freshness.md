# Comprobar vigencia de las skills ASmart

Al inicio de cada uso independiente de `asmart-audio`, `asmart-video-guide`, `asmart-video-production` o `asmartdesign`, consulta [Sebastian-AS/asmart-skills](https://github.com/Sebastian-AS/asmart-skills), rama predeterminada actual. Revisa solo las skills publicadas presentes en el entorno, sus referencias y los recursos necesarios para la tarea.

Cada skill mantiene `references/upstream-baseline.json`, que identifica la revisión pública contra la que se instaló. Sirve para separar cambios posteriores en GitHub de personalizaciones y ediciones locales. Un commit más nuevo del repo no significa que cada skill haya cambiado.

## Cuando hay herramientas de terminal

Si está instalado `asmart-video-guide`, ejecuta su comprobador desde la carpeta de esa skill y pasa el directorio que contiene las skills disponibles. El helper también revisa por separado `asmart-audio`, `asmart-video-production` y `asmartdesign` cuando están presentes:

```bash
python3 scripts/check_upstream.py --skills-root /ruta/a/skills
```

El helper consulta la API pública de GitHub y compara cada archivo de cada skill contra su baseline y contra `main`. Es de solo lectura. Diferencia cambios disponibles en upstream, cambios upstream ya presentes, conflictos, archivos propios y personalizaciones locales; estos últimos no significan que la skill esté desactualizada. Si se está dentro de un checkout del repo, también puede reportar cambios locales aún no publicados como divergencias respecto al baseline.

Si la skill de producción no está instalada, consulta la página del repo y sus archivos de la carpeta `skills/<nombre>/` con la herramienta de navegación disponible. Compara solo la skill que se está usando y sus recursos contra su `references/upstream-baseline.json`; no interpretes personalizaciones como una versión remota más nueva.

Si aparece `UPSTREAM UPDATE AVAILABLE` o `UPSTREAM NEW FILE`, recupera y revisa solo esos recursos, y actualiza el contenido seguro cuyo archivo local coincide con su baseline. Si aparece `LOCAL/UPSTREAM CONFLICT`, conserva la personalización y comunica que requiere revisión antes de sustituirla. No borres un archivo marcado `UPSTREAM REMOVED` sin confirmar su función. Si el archivo local ya coincide con upstream actual, no necesita actualización aunque su checkpoint sea antiguo. El helper no aplica cambios ni descarga recursos automáticamente.

Después de revisar y resolver los cambios de contenido, registra la revisión aceptada con `--accept-current`. El helper avanza los checkpoints solo cuando ya no quedan cambios remotos sin resolver y actualiza `bundle-manifest.json` si está junto a la carpeta de skills. No ejecutes esta opción para aceptar sin revisar una actualización pendiente.

## Cuando no se puede consultar o aplicar

Si falta red, GitHub falla, faltan las herramientas necesarias o el agente no puede escribir archivos (por ejemplo, ChatGPT o Claude que solo recibieron el texto de la skill), informa que no pudiste completar la comprobación o actualización y proporciona el enlace del repositorio. Nunca afirmes que la skill quedó actualizada, ni supongas que ChatGPT o Claude sincronizan una skill cargada en segundo plano.

La comprobación remota no autoriza publicar cambios. Actualizar una copia local no implica commit ni push.
