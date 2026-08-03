# SSI Correspondence Platform — Product Design Specification

## Design intent

The prototype should feel like an operational control plane for institutional correspondence: calm under load, precise about state, and explicit about why automation did or did not act. It should look credible beside Microsoft 365 products without copying Microsoft trademarks or presenting itself as a native Microsoft product.

The visual hierarchy should answer three questions quickly on every screen:

1. What requires attention?
2. Why does it require attention?
3. What controlled action can the operator take next?

This is not a chatbot experience. AI appears as explainable assessments, evidence, confidence, and predefined refinements inside a conventional enterprise workflow.

## Attachment pipeline as a product concept

Make the document pipeline legible throughout the experience:

```text
Incoming attachment → Document classification → Configured form/version →
Canonical extraction → Validation → Email decision
```

The configured form catalog is the reference taxonomy and extraction schema. Incoming attachments are independent artifacts that may match a configured form, produce several candidate matches, or remain unmatched/supporting. Never label an attachment as an extracted form before classification is shown.

Use consistent document states:

- `Matched` — configured form and version confidently identified
- `Needs classification review` — low-confidence or ambiguous match
- `Supporting document` — intentionally retained without structured extraction
- `Unmatched` — no configured form meets the classification threshold
- `Extraction review required` — matched form has invalid or low-confidence fields
- `Validated` — classification, extraction, and required-field rules pass

## Product identity

- Product name in the shell: **SSI Correspondence**
- Product descriptor: **Operations Console**
- Environment label: **Demonstration Environment — Fictional Data**
- Default role: **Morgan Lee · Program Administrator**
- Tone: institutional, direct, measured, and reassuring
- Logo treatment: simple blue square monogram with `SSI`; no imitation Microsoft logo

## Page frame

Use a four-part application frame:

```text
┌──────────────────────────────── Demonstration Environment — Fictional Data ──┐
├───────────────┬─────────────────────────────────────────────────────────────────┤
│ SSI           │ Institution selector  Department selector       User / Reset    │
│ Correspondence├─────────────────────────────────────────────────────────────────┤
│               │ Page title, context, and primary action                         │
│ Navigation    ├─────────────────────────────────────────────────────────────────┤
│               │                                                                 │
│               │ Main page content                                               │
│               │                                                                 │
└───────────────┴─────────────────────────────────────────────────────────────────┘
```

- Environment strip: 28px tall, full width, pale blue background, centered label, always visible.
- Left navigation: 232px wide at desktop sizes, white surface, right border, fixed below the environment strip.
- Header: 64px tall, white surface, bottom border, sticky. Selectors sit left; user controls sit right, followed by a persistent `About this screen` button immediately beside `Reset Demo`.
- Main content: `#f6f7f9` canvas with a maximum comfortable width of 1600px. Queue and workbench routes may use the full available width.
- Standard page padding: 24px. Use 20px at narrower laptop widths.
- Page heading row: 68–76px, with title and short operational subtitle on the left and at most two page-level actions on the right.
- Navigation collapses to a 64px icon rail below 1180px. Tooltips expose labels. Do not create a mobile bottom navigation.
- Below 900px, preserve workflows using horizontal overflow and stacked panels; do not hide required controls.

## Navigation

Use these labels and Lucide icons:

| Route | Label | Icon |
| --- | --- | --- |
| `/` | Program Dashboard | `LayoutDashboard` |
| `/work-queue` | Work Queue | `Inbox` |
| `/release-queue` | Delivery Queue | `Send` |
| `/agent-controls` | Agent Controls | `SlidersHorizontal` |
| `/knowledge` | Knowledge | `BookOpen` |
| `/reporting` | Reporting | `ChartNoAxesCombined` |
| `/administration` | Administration | `Settings` |
| `/improvement-queue` | Improvement Queue | `BrainCircuit` |

The active item uses a 3px blue left indicator, pale-blue fill, blue icon, and semibold label. Group the first three routes under **Operations** and the remaining five under **Governance**. Section labels are small uppercase text, not interactive controls. Form Review is not a navigation item: it opens as an attachment-review modal from a Work Queue request or the Response Workbench.

