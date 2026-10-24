---
name: asmart-video-guide
description: Producir y revisar módulos web navegables y videos ASmartSolution, incluyendo cápsulas de curso, tutoriales, recorridos iniciales y recorridos verificados de plataforma.
---

# ASmartSolution video guides

## Single entry and portable setup

This is the single user-facing entry for ASmartSolution course authoring. Coordinate the specialist skills internally; the user does not need to invoke them separately or repeat saved preferences. For another computer/account, a missing dependency, or preparing a distributable installation, read [portable setup](references/portable-setup.md) and run `scripts/bootstrap.py`. `dependencies.lock.json` identifies bundled ASmart skills and pinned public sources. A reference alone does not install a skill. Verify installation results before using the dependency. Do not depend on previous chats, absolute user paths or the original course folder.

Courses are content products of Campus, including courses sold to account holders in its multi-tenant platform. For Campus integration, read [Campus course contract](references/campus-course-contract.md) and discover the configured repository/ref. Reuse its account/session and authorization; local preview is not a separate account platform. Do not treat login as proof of course entitlement or expose paid media as public static files. All ASmartSolution logo sources must be SVG; raster video/poster exports may naturally contain the rendered logo.

The installer and visual library do not by themselves implement a generic end-to-end course builder, billing or Campus integration. State those capabilities according to observed tests; see portable setup for the current release limits.

Deliver a truthful ASmartSolution learning product and its editable project. For course capsules and HTML presentations, the primary deliverable is the navigable web platform, with MP4 export when requested or already included. Read [web module delivery](references/web-module.md) for the approved contract, opening/closing, compressed audio and download verification. For standalone video commissions, preserve the requested format. Coordinate strategy, platform research, art direction, instruction, production and audit. The platform may be unfamiliar: discover it instead of relying on a previous chat or guessing its features.

## Establish the task

Read [working agreement](references/working-agreement.md) at the start of a new module or batch. A topic alone is a valid input: research, develop the information, script and direct the product using the established defaults. Record reasonable assumptions and proceed; do not require the user to supply a script or select routine production options. For batches, also read `asmart-video-production/references/batch-production.md`.

Ask focused questions only about material gaps that cannot be resolved from available evidence or the working agreement, before work that depends on the answer. Do not reopen known choices. Use [production-team.md](references/production-team.md) for responsibilities and genuinely unresolved facts, not as a mandatory intake questionnaire.
Once the information is sufficient, make the creative and production decisions yourself. Present one recommended direction and a concise brief for shared understanding, not a menu of concepts. The user may correct a misunderstanding; do not ask them to art-direct routine choices. Keep work low-cost while key facts remain unknown. Continue independent research, but defer dependent capture, paid assets, voice recording, detailed animation or full render until their prerequisites are clear. If a meaningful uncertainty appears during production, pause only the dependent work, ask the question that resolves it, and continue independent work. A small proof from the chosen direction is for resolving a concrete risk, not for presenting multiple options. Respect renderer-specific preview and render gates.

Length follows the action and explanation. Do not inherit the example's 68 seconds, silence, aspect ratio or slide pacing. Choose an overview, tutorial or series according to the content. Read [discovery.md](references/discovery.md) when locating or verifying the platform. Keep findings with the video project, not in this skill.

For a commercial preview of a course or service, read [production-team.md](references/production-team.md) before writing the brief. Such a video must help the buyer judge the offer and show how the learning or service works. When it combines a sales preview with a teaching sample, preserve both purposes in the brief and shot plan. Do not turn a tutorial into a sales pitch unless the user requests that format.

## Coordinate available skills

Read `asmart-video-production` as the shared production coordinator. This guide adds platform discovery, truth checks and delivery requirements; it does not run a competing production stack. Read `asmartdesign` and its web presentation reference before composing course scenes.

Discover and read the needed entrypoints in the current environment. These are instructions the agent applies, not a guaranteed nested execution API. Do not copy them wholesale or assume installation. Keep this skill as the production lead; each specialist keeps ownership of its own domain and checks.

- `asmartdesign`: current identity and components. The actual platform UI remains the source for recordings.
- `agent-browser`: inspect, verify and capture browser flows using its current CLI workflow.
- `campus-tool-workflow`: only when the product actually is Campus and its project resources apply. ASmartSolution is not automatically Campus.
- `hyperframes`: entrypoint for new or existing HyperFrames work; it routes to core, creative, animation, keyframes, CLI, audio or media capabilities as needed.
- `unslop`: review narration, captions and labels.
- `brand`, `frontend-design`, marketing, teaching or document skills: optional specialists when installed and relevant. For this skill's core marketing, teaching and audit roles, use [production-team.md](references/production-team.md) when a specialist is unavailable. Do not install a dependency just because this list names it.

If a dependency is unavailable, use an available equivalent that preserves the result and disclose a material substitution. Do not claim to use a framework or perform a check that did not occur. Install dependencies only within authorized work; preserve custom skills.

## Preserve the product standard

For capsules and their catalogue, use `asmartdesign/references/learning-product-library.md` and its executable library. Record the adopted version, component and editorial variant for each scene. Compare a dense scene and a moving relationship with the approved reference before extending a batch; a technical check alone does not authorize replication of an inferior visual system. The producer performs this comparison without routine user approval. Correct shared components when the result regresses. Keep research/voice progress independent of blocked visual replication.

A saved preference or a link to another skill is not enforcement. Skills route decisions; executable components preserve implementation; observed comparisons establish whether the result meets the standard. Explain concrete limitations without asking the user to repeat decisions already saved.

## Production loop

1. Run the production-team brief and assignments. Record the intended viewer, buyer when relevant, desired response, platform task, delivery and constraints.
2. Discover the actual platform and verify the actions, inputs and completion signals. Record sources, date, product version and anything that is only documented, planned or simulated.
3. Write the message and learning objective before choosing the visual treatment. Build a shot plan from verified evidence. Read [discovery.md](references/discovery.md) for platform discovery.
4. Prepare safe demonstration data and a recoverable starting state. Keep private content out of frame. Recording does not authorize submissions, account changes, messages, deployment or publication.
5. Capture the actual flow. Prefer continuous recordings with intentional cursor movement for procedures. Use animation or prepared examples only to explain things that capture cannot show. Label concepts, simulations and planned features accurately.
6. Compose to the shot plan and brand. Pace for comprehension. Add narration, captions and sound only as the brief needs. Keep media local with its source and license.
7. Run the production-team audit before delivery. Read [production.md](references/production.md) and [quality.md](references/quality.md), then inspect the exported video including critical continuous segments. Use `scripts/verify_video.py` for measurable metadata; it does not certify truth, readability, privacy or sound quality.
8. Deliver the navigable web module for course capsules/presentations, its editable project, applicable subtitles/transcript, and verified MP4 when included. For a standalone video brief, deliver that video. Report actual content, duration, format, size, audio status, evidence basis and material limitations. Do not send or publish without authorization.

## Resume and work autonomously

Keep brief, source inventory, shot plan, assets and check evidence in each project. Respect the renderer's existing formats rather than adding competing manifests. Resume from project files and reread user changes before editing.

Lead subagents only when authorized and independent ownership is useful. Integrate and inspect their work. Complete reversible local work within scope; stop only dependent actions when access, a consequential choice or authorization is missing, and continue independent preparation. This skill does not schedule background runs or promise work while a chat is inactive.

## Distribution capabilities

Check the available file, network, execution and media capabilities before using local workflows. When a specialist is absent, preserve the editorial and visual checks and disclose the substitution. These skills do not install a video runtime or grant access to Campus. See asmart-video-guide/references/portable-setup.md.
