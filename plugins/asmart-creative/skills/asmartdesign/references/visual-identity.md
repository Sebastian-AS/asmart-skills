# Visual identity

## Current source priority — Campus, 15 October 2026

The current site is captured under `assets/campus/`. Read campus-site.md before selecting a header, sidebar or manual layout. The active manual uses ManualPage → Screen + ManualWatermelon and Workspace.Header; `components/codex/Manual.tsx` is a separate implementation and is not proof of the `/manual` route.

Campus has two intentional scopes: base `--cx-navy: #183753`, `--cx-blue: #295dcb`, cloud `#f3f6fa`, steel `#526579`, mist `#dce4ed`; restored manual/controls use ink `#1a365d`, action `#4a6fc1`, field `#070914`, pale `#a8c0ef` and paper `#f8fafc`. Preserve semantic scope and computed cascade instead of merging both sets into one guessed palette. Outfit and Source Sans 3 remain authoritative.

The full `app/codex.css` contains later overrides: white header logo on dark background, sticky header bounded by the landing hero, dark link/logo swap over a light field, and transparent workspace header. Do not read its early declarations as the final design. Manual CSS also ends with fixed-sheet/overlay-index and shared-header corrections; they take precedence over its earlier grid.

## Palette and type

- Primary navy: `#1a365d`; deeper navy: `#0f1f38`; secondary: `#2d4a7a`.
- Action blue: `#4a6fc1`; pale blue for field details: `#a8c0ef`.
- Background for neural and topology fields: `#070914`.
- Light sheet and text on dark fields: `#f8fafc`; light borders: `#e2e8f0`.
- Text on light sheets: `#1e293b`; secondary text: `#64748b`; muted on dark fields: `#94a3b8`.
- Outfit for headings and display type. Source Sans 3 for body, navigation, and buttons. System monospace for code.

These choices come from Workshop/design-system/MASTER.md, its page specs, and the later landing/login CSS. The Open Sans and Montserrat declarations in globals.css are older defaults. Override them in adopted styles. Use semantic variable names in the target rather than pasting conflicting `:root` declarations from every source file.

The older harness loads fonts through Google Fonts and icons through Font Awesome 6. The active Campus manual and approved web video player use Tabler SVG icons; preserve that family when porting their controls. Fonts and icons are not bundled here. For offline output, use locally available, properly licensed font files or an explicit local fallback. Keep the fallback practical, such as Segoe UI or Arial, rather than adding a network requirement.

## Composition and elements

The identity combines deep navy fields, restrained blue actions, fine borders, deliberate typography, and light document sheets. Login is a left-aligned column directly on a Line Ripple field. Manuals pair a navigation column with a light sheet. Product tools prioritize their working area. Preserve those relationships when borrowing layouts.

Use the component's actual CSS for its geometry. The base brand uses 4px buttons, but the adapted Watermelon pills, tabs, chips, and rounded panels have their own intentional shapes. Do not force every element to one radius. Keep white reading areas large enough for dense material, tables, diagrams, and code.

Avoid neon, purple glow, stacked glass panels, generic three-card layouts, and decorative emoji icons. Reuse existing SVGs or the target's icon family consistently.

## Motion

- Marketing and course-library entrances can use neural drift, restrained title entry, or a blue color sweep.
- Line Ripple is the quieter field used for login and focused introductions.
- TopologyField is the shared dark lobby background.
- Tabs, chips, sidebars, pins, and disclosure widgets communicate selected, open, and edited states.
- Teaching diagrams advance under instructor control. Continuous ambient motion should be optional and quiet during teaching.

Use one background effect per view. Keep it behind readable content. Preserve reduced-motion support, tune density for mobile, disable pointer attraction for coarse pointers, and pause or dispose animations when their view is hidden or removed. Inspect source lifecycle code; the page bootstraps are examples and do not all provide SPA cleanup.

## Useful starting tokens

```css
:root {
  --as-primary: #1a365d;
  --as-primary-dark: #0f1f38;
  --as-secondary: #2d4a7a;
  --as-accent: #4a6fc1;
  --as-field: #070914;
  --as-paper: #f8fafc;
  --as-ink: #1e293b;
  --as-muted: #64748b;
  --as-line: #e2e8f0;
  --as-font-display: "Outfit", "Segoe UI", Arial, sans-serif;
  --as-font-body: "Source Sans 3", "Segoe UI", Arial, sans-serif;
}
```

Map these to the target's existing variables and check contrast for each actual foreground/background pair. The palette alone does not guarantee every pairing is accessible.

For semantic red cards, varied explanatory layouts and approved web player controls, read [web presentations](web-presentations.md).