Show compact navigation counters only when meaningful:

- Work Queue: total items currently requiring attention
- Delivery Queue: ready-for-delivery count

## Visual system

### Typography

Use the system UI stack with `"Segoe UI"` first. Avoid external font downloads.

| Role | Size / line-height | Weight |
| --- | --- | --- |
| Page title | 24 / 32 | 650 |
| Section title | 18 / 26 | 600 |
| Card title | 14 / 20 | 600 |
| Body | 14 / 20 | 400 |
| Table and controls | 13 / 18 | 400–600 |
| Caption | 12 / 16 | 400–600 |
| Metric | 28 / 34 | 650 |

Use sentence case for titles, buttons, labels, and table headings. Use tabular numerals for metrics, dates, percentages, and counts.

### Color tokens

Define semantic CSS variables rather than scattering raw color values.

```text
--canvas:             #f6f7f9
--surface:            #ffffff
--surface-subtle:     #f9fafb
--border:             #dfe3e8
--border-strong:      #c8ced6
--text:               #18202a
--text-secondary:     #52606d
--text-muted:         #6b7785
--accent:             #2563eb
--accent-hover:       #1d4ed8
--accent-subtle:      #eaf2ff
--focus:              #1d4ed8
--success:            #18794e
--success-subtle:     #eaf7f0
--warning:            #9a6700
--warning-subtle:     #fff6d8
--danger:             #c0362c
--danger-subtle:      #fff0ef
--info:               #1264a3
--info-subtle:        #eaf5ff
--neutral-subtle:     #eef1f4
```

Never use color as the only state cue. Pair it with a label and, for warnings/errors, an icon.

### Spacing, borders, and elevation

- Base spacing unit: 4px. Prefer 8, 12, 16, 20, 24, and 32px increments.
- Standard corner radius: 6px for controls and badges; 8px for panels, cards, dialogs, and menus.
- Borders are the primary way to separate enterprise surfaces. Use shadows sparingly.
- Default panel shadow: `0 1px 2px rgba(16, 24, 40, 0.06)`.
- Modal shadow may be stronger, but the backdrop and focus trap must make modality obvious.
- Use 36px controls in dense toolbars and 40px controls in forms and dialogs.

## Reusable UI patterns

### Buttons

- Primary: filled blue; reserve for the single preferred action in a region.
- Secondary: white with gray border.
- Quiet: borderless for low-emphasis actions.
- Danger: red, used only for irreversible or operationally disruptive confirmation actions.
- Every action must have a visible hover, active, disabled, and keyboard-focus state.
- Use an icon plus label for unfamiliar actions. Icon-only buttons require tooltips and accessible names.

### Status badges

Badges are compact text labels with subtle background and a 1px tonal border.

- Blue/info: New, Classified, Draft Ready
- Amber/review: QA Required, Form Review Required, Missing Information, Staged
- Purple/specialist: Specialist Review, Escalated
- Green/success: Approved, Delivered, Valid, Grounded
- Red/blocked: Held, Invalid, Emergency Hold
- Gray/inactive: Superseded, Expired, Paused

Risk is always shown as `Low risk`, `Medium risk`, or `High risk`, not a color dot alone.

### Alerts and feedback

- Inline alert: persistent explanation attached to the affected content.
- Toast: confirmation of a completed local action; auto-dismiss after about five seconds and remain screen-reader announced.
- Confirmation dialog: required for sending a delivery batch, pausing all delivery, emergency hold, reset, and continuing after a known policy conflict.
- Avoid browser-native `alert`, `confirm`, and `prompt` in the finished prototype.

### First-visit welcome and route-specific onboarding

#### First-visit welcome

Show a one-time welcome modal after the shell first renders. It is the short orientation before route-specific help, not a tutorial tour or a blocker to navigation. Use the title **Welcome to SSI Correspondence** and structure the content as four compact sections:

