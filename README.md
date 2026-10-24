# ASmartSolution skills

Skills de diseño visual, producción audiovisual y creación de módulos web de aprendizaje para ASmartSolution. Cada skill usa el formato abierto `SKILL.md` y puede instalarse en herramientas de agentes compatibles.

Instalación con [skills.sh](https://skills.sh):

```bash
npx skills add Sebastian-AS/asmart-skills
```

Instalación selectiva:

```bash
npx skills add Sebastian-AS/asmart-skills --skill asmartdesign
npx skills add Sebastian-AS/asmart-skills --skill asmart-video-guide
```

## Skills

- **asmart-video-guide**: coordina investigación, guion, diseño, producción y revisión de cápsulas, tutoriales, módulos web navegables y recorridos de producto.
- **asmartdesign**: aplica la identidad visual, componentes, efectos y biblioteca reutilizable de ASmartSolution a sitios, interfaces y presentaciones web.
- **asmart-video-production**: dirige la producción y revisión audiovisual con ASmartDesign, HyperFrames, voz, transcripción, música y control de movimiento.
- **asmart-audio**: resuelve voz, transcripción y música de fondo para piezas ASmartSolution.

Las skills aportan instrucciones y recursos visuales; las herramientas externas, modelos, medios, credenciales y runtimes se resuelven según el entorno. Ver las referencias de cada skill para sus requisitos. El contenido no implementa autenticación, pagos ni servicios de Campus.

## Actualización

```bash
npx skills update
```

Para instalar o refrescar desde el estado más reciente del repositorio, ejecutar de nuevo `npx skills add Sebastian-AS/asmart-skills`.

## Derechos

La publicación no otorga una licencia abierta general de la marca ASmartSolution. Los recursos de terceros conservan sus propios avisos y condiciones en `THIRD_PARTY_NOTICES.md` y junto a sus archivos.
