# AGENTS.md

## Project mission

Build the polished, clickable SSI AI Correspondence Platform prototype described in `prd.md`. The audience is SSI leadership, so favor a credible, restrained Microsoft 365-adjacent enterprise experience over a generic dashboard or chatbot.

## Guiding principle: the working demo is the product

This is a short-lived, Figma-like interactive mockup expected to be discarded after the demonstration. The north star is a convincing, reliable demo—not production-grade software or an architecture designed for future growth.

- Prioritize the visible leadership-demo path, visual polish, interaction clarity, and believable state changes above extensibility or engineering completeness.
- Static data, hard-coded scenario outcomes, predefined copy variants, and narrowly scoped state transitions are preferred when they produce a more reliable demonstration faster.
- It is acceptable for secondary screens to be shallower than the primary transcript workflow, provided they look credible and every enabled control gives visible feedback.
- Build only enough shared structure to keep screens consistent and prevent demo-breaking defects. Do not create infrastructure for hypothetical future requirements.
- Do not spend time on production concerns that the PRD excludes: backend boundaries, authentication, network resilience, telemetry, deployment infrastructure, data migration, broad security hardening, large automated test suites, or enterprise-scale performance.
- Do not sacrifice the demo experience to architectural purity. A small amount of deliberate duplication is acceptable when it is clearer and faster than abstraction.
- Validation should protect the presentation: confirm the app starts, routes render, the primary workflow works, screenshots look polished, and no visible/runtime errors interrupt the demo.
- A production build remains a useful TypeScript and bundling sanity check; it is not a request for production readiness.
- When scope or time competes with fidelity, finish the five-minute demo narrative in `DESIGN.md` first.

`prd.md` is the product source of truth. `DESIGN.md` is the approved interaction and visual specification. Read both before making product, UX, or styling decisions. When the documents differ, follow this priority unless the user explicitly says otherwise:

1. The user's current instruction
2. `prd.md` for scope, behavior, and acceptance criteria
3. `DESIGN.md` for layout, interaction patterns, visual system, and content conventions
4. This file for implementation practice

## Non-negotiable boundaries

- This is a frontend-only demonstration built with Vite, React, TypeScript, React Router, Lucide React, and Tailwind CSS or structured CSS modules.
- Do not add a backend, database, authentication, Microsoft Graph, Azure services, external APIs, real AI/LLM calls, or other live integrations.
- All records, AI results, knowledge grounding, form extraction, QA decisions, and releases are simulated locally.
- Never use the names or identifying details of real schools, students, staff, addresses, email accounts, or student IDs. All visible content must be clearly fictional.
- Keep the persistent label `Demonstration Environment — Fictional Data` visible in the application shell.
- Do not expand the product beyond the PRD until the core transcript-request workflow is complete.
- The app must work after `npm install` and `npm run dev`.

## Local Node.js command environment

The repository shell may not expose Node.js tools on `PATH`. Do not conclude that Node, npm, or pnpm is unavailable until checking the known NVM installation below.

Use the locally verified Node 24 toolchain for project commands:

```bash
SSI_NODE_BIN=/home/jeremy-young/.nvm/versions/node/v24.13.0/bin
export PATH="$SSI_NODE_BIN:$PATH"

node --version
npm --version
```

Verified binaries and versions at the time this file was updated:

| Command | Absolute path | Verified version |
| --- | --- | --- |
| `node` | `/home/jeremy-young/.nvm/versions/node/v24.13.0/bin/node` | `v24.13.0` |
| `npm` | `/home/jeremy-young/.nvm/versions/node/v24.13.0/bin/npm` | `11.6.2` |
| `npx` | `/home/jeremy-young/.nvm/versions/node/v24.13.0/bin/npx` | `11.6.2` |
| `pnpm` | `/home/jeremy-young/.nvm/versions/node/v24.13.0/bin/pnpm` | `10.28.2` |
| `corepack` | `/home/jeremy-young/.nvm/versions/node/v24.13.0/bin/corepack` | `0.34.5` |