- **The operational problem:** high-volume institutional correspondence and document intake require consistent service without losing human control, policy traceability, or delivery safeguards.
- **What this demo shows:** queue triage, evidence-grounded response drafts, attachment/form validation, random QA, controlled simulated outbound email delivery, and policy-impact governance.
- **Recommended walkthrough:** `Program Dashboard → Work Queue → Transcript Response Workbench → Attachment Review → Delivery Queue → Agent Controls → Knowledge`.
- **Demonstration boundary:** all records and actions are fictional, predefined, and local to this browser; no email is sent and no live student data, integrations, or AI model are used.

The footer has one primary dismissal action, `Start guided demo`, and a short line directing users to **About this screen** beside Reset Demo for help on any later route. The modal must be keyboard accessible and follow the standard dialog focus treatment. Store dismissal with a dedicated versioned `localStorage` key (`ssi-correspondence-welcome-dismissed-v1`); do not show it again after dismissal, including when Reset Demo restores fictional workflow state.

#### Route-specific help

`About this screen` is a persistent secondary header button on every primary route, immediately before `Reset Demo`. It opens an accessible modal for the current route; it is explanatory only and never changes demo state. Each modal uses these four labeled sections: **What exists**, **Business case**, **Pain solved**, and **Possible additions**. Copy is concise and route-specific:

| Screen | What exists / business case | Pain solved / possible additions |
| --- | --- | --- |
| Program Dashboard | Network health, automation, QA, backlog, and knowledge-change signals; gives leaders one operational view. | Replaces fragmented status reporting; add trend comparisons and scheduled exports. |
| Work Queue | Filterable correspondence triage with email, request, and attachment state; directs staff attention. | Replaces shared-inbox ambiguity; add saved views, SLA cues, and bulk triage. |
| Response Workbench | Original message, predefined draft, evidence, refinements, and audit trail; enables controlled reviewer decisions. | Reduces manual drafting without obscuring oversight; add collaboration and richer escalation routing. |
| Delivery Queue | Locked batch populations, QA progression, holds, and scheduled delivery controls; makes delivery governance explicit. | Prevents opaque or premature sending; add approval chains and delivery windows. |
| Agent Controls | Scoped automation, QA, delivery, and response policy settings; demonstrates scalable human control. | Replaces inconsistent mailbox-by-mailbox rules; add policy simulation, versions, and approval workflow. |
| Knowledge | Approved policy catalog, ownership, versions, and impact handling; protects response consistency. | Makes stale policy use visible; add authoring, diffs, and review-cycle reminders. |
| Reporting | Leadership measures, performance comparisons, and knowledge gaps; demonstrates measurable value. | Reduces manual impact reporting; add scheduled exports and richer period comparisons. |
| Administration | Fictional configuration tables, including the configured form taxonomy; shows controlled setup without code. | Replaces scattered configuration; add provisioning, role management, and import workflows. |
| Improvement Queue | Aggregated QA and document-intake feedback, candidate versions, offline evaluation, and human activation; demonstrates governed learning. | Avoids opaque self-training from individual reviews; add approval workflows, larger evaluation sets, and richer monitoring. |

The attachment-review modal also offers its own concise `About this review` explanation when launched: it identifies the incoming artifact, matches it against configured form definitions/versions, validates canonical fields, and keeps unmatched artifacts as supporting material. It demonstrates safer document intake; possible additions include visual mapping and assisted exception handling.

### Guided demo tour

Expose a persistent `Start guided demo` entry point for the leadership narrative. It launches a restartable spotlight tour that does not change any local demo state or invoke operational controls. The exact sequence is: Program Dashboard → Work Queue → Registrar transcript Response Workbench → transcript attachment intake → Delivery Queue → Knowledge → Agent Controls → Improvement Queue.

At every step, navigate to the needed route or attachment-review context, place a visible spotlight around the relevant target, and use concise business-value copy. The tour panel shows `Step n of n` plus `Back`, `Next`, and `Exit`; starting it again always restarts at Dashboard. All tour controls and route changes are keyboard operable, focus enters the current tour panel, and focus returns to the invoking control on exit. If the expected target is missing or cannot be positioned, show a visible fallback explaining that the screen is still available and offer `Continue`; never auto-run a state-changing action to make a target appear.

