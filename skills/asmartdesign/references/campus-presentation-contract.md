# Campus presentation content package

Use this contract when authoring a presentation that Campus will render in its shared presentation player. Campus owns the reusable player, slide navigation, menu, fullscreen and presenter mode. The package is slide content and visual styling only.

## Package shape

```json
{
  "schemaVersion": 1,
  "title": "Presentation title",
  "width": 1920,
  "height": 1080,
  "background": "neural",
  "styles": "/* optional presentation styles */",
  "slides": [
    {"id": "intro", "title": "Slide title", "html": "<div>Slide content</div>", "notes": "Optional presenter notes"}
  ]
}
```

Valid background values are `neural`, `ripple`, `particle-wave`, and `none`. Keep styles limited to the presentation and scope selectors to slide content where practical. Campus injects the shared presentation engine, fonts and selected background. `particle-wave` uses the shared quiet preset: reduced particle density, low brightness and slow motion; do not embed a second effect or its source in the package. Preserve the ASmartSolution mark as an official SVG; a data URI containing SVG source is acceptable for portable content.

## Content boundary and validation

- A package must have 1–80 slides, unique IDs matching `^[a-zA-Z0-9_-]{1,80}$`, a nonempty title up to 160 characters, and 1920×1080 dimensions.
- Each slide needs a nonempty title up to 160 characters; notes are at most 4,000 characters; slide HTML is at most 200,000 UTF-8 bytes; the complete serialized JSON package, including styles, is at most 6 MiB.
- Slide HTML contains only inner slide content. Do not add a player shell, navigation controls, player scripts, app shell, accounts, authentication, upload logic, per-user Worker, or R2 credentials.
- The renderer rejects `<script>`, `<iframe>`, `<object>`, `<embed>`, `<base>`, meta refresh, inline `on*` handlers, `javascript:` href/src, and external HTTP(S) image sources. Styles must be CSS only; `</style>` breakout, script markup, `@import`, and external `url()` resources are rejected. HTTPS links on slide content, such as a contact link, are allowed.
- Campus is responsible for storage and access control, including private R2 objects. A content package is not an authorization or storage implementation.
- A standalone HTML file is not a package. If HTML is explicitly needed as a transport wrapper, it is allowed only when it contains an `application/campus-presentation+json` script island with the package JSON; do not embed a duplicate player.

For existing ASmartDesign `source-sections.json` work, use `asmartdesign/scripts/export_campus_presentation.py` with the source design CSS. It strips HyperFrames timing attributes, the source footer/page counter and neural-background placeholder, retains section content, SVG and scene styles, and checks these limits and prohibited markup. Review a representative slide and the final slide contact details before delivery.
