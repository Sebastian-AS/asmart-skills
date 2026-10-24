# Production team and audit

Use this reference for course or service previews and for projects where marketing, instruction, design and platform evidence must agree. Keep roles in one coordinated workflow. Do not create subagents unless the user authorizes delegation. Do not require the user to approve every intermediate artifact.

## Close the brief before production

First review the conversation, attached material, existing project and available source platform. Do not ask the user to repeat known facts. Separate known facts, verified facts, preferences and open decisions. Bring the user only decisions that materially change the story, art direction, production cost or truthful capture.

Apply working-agreement.md first: the user can provide only a topic and the producer develops it. The prompts below are internal brief fields, not a questionnaire to send by default. For a materially ambiguous concept, ask focused questions only where evidence and established defaults cannot resolve the gap. A single round is not a limit. Ask in stages if later questions depend on earlier answers. Combine related questions when that makes them easier to answer, but do not make the user fill an unnecessarily long form. Adapt the questions to the project:

- Who will watch this, and what do they already know?
- What should they understand, feel or do after watching?
- What is the subject or user task, and which details must appear or must stay out?
- What should the video feel and look like? Ask for a reference they like or dislike if the direction is still unclear.
- Where will they watch it, in what language, and what length or format do they need?
- What material, live product access, evidence or footage should ground the video?

For a presentation, establish its thesis, key evidence and decision or response it should support. For a tutorial, establish the learner's starting point, prerequisites, exact task and success signal. For a commercial preview, establish the buyer, offer, main objection and next step. Ask permission or arrange access only where it is needed for a truthful capture. Do not request a production detail that the selected renderer can decide without changing the user's intent.

Once the goal, audience, essential content, evidence and delivery are clear enough to make a good video, write a concise brief from the answers and known facts. Mark any remaining assumptions. Choose the creative direction yourself and explain it in concrete terms: central idea, opening, visual language, narration, production needs and how it serves the viewer. Do not present a set of concepts for the user to choose among. Invite correction of your understanding, not routine art direction. If a fact remains uncertain and materially affects cost, truth or usefulness, ask about that fact before dependent work.

Prepare a storyboard or shot plan before capture and detailed animation. When a concrete production risk cannot be resolved from available evidence, make one small proof from the chosen direction and use it to answer that specific question. Continue asking focused questions during production when newly discovered facts affect the result. Do not render complete variants to ask the user which one they prefer.

Use this sequence to manage cost:

1. **Low cost:** intake, source discovery, claim checks, brief and creative treatments.
2. **Controlled sample:** a shot plan from the chosen direction and, only if needed, one representative visual or short motion proof.
3. **Production:** capture, voice, licensed media, detailed animation and full edit after the brief has enough information to guide the work.
4. **Release review:** inspect the complete export, correct factual or technical failures, then follow the renderer's final preview and render requirements.

State meaningful licensing, access, capture or render costs before taking on that work. Estimates should be ranges with assumptions, not false precision. A request to produce autonomously permits routine creative decisions within the agreed brief; it does not turn an unclear concept into an approved one or authorize unrequested external spending.

## Assign the work

| Role | Owns | Leaves behind |
| --- | --- | --- |
| Executive producer | Viewer, buyer, objective, scope, channel, delivery and schedule assumptions | A concise brief with known facts and unresolved decisions |
| Marketing strategist | Buyer problem, offer, reason to believe, objection and next action | One central message and claims tied to evidence |
| Platform researcher | Actual UI, user role, prerequisites, steps, branches and completion signal | Source inventory and verified capture plan |
| Creative director | Concept, brand, art direction, rhythm, voice, framing and sound | A visual treatment and shot plan tied to the message |
| Instructional designer | Observable learning objective, example, learner attempt and feedback | A teachable sequence that shows how the course works |
| Producer/editor | Capture, motion, narration, captions, mix and export | A playable video and editable source project |
| Auditor | Independent pass across claims, evidence, learning, design, access and export | Findings marked blocker, correction or accepted limitation |