The npm/npx/pnpm launchers use `#!/usr/bin/env node`, so calling their absolute paths without first adding the matching `bin` directory to `PATH` can still fail. Always apply the `SSI_NODE_BIN` prefix first, including in automated shell commands.

For this repository, npm is the canonical package manager because the PRD explicitly requires `npm install` and `npm run dev`. Use:

```bash
npm install
npm run dev
npm run build
npm run lint --if-present
npm test --if-present
```

- Commit and maintain `package-lock.json` once the project is scaffolded.
- Do not create a second lockfile with pnpm unless the user explicitly changes the package-manager decision.
- `pnpm` is available at the path above for diagnosis or an explicit migration, but it is not the default for this project.
- Prefer project scripts (`npm run ...`) and `npm exec` over relying on globally installed frontend tools.
- Do not edit the user's shell profiles as part of project work. The current shell-profile issue is outside this repository; use the scoped `PATH` setup above.
- A second verified fallback exists at `/home/jeremy-young/.nvm/versions/node/v22.22.2/bin` (Node `v22.22.2`, npm `10.9.7`). Use it only if a dependency proves incompatible with Node 24, and document the reason.

## Product priorities

Implement in this order when the repository is incomplete:

1. Application shell, routing, selectors, demo banner, and reset behavior.
2. Static mock-data model and shared demo-state layer.
3. The end-to-end Registrar transcript workflow across Work Queue, Response Workbench, the attachment-review modal, Release Queue, Agent Controls, and Knowledge.
4. Remaining required interactions on those screens.
5. Program Dashboard, Reporting, and Administration depth.
6. Accessibility, responsive refinement, consistency checks, and final polish.

A wide set of decorative screens is not a substitute for the required clickable workflow.

Apply the guiding principle above when implementing this sequence. Favor a complete and polished primary path over exhaustive depth in lower-priority configuration screens.

## Approved design direction

- Follow `DESIGN.md`; do not invent a separate visual language route by route.
- Build an operations control plane, not a chatbot or marketing dashboard.
- Use the shell name `SSI Correspondence` with descriptor `Operations Console` and the persistent fictional-data environment label.
- Use the specified system-font typography, semantic color tokens, spacing, borders, radii, table density, badge mappings, and responsive breakpoints.
- Use the shell dimensions and compositions in `DESIGN.md` as target values. Small adjustments are acceptable when verified at real viewport sizes, but preserve the intended hierarchy.
- Keep one primary action per region and use precise operational labels such as `Approve for release`, `Run random QA`, and `Hold affected drafts`.
- Use dialogs, drawers, toasts, and inline alerts for the purposes assigned in `DESIGN.md`. Do not use browser-native `alert`, `confirm`, or `prompt` in the finished prototype.
- Keep the persistent `About this screen` button immediately beside `Reset Demo` in the application header. It opens an accessible, route-specific informational modal with the four labeled sections `What exists`, `Business case`, `Pain solved`, and `Possible additions`; it must never alter demo state. Use the route-specific content map in `DESIGN.md`, including the attachment-review explanation of configured-form ground truth.
- Preserve queue filters when navigating to and from a workbench. Attachment Review is a modal launched from the originating Work Queue request or Response Workbench; preserve that origin and selected attachment when it closes.
- Optimize first for a 1366×768 laptop while remaining polished on wider screens. Required actions may not disappear at smaller widths.
- Treat the five-minute leadership-demo narrative in `DESIGN.md` as a critical acceptance path alongside the PRD workflow.

## Core demo workflow

Preserve one stable primary scenario throughout the data and UI:

1. A fictional student emails the Registrar about a transcript and attaches an incomplete authorization PDF plus a separate supporting image.
2. The request is classified as a transcript request; each attachment is independently classified against configured form definitions.
3. The PDF matches Official Transcript Authorization version 2026.1, while the image demonstrates an unmatched/supporting artifact.
4. Form extraction uses the matched configured schema, detects a missing signature, and exposes the related warning and source field.
5. The response is staged for scheduled release and is selected by random QA sampling.
6. The workbench states: `Selected for review through random QA sampling`.
7. A reviewer can edit the draft or apply every predefined refinement action.
8. Approval moves the response into the release queue.
9. Changing the transcript policy can set QA to 100% and hold affected staged drafts.