### Data tables

- Use a sticky 40px header and 48px body rows.
- Keep primary identity columns sticky where useful; allow horizontal scrolling rather than compressing text beyond recognition.
- Left-align text, right-align numeric data, and use consistent date formats.
- Row hover uses a subtle blue-gray fill. The entire work-queue row is keyboard focusable and opens the record.
- Keep row-level actions in a final overflow menu so they do not overwhelm the table.
- Show `Showing n of n` and a clear-filters action. A filtered-empty state must explain that records exist but do not match.

### Filters

- Work Queue uses a compact filter bar above the table. Show the highest-value four filters directly and place the remainder in a `More filters` popover.
- Active filters appear as removable chips in a second row.
- Search matches sender, subject, mailbox, and request type.
- Filters apply immediately; do not require an Apply button.

### Drawers and dialogs

- Use dialogs for focused create/edit configuration tasks.
- Use a right drawer for secondary detail that benefits from preserving table context, such as delivery-batch membership or knowledge article metadata.
- Do not use a drawer for the primary Response Workbench; it has its own route.

## Screen designs

### Program Dashboard

The dashboard is a layered operational overview, not a wall of equal cards.

- First row: view switcher (`Network`, `Institution`, `Department`), date range, and `Export report` simulated action.
- Metric strip: five compact priority metrics visible initially—Emails processed, Automation rate, QA pass rate, Average response time, Exceptions. The remaining PRD metrics appear in a secondary strip below.
- Main grid: Volume by department (wide horizontal bar chart), Queue backlog (stacked status summary), and QA pass rate by institution.
- Lower grid: Automation by mailbox table and Recent knowledge changes timeline.
- Each visualization includes a compact legend, exact values, and an accessible textual label. Prefer CSS/SVG visualizations over a chart dependency.

### Work Queue

- Heading shows `Work Queue`, a short count summary, and `Refresh simulation` as a quiet action.
- A KPI ribbon shows Requires attention, Random QA, Mandatory review, Form issues, and Held.
- Filter/search bar precedes the table.
- Place the main transcript scenario in the first page and make it visually recognizable with `QA Required`, `Missing signature`, and `Random sample` cues without artificially highlighting the entire row.
- Opening a row routes to `/work-queue/:emailId`.

### Response Workbench

Use the three-panel structure as the primary product showcase:

- Left, 30%: original conversation, sender/context, classification, risks, and attachment card.
- Center, 44%: draft metadata, editable response, and action bar.
- Right, 26%: evidence, warnings, required elements, refinements, and audit history.

At widths below 1180px, the right panel becomes tabs below or beside the editor (`Evidence`, `Refine`, `Audit`) while keeping the email and draft visible.

Specific details:

- A breadcrumb returns to Work Queue and retains filter state.
- Put `Selected for review through random QA sampling` in an amber review banner above the draft.
- The attachment card shows filename, file type, extraction state, and `Open form review`.
- For multiple attachments, use one compact row per artifact. Show a file icon/preview, filename, physical format, predicted document type, classification confidence, matched form version, and validation/review state.
- Keep request classification and attachment classification visually distinct. The former describes the email's intent; the latter identifies each incoming document against the configured form catalog.
- The draft editor resembles an email composition surface, not a chat bubble. Show To, Subject, tone profile, version, and scheduled delivery metadata.
- Primary action: `Approve for delivery`. Secondary actions: Save draft, Hold. Reject, Transfer, and Escalate belong in `More actions` unless screen width permits.
- Refinement buttons are quiet bordered controls. Applying one updates the static draft, increments the version, and records a timeline event.
- Knowledge sources show article title, version, approval state, and the exact response element supported.
- Confidence uses a labeled value such as `Grounding confidence 94% · High`, plus a simple bar.

### Delivery Queue

