# Project workflow

## Source selection

Read campus-site.md and use assets/campus for the current full site. Preserve source-specific cascade ordering: current app styles plus route-specific legacy styles plus component overrides. Do not graft the whole global stylesheet onto another product. Extract a scoped adaptation and record which source rules it preserves. Reuse index behavior (search, current selection, pins, collapse, mobile overlay) with the target content and state; do not copy customer books or Campus auth routes.

For video review shells, current Campus header/index/control patterns belong outside the rendered stage. Scene geometry and animation remain seek-safe and share the presentation source. For explanatory scenes, use separate consistent bubbles when relationships or movement matter, and reading sheets when lists/code need one stable surface. ASmartDesign does not require every scene to be the same white rectangle.

## React interfaces

Reuse an adapted component with its matching CSS. Align import aliases and peer dependencies with the target. The captured harness already uses `motion/react`; keep it when the target has Motion and the interaction benefits from spring or shared-layout behavior. Simple open, selected, hover, and focus states can use CSS. Choose dependencies based on the target rather than reproducing Workshop's setup.

Scope CSS to the adopted view to avoid leaking global resets and fixed headers. Mount visual engines in effects with cleanup. Keep current routes, form logic, data contracts, and access rules. A styling request does not require Workshop's backend.

## Navigable web video modules

Read [web presentations](web-presentations.md) for the approved player and scene language. The web platform is the primary deliverable for course capsules; share scene source with HyperFrames and ship compressed audio rather than WAV masters. Production and export requirements belong to asmart-video-guide and asmart-video-production. HTML/CSS/JavaScript is valid; do not introduce React solely to reuse a visual control.

## Curso IA and standalone HTML presentations

The original project is `<local-workspace>/Curso IA/Presentaciones`. Inspect it if available; do not assume the files are unchanged.

- `contenido/*.json` stores teaching content. `motor/estilos.css` contains shared presentation styles.
- `motor/presentador.js` renders slides, diagrams, simulators, questions, navigation, notes, and pointing tools.
- `motor/construir.mjs` generates self-contained HTML decks, the library index, references, and guide. Index-page CSS and markup also live in this builder.
- Restyle the shared sources and regenerate output. Editing only generated HTML loses changes on the next build.
- Preserve topic structure, instructor notes, sources, quiz feedback, simulator rules, fullscreen, keyboard navigation, and printable output.
- Translate a selected React interaction into HTML/CSS/JavaScript when needed. Use vanilla background engines directly. Keep fonts and assets local for offline delivery.
- Apply the blue/navy identity to the library, slide shell, controls, diagram states, and reading areas. Use backgrounds mainly on the library, covers, or section introductions, with optional static treatment for content-heavy slides.
- Verify projection at 1280 x 720, a larger desktop, and a narrow screen. Check overflow, text size, diagrams, keyboard focus, reduced motion, and an offline load. Hide decorative canvases in print styles.

The original course had green editorial styles, local fonts, and a ban on gradients. A user-authorized ASmartSolution restyle replaces its visual direction. Update that design guide accordingly while preserving offline operation and teaching readability.

## Supporting guidance and tools

ASmartSolution's elements remain the reference. Use available frontend-design and UI/UX skills for composition and usability, design-system for token organization, presentation skills for teaching layouts, and Unslop for clear copy. These are optional helpers, not dependencies required to load this skill.

The Tools chat established this resource order: existing Watermelon adaptations first; Refero for a specific product flow; Component Gallery for a missing interaction; Transitions.dev for purposeful state motion; Penpot for a broader design artifact when a connection is available. Deck.gallery is relevant to presentation layout. General landing galleries are occasional inspiration. These resources are leads from that discussion, not a requirement to browse or install them. Verify current information when actually consulting them.

Write specific interface copy. Remove slogans and filler. Use the target's actual actions, labels, and states. Do not copy marketing text into a course simulator.

## Finish the requested change

Use the adopted elements in the actual target and verify its working interactions. Check focus visibility, readable contrast, mobile reflow, reduced motion, and animation cleanup. Run the target's normal build when appropriate. Report which elements were reused and any remaining font or dependency limitation. Creating this skill alone does not restyle another project.