State changes must be reflected everywhere they matter. For example, approving a draft updates the workbench, work queue, audit history, and release queue rather than changing only the currently visible component.

## Architecture and code organization

Use a maintainable structure close to the PRD:

```text
src/
├── components/
│   ├── layout/
│   ├── tables/
│   ├── forms/
│   ├── feedback/
│   └── shared/
├── pages/
├── data/
├── hooks/
├── context/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

- Keep route-level screens in `src/pages` and reusable UI in `src/components`.
- Keep mock business rules and state transitions out of presentation components.
- Use React Context or a genuinely lightweight local store; do not add a complex state-management dependency.
- Maintain a single shared demo-state source for emails, drafts, forms, policies, knowledge, release batches, and audit events.
- Treat source mock data as immutable. Reset by rebuilding state from the original static dataset, and clear any persisted demo-state key.
- `localStorage` persistence is optional. If used, version the storage key and fail safely when stored data is absent or invalid.
- Use stable, human-readable IDs and ID references between related records. Do not join records by display text.
- Use React Router routes for all primary screens and the email workbench. Direct navigation and refresh must load without an application error.
- Do not put the whole application in one file, create premature abstractions, or let duplicated state-transition logic produce conflicting behavior across pages.
- Centralize the visual tokens from `DESIGN.md` as CSS custom properties or theme configuration. Components should consume semantic tokens rather than hard-coded one-off colors.
- Prefer CSS or lightweight inline SVG for the modest dashboard/reporting charts. Do not add a charting dependency unless the required accessible visualizations cannot reasonably be built with the existing stack.
- Treat these architecture guidelines as guardrails against demo-breaking inconsistency, not as a mandate to build a production framework. Choose the smallest implementation that reliably supports the presentation.

## TypeScript and data rules

- Enable strict TypeScript and do not use `any`.
- Define domain interfaces/types for the entities listed in the PRD, including institutions, departments, mailboxes, users, emails/threads, attachments, document assessments, configured form definitions/versions, extraction instances/fields, drafts, knowledge sources, release batches, QA policies, and audit events.
- Store the canonical fixture records under `src/data` as static JSON where practical, with TypeScript types and validated assumptions at the import boundary. Typed fixture modules are acceptable when they materially improve correctness.
- Seed approximately the quantities required by the PRD: 4 institutions, 5 departments, 8 mailboxes, 20–25 emails, 8–12 knowledge articles, 4 forms, 3 release batches, and 6 users.
- Include the representative states and edge cases specified by the PRD. Keep dashboard, queue, reporting, and batch figures internally consistent.
- Use predefined text variants for simulated AI refinements. Never generate response content dynamically or imply that a live model ran.
- Use deterministic predefined results for classification, grounding, extraction, and knowledge impact. JavaScript randomness is allowed only for the explicitly simulated random-QA selection.

## State-transition invariants

- Mandatory-review rules are applied before random sampling.
- Random sampling runs only after a release population is locked and samples the configured percentage from the remaining eligible drafts.
- The UI must make clear that the agent does not select QA messages.
- Record consequential actions as audit events, including refinements, edits/saves, form corrections, approvals, holds, transfers, escalations, policy changes, sampling, and releases.
- Approving the main draft makes it eligible for or adds it to the appropriate release batch.
- Holding, resuming, releasing, changing release time, pausing releases, and setting 100% QA must update shared state and visible batch counts.
- A transcript knowledge change must identify affected staged drafts and support revalidation, 100% QA, batch hold, or continuing with current settings. The chosen response must propagate to Agent Controls and Release Queue.
- Form-field selection highlights the matching form region. Corrections update value, validation status, confidence where appropriate, and review/audit state.
- Do not conflate an incoming attachment, configured form definition, and extracted-form instance. Attachments link to independent document assessments; matched assessments link to the configured form/version used by their extraction instance.
- Classification correction or confirmation must update visible attachment state and create an audit event. Unmatched documents can remain supporting material without fabricated extraction fields.
- The Reset Demo action restores every screen to the original fixture-derived state.

## Required routes and interactions

The persistent left navigation must expose:

- Program Dashboard
- Work Queue
- Release Queue
- Agent Controls
- Knowledge
- Reporting
- Administration

The implementation is not complete unless the PRD's required controls are functional, including queue filters; opening an email and attachment-review modal; editing, refining, approving, rejecting, holding, transferring, and escalating drafts; correcting and approving extracted forms; changing automation and QA settings; pausing releases; running random QA; changing knowledge; holding affected drafts; releasing a batch; and resetting the demo.

Buttons that appear enabled must do something visible. For intentionally simulated actions, update local state and provide clear feedback rather than leaving dead controls.

## UX standards

- Use white and light-gray surfaces, a blue accent, dark text, compact data tables, restrained status badges, professional typography, and minimal gradients.
- Communicate control, traceability, safety, human oversight, institutional separation, and operational maturity.
- Avoid futuristic AI imagery, neon color, excessive animation, chatbot-first layouts, oversized decorative graphics, and consumer-style card grids.
- Use Lucide icons consistently; do not substitute emoji for interface icons.
- Keep the institution selector, department selector, user/role indicator, header, demo banner, and navigation persistent in the application shell.
- Make the desktop-first interface remain usable on smaller laptop screens. Dense tables may scroll horizontally, but primary actions and navigation must remain reachable.
- Use semantic HTML, programmatic labels, keyboard-accessible controls, visible focus states, accessible contrast, and text in addition to color for every status.
- Confirm dialogs, menus, modals, and tooltips must be keyboard operable and have meaningful accessible names.
- Use the exact semantic badge families and risk labels defined in `DESIGN.md`; do not communicate state with an unlabeled dot.
- Use inline editing for extracted form fields and proper modal forms for administration. Do not collect edits with prompt dialogs.
- Use visible local feedback for every successful simulated action. Consequential actions require the confirmation treatment specified in `DESIGN.md`.
- Use the date/time and confidence-label conventions in `DESIGN.md` consistently across routes.

## Implementation practices

- Prefer small reusable primitives for badges, metrics, filters, tables, confidence indicators, panels, dialogs, and feedback states, but keep domain-specific behavior near its feature.
- Use native platform and existing project dependencies before adding packages. Add a dependency only when it clearly reduces complexity and remains within the approved stack.
- Handle empty, filtered-empty, missing-record, and invalid-route states without crashing.
- Avoid nonfunctional placeholder controls, silent failures, and fabricated loading delays.
- Comment only when the intent or business rule is not evident from names and structure.
- Preserve unrelated user changes when modifying an existing worktree.

## Verification before handoff

Verification is demo-focused, not a production certification exercise. After implementation or a material change:

1. Run the production build and resolve all TypeScript/build errors.
2. Run available lint or test scripts and resolve relevant failures.
3. Start the app and exercise every primary route, preferably at the rendered UI level.
4. Walk the main transcript scenario end to end, including the knowledge-change/100%-QA hold path.
5. Check browser console output for runtime errors and accessibility warnings.
6. Verify direct route loads, queue filters, all state-changing controls, cross-screen propagation, the current route's `About this screen` modal, and Reset Demo.
7. Search visible fixtures for real institutions or personal data and replace anything questionable with unmistakably fictional content.
8. Review the five-minute demo narrative in `DESIGN.md` at 1366×768 and confirm primary actions remain visible and usable.

Do not claim a check passed unless it was actually run. If browser-level verification is unavailable, say so explicitly and report the build/lint checks that were completed.

## README and handoff

Maintain a concise `README.md` covering the prototype purpose, stack, install/dev/build commands, project structure, mock-data approach, reset behavior, main workflow, and an explicit statement that the app has no live integrations or real data.

At handoff, summarize what was implemented, list intentionally simulated behaviors, provide the commands to run it, and call out any acceptance criterion that remains incomplete.