- This is a simulated outbound email delivery queue, not a software release process.
- Top operational banner shows delivery state, next delivery time, and whether automated delivery is paused.
- Delivery batches display as a compact table. Selecting a batch opens an inline detail region or right drawer with batch membership and audit events.
- The batch detail header contains Hold/Resume, Change time, Run random QA, Set QA to 100%, and `Send approved responses` actions with clear permission hierarchy.
- Counts form a single progression: Population → Mandatory → Randomly selected → Approved → Held → Ready for delivery.
- Include the required random-selection explanation in an info tooltip adjacent to `Run random QA`.
- Sending uses a confirmation dialog summarizing exactly how many responses will change to Delivered.

### Attachment Review modal

- Launch a focused attachment-review modal from the selected email's attachment list, preserving the selected artifact and restoring the originating Work Queue or Workbench context on close. It is not a standalone route exposed by navigation.
- Use a 50/50 split with independent scrolling areas inside the modal.
- Add an attachment strip or selector above the split view when the email contains multiple documents. Each attachment retains independent classification, extraction, and validation state.
- Start the right panel with a `Document classification` block before extracted fields. It shows configured-form match, version, confidence, alternative candidates, and Confirm/Correct actions.
- Left: off-white document canvas containing an HTML-rendered fictional form. Field rectangles are subtle until selected; selected field uses blue outline and pale fill. Missing signature uses red outline and warning annotation.
- Right: record summary followed by field rows. Each row shows field name, value, confidence, validity, and Edit/Approve affordance.
- Clicking either a field row or form region selects and scrolls its counterpart into view.
- Editing occurs inline with Save/Cancel. Never use a prompt dialog.
- Keep actions in a sticky bottom bar: Approve extraction, Request resubmission, Save mapping, and More actions for unreadable/escalate.
- For images or unknown documents, render a credible image/document preview rather than fabricated extracted fields. Offer `Map to configured form`, `Keep as supporting document`, and `Mark unreadable`.
- Correcting a classification changes the schema used by the extraction view and records an audit event. The mock may swap to a predefined extraction result rather than re-running any model.

### Agent Controls

- Start with a scope bar: Institution → Department → Mailbox → Request type. Always show which scope inherits or overrides policy.
- Place current mode in a prominent but restrained banner with explanatory text.
- Use three sections: Automation and QA, Delivery safeguards, Response standards.
- Percentage controls combine a labeled range input with an exact numeric input; values update a nearby policy summary immediately.
- Operating modes appear as a segmented group or selectable list with descriptions. Emergency Hold requires confirmation.
- A sticky right summary on wide screens shows the Registrar sample configuration, affected staged drafts, and unsaved changes.
- Save changes creates an audit event and a toast. Policy changes relevant to the transcript scenario must propagate immediately after save.

### Knowledge

- Use a governance table with search, department/status filters, and affected-draft counts.
- Opening an article shows metadata, current approved language, version history, and impacted drafts in a right drawer.
- The fictional transcript policy exposes a primary `Mark policy changed` action.
- After a change, show a focused impact dialog with the affected count and four explicit choices: Revalidate drafts, Increase QA to 100%, Hold delivery batch, Continue with current settings.
- Treat the choice as an operational decision: explain the effect before confirmation, then update Agent Controls and Delivery Queue.

### Reporting

- Begin with a reporting period and scope selector.
- Use a concise executive-summary band for Staff hours saved, Response-time reduction, Headless delivery rate, QA pass rate, and Forms normalized.
- Follow with performance-by-school and performance-by-department comparisons, then knowledge gaps.
- Every percentage chart must expose numerator/denominator or exact values in adjacent text/table content.
- `Export report` is simulated and should produce visible confirmation, not a dead button.

### Administration

- Use a category sub-navigation and one reusable configuration table pattern.
- Each category supports Add and Edit through accessible modal forms backed by local state.
- Destructive-looking actions may be simulated but require confirmation and must not silently remove records needed by the demo workflow.
- Keep this screen credible and complete-looking without overbuilding deep settings behavior.
- `Form types` is the configured classification catalog. Show definition name, category, versions, accepted formats, required canonical fields, classification threshold, and status.
- `Canonical fields` shows normalized keys, data type, validation rule, and which configured forms use each field.

