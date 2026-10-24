# Cursos como contenido de Campus

Solicitud del usuario, 16 de octubre de 2026: los cursos se producen fuera de Campus, pero se consumirán y venderán dentro de la misma plataforma multi-tenant. El kit de autoría es una herramienta de ese producto; no crea otro sistema de cuentas. Siempre usar fuentes SVG para los logos ASmartSolution.

## Repositorio y variantes observadas

Repositorio común: https://github.com/Sebastian-AS/platform-AS-Solution . Se inspeccionaron dos checkouts sin modificar su código:

- Rama `codex/brain-campus-migration`, commit `49ea822f6c95ace7a7dfb5ab521bf2c4dcf752e2`, subdirectorio `Workshop/Campus/`. Base de la identidad y los componentes usados en la colección. Next15/React19, Cloudflare/D1. `lib/auth.ts` define admin/client, sesión de cookie y client_slug. `lib/manual-api.ts` comprueba cliente o admin; `app/api/auth/me/route.ts` entrega la cuenta. `components/codex/Shell.tsx` y RestoredHeader.tsx componen el área privada. Es la base que indica campus-tool-workflow.
- Rama `main`, commit `c31dc364b43b61605e4ee3481a6b92d8afd914bc`, subdirectorio `V2/`. Otro checkout, con cambios locales no publicados que no se deben mezclar automáticamente. `supabase/migrations/20250525000000_initial_schema.sql` define empresas, perfiles, roles, proyectos, módulos y project_access con RLS. `lib/data/deliverableAccess.ts` verifica acceso a entregables; su modo sin Supabase deja pasar, por lo que no debe interpretarse como protección de cursos comerciales en una preview.

Estas variantes no tienen la misma sesión ni el mismo modelo de datos. Descubrir el checkout/ref del proyecto objetivo, leer su estado y aplicar sus componentes activos. No conectar los endpoints de una variante con el cliente de otra ni decidir una migración de autenticación como efecto lateral de crear un curso. Los commits son evidencia de esta revisión, no orden de fijar Campus para siempre a ellos.

No se encontraron entidades específicas de compra/matrícula/derecho de acceso a cursos en los archivos y migraciones inspeccionados. Esto no afirma que no existan en ramas o servicios no inspeccionados.

## Contrato propuesto para integrar cursos

Autoría produce un paquete versionado con course_id, revision, objetivos, público/requisitos, módulos/escenas, fuentes, medios, subtítulos y huellas. Sus rutas son relativas a una raíz del curso configurable; no incluyen tenants, cookies ni secretos. El manifiesto de curso controla títulos, categorías, destacados, materiales y copy de landing. Usar el mismo renderer para escenas web y MP4.

Campus mantiene catálogo/producto y derechos por usuario/organización. Una compra, asignación corporativa o matrícula concede acceso con estado y, cuando corresponda, vigencia; una sesión iniciada por sí sola no lo concede. El curso compartido no necesita duplicarse por cliente: el servidor decide quién puede consumir cada revisión y sus recursos.

Reutilizar sesión, header, menú de cuenta y navegación de Campus. La preview aislada puede usar el adaptador ASmartAccount para mostrar cuenta; ese adaptador es de interfaz, no una barrera de autorización. Integrar el host real sin duplicar login.

Las páginas privadas, audios, videos y descargas deben aplicar el mismo derecho en servidor/almacenamiento, también al pedir una URL directamente o un rango de bytes. No copiar medios de venta a public/ ni protegerlos solo escondiendo botones. Separar un tráiler o muestra pública de los medios con derecho de acceso. Al desplegar, verificar permisos cruzados entre tenants, ausencia de derecho, revocación y rangos; no declarar esto implementado por generar el paquete estático.

## Próximos pasos concretos

1. Mantener el kit en tooling/course-authoring dentro del repo existente; cerrar manifiesto/API genérica y prueba portable con otro tema.
2. Confirmar la rama que recibirá cursos antes de editar su modelo de cuenta/tenant; resolver la coexistencia de variantes como trabajo de Campus.
3. Implementar allí catálogo de cursos y derechos, conectados al proveedor de compra/asignación que se adopte. Aún no hay uno elegido ni autorización de cargos/despliegue.
4. Montar reproductor y recursos bajo rutas de Campus, reutilizando sesión y chrome. Conservar el diseño actual y el logo SVG.
5. Verificar con cuentas de prueba y acceso directo a medios antes de habilitar venta. Publicar solo con autorización.