One person/model can perform several roles. Keep the auditor's checklist separate from the producer's build decisions and inspect the rendered output. A separate subagent review is optional, not a prerequisite.

Use installed specialist skills only after confirming they exist in the current environment. Good fits include `brand` or `frontend-design` for visual decisions, an available marketing or copywriting skill for positioning, `teach` for lesson design, a documentation skill for a client-facing brief, and `hyperframes` for video production. Read the relevant entrypoint rather than copying it here. This skill remains useful when any of those specialists is unavailable.

## Build a persuasive, truthful brief

Write one sentence in this form: "This video helps [viewer or buyer] understand/do [specific outcome] by showing [observable evidence]." For a sales preview, define the requested next action. For a tutorial, define what the viewer can do afterward. When both matter, state both outcomes and give each a distinct beat.

Prefer one concrete, verified example over a list of features. Use buyer language when known. Address an objection with evidence or an honest statement of what remains to be verified. Use only supported outcomes, customer statements, metrics and platform capabilities. Never invent a testimonial, result, guarantee, integration or urgency claim. A real deadline may be stated when verified.

Before production, maintain a claims register in the existing brief or source inventory. Do not add a competing project manifest:

| Claim or on-screen statement | Evidence/source and date | Status | Shot | Check |
| --- | --- | --- | --- | --- |

Use these statuses consistently: **observed** (seen working in the captured product), **documented** (stated by a current authoritative source but not captured), **planned** (not yet available), or **illustrative** (prepared, simulated or conceptual). Keep each label visible or explain it in narration when the distinction could mislead the viewer. Do not describe a local prototype or mock interaction as a live platform capability.

## Teach, then invite

For a course preview, give the buyer a short experience of the teaching method:

1. Name an outcome the intended participant can recognize.
2. Show the instructor framing the problem and a realistic example.
3. Give the learner a moment to predict, decide or answer before revealing the explanation.
4. Show a hint or feedback that responds to the learner's reasoning.
5. Show evidence of completion and connect it to the wider course or platform.
6. Close with a specific next step for the buyer.

Use an answer-revealing interview skill such as `grilling` only to stress-test the plan. For learner practice, withhold the suggested answer until after the learner has attempted the question. Offer progressive hints and feedback tied to observable reasoning; do not score confidence or fluency as proof of understanding.

Use the actual course content and platform. Separate an instructor demonstration from a learner activity. Where learners need access that is not available, show a clearly labelled prepared example and report that limitation in the production record.

## Audit before handoff

Check each area and record the evidence inspected. Mark a finding as a **blocker** if it could mislead the buyer or learner, misrepresent the platform, expose private data, obscure a required action, or make the deliverable unusable. Fix blockers before handoff. Treat stylistic preferences as revisions, not blockers.

- **Commercial:** The intended buyer and desired next action are clear. The message shows a specific benefit and proof that supports it. No invented metric, testimonial, outcome or deadline appears.
- **Platform truth:** Each depicted action and result matches the source inventory. Live captures, screenshots, prototypes and illustrations are distinguishable. Required permissions or prerequisites are stated.
- **Learning:** The learner can identify the objective, see a meaningful attempt, receive useful feedback and understand what evidence confirms completion. The solution does not appear before an intended learner attempt.
- **Art direction:** The concept reflects the subject and existing brand. Type remains readable on the target device. Motion guides attention and leaves instructional text legible. The sound and visual treatment support the same message.
- **Accessibility and comprehension:** Speech is intelligible, captions match the spoken words, controls and code remain visible long enough to follow, and important meaning is not conveyed by color or sound alone.
- **Privacy and rights:** No credentials, private records or unauthorized personal data appear. Media, fonts, music and voice have appropriate permission and source records.
- **Export and editability:** Watch the exported file at normal playback. Inspect the critical continuous steps, not only a contact sheet. Listen when audio exists. Confirm duration, dimensions, format, file size, subtitle timing and that the editable project can reopen assets.

Preserve limitations rather than smoothing over failed or unverified behavior. Report which checks were completed, which were not, and what evidence supports the handoff. Metadata verification is not an editorial or factual audit.
