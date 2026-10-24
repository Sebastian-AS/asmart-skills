# Campus: full-site design source

Primary capture: 15 October 2026, `Workshop/Campus`, Git commit recorded in source-manifest.json. The working tree is the captured evidence; the commit alone does not prove file identity. Hashes and source-relative paths cover 69 files under `assets/campus/`. The older `assets/source/` harness snapshot remains available for missing historical patterns, not as the default for current Campus.

## Select a page family

- **Public landing:** `components/codex/Landing.tsx`, `RestoredHeader.tsx`, `AnimatedBackground.tsx` and `app/codex.css`. A left-aligned headline and an interactive three-step workflow sit over the original constellation. The header is sticky within the hero boundary, changing logo/link contrast over light content. Service rows, founder story and contact/footer composition are in the same landing component. The design is the whole composition, not only its palette.
- **Login:** `components/login/LoginPage.tsx`, `LoginForm.tsx`, `FloatingInput.tsx`, `SaveToggle.tsx`, public login CSS, plus current app overrides. `components/codex/Auth.tsx` also contains an alternative Login and the active Account view; do not assume every exported component owns a route. Inputs, label focus/autofill, password visibility and submit states are product interactions to reconnect to the target's own logic.
- **Workspace/header/account:** `components/codex/Shell.tsx` and `RestoredHeader.tsx`; topology background from AnimatedBackground. White horizontal logo, transparent header, circular account trigger, dismissible glass panel, keyboard return and actual contextual actions. Account data, logout and `/api/auth/me` are Campus bindings: reuse presentation/state patterns, not those endpoints in another project.
- **Active manual `/manual`:** `components/manual/ManualPage.tsx` mounts Workspace.Header, Screen and ManualWatermelon. `screens/manual.json` in the source repository declares its route-specific CSS/script order and DOM hosts; customer data is not bundled. Read that source file when the repository is available, otherwise use the extracted contract below. `components/codex/Manual.tsx` is another reader, not the active `/manual` page.
- **Manual editing:** `components/manual/ManualStudio.tsx` and `app/manual/editar/studio.css`. Tiptap/editor persistence is product-specific. Treat layout/toolbar as references unless implementing the actual editor with its dependencies and data contract.
- **Tasks/account/admin/client workspace:** `components/codex/Tasks.tsx`, `Auth.tsx`, `Portal.tsx`, admin widget components and app styles. Preserve meaningful disclosure, loading/empty/error states and control shapes; no customer records, credentials, datasets or database code are part of this library.
- **Process workspace:** `components/process/ProcessWorkbench.tsx`, `components/projects/ProjectPicker.tsx` and matching CSS. These are full UI references with backend bindings, not standalone components. Consult only when the target has the corresponding work surface.
- **Reusable primitives:** `components/watermelon/` includes tabs, editable chips, sidebar, pins and discovery bar with matching CSS; login/admin controls and `lib/cn.ts` provide adjacent presentation primitives. Preserve original attribution comments.

## Active manual composition and cascade

The manual's legacy Screen hosts are `manual-sidebar-root` (index), `sheet` (reading content), `manual-tabs-root` (header actions), and `lobby-sphere` (background). Screen loads globals → login → lobby-base → esfera → account → swim-lane-view → manual-reader → propuesta CSS, then ManualWatermelon adds its component overrides. App codex.css provides the shared restored header. Do not reverse this order or copy only the first matching selector.

ManualWatermelon uses the `ManualUi` external store bridge; it is not a self-contained data provider. `getState/subscribe/actions` define selection, pins, search, focus mode, editing and index state. When adapting outside Campus, replace this bridge with target state and callbacks.

The index includes:

1. Heading and circular collapse button with `aria-expanded`.
2. Search toggle that opens a real text field; Escape closes it and no-results copy is explicit.
3. Todo/Anclado segmented control with a sliding selected indicator.
4. Saved items and per-row pin controls, current selection, number and label.
5. An independently scrolling nav inside a bounded panel; scroll never moves the entire reading surface.
6. Narrow-screen overlay/scrim and a reachable index opener. Collapse does not remove access to the content.

Current late overrides make the paper fixed while rails overlay its left edge. Main index width is `min(17.5rem,30vw)`, collapsed rail `4.15rem`; mobile is `min(320px,88vw)`. Index surface is `rgba(14,26,51,.88)`, with fine light border, 4px corners and glass blur. Do not substitute large padded rounded cards for its compact 44px navigation targets. Controls may be adapted for a presentation, but retain these relationships and functional states.

## Dependency boundaries

React 19, Next 15, `motion/react`, `@tabler/icons-react`, React DOM portals and selected Tiptap packages are declared by Campus package.json. Install only what the selected component needs. The import inventory `campus-imports.json` distinguishes aliases/local source references from packages; resolve every selected component's imports before using it.

Source TSX may import product services or call APIs. Keep it as evidence, extract a presentation-only adaptation, and connect only authorized target behavior. Do not copy API routes, auth libraries, session checks, customer datasets or configuration secrets. The snapshot intentionally excludes these. A visual adaptation does not establish working Campus business functionality.

For vanilla HTML, reproduce selected states with DOM/CSS/JS instead of converting the whole presentation to React. Use semantic buttons, focus-visible, accurate aria-current/pressed/expanded, Escape, outside-dismiss, 44px touch targets, reduced motion and local assets. Do not show inert account, download or edit controls just because the source has them.

## Backgrounds and branding

Use original ConstellationField, LineRipple or TopologyField engines from `public/js/` and the presets/lifecycle in AnimatedBackground.tsx. One quiet field per page, behind content. Honor fine/coarse pointer and reduced motion; destroy listeners, observers and frame loops on unmount. They run in real time: for renderable video, port the effect to the video's deterministic timeline or use a static treatment. Review-shell effects can stay outside the render stage.

Official horizontal and vertical white/navy SVG logos are bundled for explicitly ASmartSolution-branded targets. Retain their proportions and accessible labeling. Do not replace source font families with the older Montserrat/Open Sans declarations embedded in legacy styles. Source fonts are externally loaded in Campus; target offline fonts need local files with appropriate rights.

## Verification and refresh

The public landing and login were opened in a local browser on 15 October. The unauthenticated `/manual` request displayed the login gate; the authenticated index behavior above is verified from source, not from a completed signed-in browser walkthrough. Never report it as observed live until that occurs. Target adaptations must be tested on their own.

After a library refresh, run `python3 scripts/verify_sources.py` and skill validation. Preserve exact hashes of originals and distinguish generated adaptations from captured files. Compare current source when it is available; do not overwrite the library with minified output, node_modules, `.next`, customer material or secrets. Changes to a target never silently change these reference originals.
