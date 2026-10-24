# Element library

## Primary: Campus capture

See [Campus site and component map](campus-site.md). `assets/campus/` preserves the current public site, header, workspace, manuals, editors, tasks, account and controls with their original relative paths. Prefer this capture for current behavior and geometry. [Import inventory](campus-imports.json) lists product bindings and package imports to inspect before reuse. These sources include product-connected components as reference material; they are not an executable drop-in library.

## Secondary: harness capture

All paths below are relative to `assets/source/`. CSS files are original references with page-scoped selectors and dependency assumptions. Read the relevant rules and adapt them into the target.

## Shared styles and page treatments

- `css/globals.css`: palette, shared header, navigation, buttons, mobile states, and base styles. Its font defaults are older; follow visual-identity.md.
- `css/landing.css`, `css/landing-axis.css`: dark hero, layered content, title treatment, entrance and section motion.
- `css/login.css`: transparent column form and floating-input treatment on the dark field.
- `css/esfera.css`, `css/lobby-base.css`, `css/account.css`: lobby composition and account navigation.
- `css/manual-reader.css`: fixed index, light reading sheet, document scrolling, responsive column behavior.
- `css/swim-lane-mapper.css`, `css/swim-lane-view.css`, `css/tareas.css`: process tools, diagram and working-area references.
- `css/admin-widgets.css`: disclosure widgets and profile editor treatment.
- `css/shared-expand.css`: expandable controls and states.
- Remaining CSS files provide additional source treatments; consult the manifest when a specific page needs them.

## Visual JavaScript

Inspect globals, mount calls, required element IDs, and DOM queries before use.

- `js/constellation-field.js` with `js/landing-layer.js`: neural hero engine and its tuned preset.
- `js/landing-text.js`: title splitting and text effects. `js/landing-axis.js`: section interaction. Both assume the original landing markup.
- `js/line-ripple.js` with `js/login-ripple.js`: `LineRipple.mount(element, options)` and the quiet login preset. The engine exposes update/destroy behavior; prefer explicit mounting and cleanup in a new app.
- `js/topology-field.js` with `js/lobby-sphere.js`: `TopologyField.mount(element, options)` and the lobby preset. The engine includes page visibility and view handling.
- `js/shared-expand.js`: expansion behavior for its matching CSS and markup.

The preset bootstraps target IDs such as `login-ripple` and `lobby-sphere`. Retarget them, extract their configuration, or mount the engines explicitly. Keep event listeners and animation frames under the target view's lifecycle.

## Adapted Watermelon components

- `components/login/FloatingInput.tsx`, `SaveToggle.tsx`: floating label and save-button states and feedback; associated styling is in `css/login.css`.
- `components/watermelon/discrete-tabs.tsx` and `.css`: animated selection and hover preview.
- `components/watermelon/editable-chip.tsx` and `.css`: compact editable value.
- `components/watermelon/macos-sidebar.tsx` and `.css`: collapsible navigation.
- `components/watermelon/morphing-discovery-bar.tsx` and `.css`: expanding discovery/search control.
- `components/watermelon/pin-item.tsx` and `.css`: pin interaction.
- `components/admin/TaskWidgetDisclosure.tsx`, `EditProfile.tsx`, `icons.tsx`: task disclosure and profile dialog; style with `css/admin-widgets.css`.
- `components/manual/manual-watermelon.css`: integration styling for the manual's combined controls.
- `lib/cn.ts`: class-name helper used by some components. Adjust its import alias to the target.

React components may import `motion/react`, local icons, or helper aliases. Inspect each file's imports before copying. Replace source-specific text such as the profile editor's D1 hint with truthful target copy. Connect callbacks to the target's existing logic. Retain accessible labels and verify focus, dismissal, and controlled values instead of assuming a source component is complete for every use case.

Quick Switcher was discussed in the Watermelon shortlist but is not saved in this library. Use the Watermelon skill if available to fetch a missing pattern. Existing adapted elements are the first choice.

## Provenance

The snapshot captures the user's ASmartSolution adaptations, including Watermelon-derived components and Originkit-derived Line Ripple. Preserve existing attribution comments. Before distributing a borrowed component as a separate public library, consult its original license and include the applicable notice. This skill does not assert ownership of third-party source.