### Improvement Queue

- Present a governed QA learning loop, never an autonomous self-training system. Surface structured feedback from QA approvals, edits, and rejections plus attachment-classification and extraction corrections.
- Aggregate feedback patterns into compact cards or a table with volume, representative simulated examples, affected workflow, and candidate improvement hypothesis.
- `Run simulated evaluation` reveals deterministic, predefined offline quality, safety, and policy-grounding results; it must not call a service or mutate a candidate version.
- A candidate can be `Approved and activated` only after evaluation and a human confirmation. Activation is versioned, simulated local state; it never follows from a single review.
- Show an active-version monitoring strip and a visible simulated `Rollback` action. `Dismiss` removes a candidate from the operator's active review list with confirmation feedback.

## Interaction narrative for the leadership demo

The happy-path presentation should take about five minutes:

1. Start on Dashboard and establish scale, automation, and exception oversight.
2. Open Work Queue and select the Registrar transcript request.
3. In Workbench, explain the random-QA reason, grounding evidence, and missing-signature warning.
4. Open the transcript PDF's attachment-review modal, select the signature field, and request resubmission or correct/approve a field.
5. Return to Workbench, apply `Make warmer`, then approve for delivery.
6. Open Delivery Queue and show the staged response and locked-population sampling logic.
7. Open Knowledge, mark the transcript policy changed, and select `Increase QA to 100%` plus hold affected drafts.
8. Return to Agent Controls or Delivery Queue to show the policy and held-state propagation.
9. Use Reset Demo to restore the original narrative.
10. Finish in Improvement Queue to show that accumulated QA and document-intake feedback is evaluated offline and activated only with human approval.

Preserve the user's place: closing Attachment Review returns to its originating Work Queue request or Response Workbench with the selected attachment context intact, and returning from a record retains queue filters.

## Motion and loading

- Use 120–180ms transitions for hover, focus, disclosure, and drawer movement.
- Respect `prefers-reduced-motion`.
- Because all data is local, do not invent long loading experiences. A brief button busy state is acceptable for simulated delivery or QA actions when it clarifies the state transition.
- Avoid animated counters, decorative parallax, pulsing AI effects, and auto-advancing content.

## Accessibility acceptance

- Support keyboard navigation across shell, filters, tables, dialogs, editors, and field mapping.
- Use a skip link and one visible `main` landmark.
- Ensure focus returns to the invoking control after dialogs and drawers close.
- Trap focus within modal dialogs and permit Escape to close non-destructive dialogs.
- Associate table headers, control labels, validation text, and error summaries programmatically.
- Announce toasts and state changes with suitable live regions without repeatedly interrupting the user.
- Meet WCAG AA contrast for text, icons, borders conveying state, and focus indicators.

## Content conventions

- Prefer explicit operational copy: `Approve for delivery`, `Hold 8 affected drafts`, `QA sample set to 100%`.
- Avoid vague labels such as `Submit`, `Process`, `AI result`, or `Fix` when a precise action is available.
- Dates display as `Aug 2, 2026`; times display as `4:00 PM ET`. Full timestamps may appear in audit history.
- Percentages use whole numbers unless a decimal is meaningful. Confidence always includes a qualitative label.
- Empty states explain why no records are present and what action, if any, changes that state.
- Never claim a real email was sent, a real form was processed, or a live policy was changed. Use `Simulated` in confirmation details where ambiguity is possible.

## Definition of design fidelity

A screen matches this design when it:

- clearly belongs to the same shell and token system as every other route;
- exposes operational state, reason, and next action without relying on color alone;
- uses the prescribed dense enterprise patterns rather than generic card grids;
- preserves the main transcript scenario and cross-screen state transitions;
- contains no dead enabled controls or inaccessible interaction shortcuts; and
- remains usable at 1366×768 without hiding the primary workflow.
