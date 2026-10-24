---
name: asmartdesign
description: Reuse ASmartSolution's modern visual identity, CSS, JavaScript effects, and adapted Watermelon components in other projects. Use when the user invokes ASmartDesign, asks for the ASmartSolution look, or wants its elements applied to interfaces or HTML presentations such as Curso IA.
---

# ASmartDesign

ASmartSolution logos must use their official SVG source, preserving proportions. Do not substitute a PNG/JPEG logo in HTML, components or editable compositions. Raster previews, posters and rendered video may contain the rasterized result of that SVG. Course production belongs to Campus; use the single asmart-video-guide entry and its portable/Campus contracts for installation and integration.

Make the target project feel like ASmartSolution by reusing its actual elements. Preserve the target's content, functions, and format. The bundled CSS, visual JavaScript, and React components are a source library. The primary capture is Workshop/Campus (15 October 2026), covering the public site and workspace. The older Workshop/harness capture remains a secondary source.

## Course product library

For course capsules, navigable presentations and their catalogue, read [the executable learning-product library](references/learning-product-library.md) before designing. Start from `assets/learning-product/v1/`: approved geometry, maps, semantic icons, choreography, player and Campus-derived catalogue. Build its gallery and reuse the renderer/components; do not rewrite a simpler parallel card generator. Keep the reference snapshots intact and verify adaptations against them. This is product-specific reuse, not a fixed layout for every ASmartSolution page.

## Apply the identity

1. Inspect the target's design guide, framework, entry points, and shared styles. Identify the requested screens and the ASmartSolution elements that fit them.
2. Read [Campus site and component map](references/campus-site.md) for the current page composition, source priority, import requirements and observed-versus-source verification. Select the relevant page family; do not imitate Campus from color tokens alone.
3. Read [visual identity](references/visual-identity.md). Use Outfit for headings and Source Sans 3 for body text, the navy and blue palette, dark interactive fields, and light reading sheets. Record the adopted identity in the target's existing design guide when restyling.
4. Read [element library](references/element-library.md), then inspect the relevant files in `assets/campus/` first. Use `assets/source/` only for patterns absent from the current capture or an explicitly requested older treatment. Reuse the existing shapes, proportions, states, and animation behavior before inventing replacements.
5. Port the selected elements into the target's own files. Adapt selectors, imports, DOM targets, callbacks, and lifecycle handling. Load each effect's dependencies in order. Do not import the entire CSS collection into one page.
6. For navigable presentations or course video players, read [web presentations](references/web-presentations.md): approved semantic cards, movement, Campus index and discreet video controls. Apply those requirements before borrowing a generic frontend template.
7. Apply [project workflow](references/project-workflow.md) for React apps or offline HTML presentations. Verify the relevant controls in a browser, with keyboard, small screens, and reduced motion.

Keep ASmartSolution as the primary visual reference. Other skills and catalogs help implement or refine this identity; their default palettes and demo layouts do not replace it. Use Spanish copy for Curso IA and ASmartSolution, and retain the target project's language elsewhere.

## Public distribution scope

This distribution includes visual CSS/JS, official SVG logos and the executable learning-product library. Captured React application/account/customer components are deliberately excluded. References to their original names describe provenance only; do not try to import absent TSX. Reuse the packaged presentation renderer, catalogue CSS and public visual effects. Real authentication and Campus integration require the separately authorized platform project.

## Source handling

The bundled originals are reference assets. Change copies in the target, leaving this library intact. [Source manifest](references/source-manifest.json) records the original paths and checksums. If the original project is accessible and the user wants its latest design, compare the relevant files before selecting a version. The skill works without that project or either prior chat.

Run `python3 scripts/verify_sources.py` after changing the library or manifest. Each captured file must match its recorded hash. Source TSX is not a drop-in component package: inspect imports and isolate presentation from authentication, API calls and customer data before porting.

Source files include older selectors and defaults. The identity reference explains which current choices take priority. The captured harness uses React, Next.js, plain CSS, and `motion/react`; older Watermelon notes claiming Motion is absent are stale. Do not add Tailwind or convert a standalone presentation into React just to use a control.

This skill authorizes design reuse only within the user's requested project scope. Account APIs, client records, authentication, Workers, and D1 logic are not bundled design elements. Brand logos and client images are not needed for the style; include them only when the target calls for that branding.
