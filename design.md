# Design Instructions: ORA AI Correspondence Platform Prototype

> **Status: superseded reference.** The implemented mock and current product direction are governed by `prd.md`, `DESIGN.md`, and `AGENTS.md`. In particular, `DESIGN.md` defines the attachment-classification pipeline and the approved lightweight CSS implementation. Do not use the dependency or component-installation instructions in this legacy draft.

## Objective

Refine the existing Vite, React, and TypeScript prototype into a polished enterprise product mockup suitable for presentation to ORA leadership and participating institutions.

The application already represents an AI correspondence and document-intake platform supporting multiple schools, departments, and Microsoft 365 shared or group mailboxes.

Focus this task on visual design, usability, information hierarchy, interaction clarity, and presentation quality.

Do not add a backend, real AI, authentication, Microsoft integrations, or new product scope unless required to complete the existing user experience.

## Design Goal

The prototype should look like a credible enterprise operations platform that could be deployed within a higher-education Microsoft environment.

It should communicate:

* Operational control
* Human oversight
* Institutional trust
* Security
* Auditability
* Configurable automation
* Clear exception handling
* Multi-school scalability

The design should not look like:

* A generic chatbot
* A futuristic AI concept
* A consumer email client
* A marketing dashboard
* A collection of disconnected admin templates
* A low-code application
* A Microsoft product copy

The product should feel familiar to Microsoft 365 users while retaining an independent and professional identity.

## UI Stack

Vite
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
React Router
TanStack Table
Recharts

### Components to install

```text
npx shadcn@latest init
npx shadcn@latest add \
  alert \
  alert-dialog \
  avatar \
  badge \
  breadcrumb \
  button \
  calendar \
  card \
  checkbox \
  command \
  dialog \
  drawer \
  dropdown-menu \
  input \
  label \
  pagination \
  popover \
  progress \
  radio-group \
  scroll-area \
  select \
  separator \
  sheet \
  skeleton \
  slider \
  switch \
  table \
  tabs \
  textarea \
  toast \
  tooltip
```

Depending on the current CLI version, the notification component may be called sonner instead of toast.

Add:
npm install @tanstack/react-table recharts lucide-react

### Where to use each library

|Requirement|Component/Library|
|---|---|
|Work Queue|TanStack Table + shadcn Table|
|Filter menus|Select, Popover, Command|
|Response Workbench|Tabs, Textarea, ScrollArea|
|Knowledge evidence|Accordion or collapsible cards|
|Agent controls|Slider, Switch, Select|
|Release confirmation|AlertDialog|
|Knowledge detail|Sheet|
|Form correction|Input, Select, Checkbox|
|Status and risk|Badge|
|Reporting|Recharts|
|Notifications|Sonner|
|Navigation icons|Lucide React|

## Primary Design Principles

### 1. Operations First

The interface should prioritize:

* Work requiring attention
* Risk and exception visibility
* Clear ownership
* Release status
* QA decisions
* Knowledge support
* Next actions

Decorative metrics should never compete with operational tasks.

### 2. Progressive Disclosure

Show essential information first and reveal technical or audit detail when needed.

For example:

* Show “Grounded” as the primary status.
* Place confidence details and source metadata in expandable sections.
* Show the primary exception reason before the full audit history.
* Keep administrative configuration separate from everyday reviewer actions.

### 3. Clear Human Control

Users must always understand:

* What the agent did
* Why the agent made a recommendation
* Whether a response will be released automatically
* Whether QA is required
* What action the user is approving
* What will happen next
* How to stop or reverse an automated process

### 4. Consistent Risk Communication

Use consistent visual language for:

* Informational
* Successful
* Attention required
* Review required
* High risk
* Paused
* Blocked
* Released

Do not rely on color alone. Always include labels, icons, or explanatory text.

### 5. Dense but Readable

This is an enterprise operations product. Tables and workbench screens may be information-dense, but they must remain legible.

Use:

* Compact rows
* Clear grouping
* Strong alignment
* Predictable column widths
* Restrained borders
* Limited shadows
* Generous page-level spacing
* Small but readable typography

## Visual Direction

Use a restrained enterprise design system inspired by modern Microsoft and government administrative tools.

### Suggested palette

Use CSS variables or design tokens.

```css
:root {
  --color-primary: #2356a8;
  --color-primary-hover: #1b468a;
  --color-primary-soft: #eaf1fb;

  --color-background: #f5f6f8;
  --color-surface: #ffffff;
  --color-surface-muted: #f8f9fb;
  --color-border: #d9dde5;
  --color-border-strong: #bcc3cf;

  --color-text: #1f2937;
  --color-text-muted: #667085;
  --color-text-subtle: #8a94a6;

  --color-success: #237a4b;
  --color-success-soft: #e8f5ed;

  --color-warning: #9a6700;
  --color-warning-soft: #fff4d6;

  --color-danger: #b42318;
  --color-danger-soft: #fdecea;

  --color-info: #175cd3;
  --color-info-soft: #eaf2ff;
}
```

These values may be adjusted for contrast and consistency, but retain the restrained blue, neutral, and operational-status direction.

### Typography

Use a professional sans-serif font.

Preferred order:

1. Inter
2. Segoe UI
3. System UI

Suggested scale:

* Page title: 24–28px
* Section title: 18–20px
* Card title: 14–16px
* Body: 14px
* Table text: 13–14px
* Metadata: 12px

Avoid oversized headings and excessive bold text.

### Borders and shadows

Use borders more often than shadows.

Recommended:

* 1px neutral borders
* 6–10px border radius
* Very light shadow only for overlays, modals, or floating panels
* No heavy card shadows
* No glassmorphism
* No excessive rounded containers

## Application Shell

Refine the global application shell.

### Left navigation

Create a persistent left navigation with:

* Product identity
* Main navigation
* Administration section
* Settings or user area near the bottom

Navigation items:

* Dashboard
* Work Queue
* Release Queue
* Form Review
* Agent Controls
* Knowledge
* Reporting
* Administration

Requirements:

* Clear active state
* Icons from Lucide React
* Accessible labels
* Collapsible navigation optional
* Compact but not crowded
* Avoid oversized logos or branding blocks

### Top header

Include:

* Current institution selector
* Current department selector
* Optional mailbox selector
* Search or command entry
* Notifications
* User role or profile
* Demo environment badge

The label below must remain visible:

> Demonstration Environment — Fictional Data

Use a subtle but persistent presentation. It should not dominate the page.

### Context header

Each page should include:

* Page title
* Short operational description
* Relevant page actions
* Breadcrumb or contextual scope where useful

Example:

```text
Work Queue
Northbridge University / Registrar / registrar@northbridge.edu

Review, assign, and process inbound correspondence.
```

## Component Design System

Create or refine reusable components.

### Required shared components

* Button
* IconButton
* Input
* Select
* MultiSelect or filter menu
* Checkbox
* Radio group
* Toggle
* Slider
* Textarea
* Badge
* StatusBadge
* RiskBadge
* ConfidenceIndicator
* MetricCard
* Table
* FilterBar
* Tabs
* Drawer
* Modal
* Tooltip
* EmptyState
* Alert
* Banner
* Toast
* Timeline
* AuditEvent
* DetailList
* ProgressBar
* Skeleton or loading placeholder
* ConfirmationDialog

Components should have consistent sizes and states:

* Default
* Hover
* Focus
* Disabled
* Loading
* Error
* Selected

## Status System

Create a unified status system.

### Workflow statuses

* New
* Classified
* Draft Ready
* QA Required
* Form Review Required
* Missing Information
* Specialist Review
* Approved
* Staged
* Held
* Released
* Failed

### Suggested visual treatment

Use a small icon, short label, and soft background.

Examples:

```text
Draft Ready      blue
QA Required      amber
Approved         green
Held             red or dark amber
Released         neutral green
Missing Info     orange
Specialist       purple or indigo
```

Avoid assigning too many unrelated colors. Use typography and icons to reinforce meaning.

## Dashboard Design

The dashboard should provide an executive and operational overview without becoming a wall of cards.

### Top summary area

Show no more than six primary metrics:

* Emails processed
* Draft acceptance rate
* Headless automation rate
* QA pass rate
* Average response time
* Exceptions awaiting action

Use compact metric cards with:

* Metric
* Label
* Trend or comparison
* Small contextual note

### Operational section

Prioritize:

* Exceptions requiring attention
* Release batches approaching release
* Knowledge changes affecting drafts
* Mailboxes with unusual backlog
* Departments operating in increased QA mode

These should be more prominent than decorative analytics.

### Charts

Use charts only where they clarify a decision.

Recommended:

* Email volume by department
* QA pass rate by institution
* Automation rate by mailbox
* Response time trend
* Backlog by status

Keep chart colors restrained and consistent.

Do not use 3D charts, gauges, excessive donut charts, or decorative visualizations.

## Work Queue Design

The work queue is a core product screen.

### Layout

Use:

* Page header
* Summary or saved-view tabs
* Filter bar
* Dense table
* Pagination or record count
* Optional right-side detail preview

Suggested saved views:

* My Work
* QA Required
* Form Review
* Specialist Review
* Staged
* Held
* All Items

### Table behavior

Improve scanability using:

* Sticky header
* Row hover
* Selected-row state
* Clear column alignment
* Truncated text with tooltip
* Sort indicators
* Compact status badges
* Risk icon
* QA reason label
* Scheduled release indicator

Avoid horizontal overflow where possible.

Prioritize these columns:

1. Sender and subject
2. Department or mailbox
3. Request type
4. Status
5. Risk
6. QA
7. Scheduled release
8. Assigned user
9. Received time

Less important data can appear in the detail panel.

### Queue row interaction

Clicking a row should:

* Highlight the selected row
* Open the workbench or preview panel
* Preserve filter and scroll state when returning

## Response Workbench Design

This is the primary product demonstration screen.

Use a three-column desktop layout.

### Left column: source context

Include:

* Sender
* Subject
* Received time
* Institution
* Department
* Mailbox
* Request classification
* Original email
* Thread history
* Attachments

Use clear sections and collapsible thread history.

Attachments should display:

* File icon
* Filename
* Type
* Review status
* Warning indicator
* Open action

### Center column: response

Make the response draft visually dominant.

Include:

* Draft status
* Editable response area
* Tone profile
* Version
* Scheduled release
* QA reason
* Save state
* Word or character count optional

Primary actions:

* Approve
* Save
* Hold
* Escalate

Secondary actions:

* Transfer
* Reject
* Release now
* Restore draft

Use a sticky action bar at the bottom or top of the center panel.

Approval actions must clearly state the result:

* Approve for scheduled release
* Approve and release now
* Save without approval

Do not use ambiguous labels such as “Submit.”

### Right column: intelligence and control

Organize into tabs or stacked sections:

* Evidence
* Agent
* Validation
* Audit

#### Evidence

Show:

* Grounding status
* Supporting knowledge articles
* Quoted supporting passage
* Effective date
* Institution applicability
* Source owner

#### Agent

Show predefined refinement actions:

* Make warmer
* Make concise
* Explain missing documents
* Use approved language
* Restore original

Use buttons or command chips, not a large chatbot interface.

#### Validation

Show:

* Missing signature
* Required response points
* Unsupported claims
* Identity-verification requirements
* Knowledge warnings

#### Audit

Show a compact vertical timeline.

### Random QA treatment

For randomly selected responses, show a prominent but non-alarming banner:

> Random QA review required

Supporting text:

> This response was selected from the locked release population. Selection was independent of the response agent.

Include an informational tooltip or details link.

## Release Queue Design

Treat this as an operational control room.

### Summary

Show:

* Next release time
* Drafts in population
* Mandatory QA count
* Random QA count
* Approved
* Awaiting review
* Held
* Ready for release

### Release batches

Each batch should display:

* Institution
* Department
* Mailbox
* Release schedule
* Population size
* QA policy
* Current mode
* Release readiness
* Blocking issues

Use expandable rows or batch cards, but avoid oversized cards.

### Primary actions

* Run QA selection
* Hold batch
* Resume batch
* Increase QA
* Change release time
* Release approved items

Actions affecting many responses must use a confirmation dialog showing:

* Number of affected responses
* Current status
* Resulting status
* Whether external messages will be sent or only staged

### Release-readiness indicator

Use a clear progress or checklist:

* Population locked
* Mandatory rules applied
* Random sample selected
* QA complete
* Holds resolved
* Release approved

## Form Review Design

Use a document-review interface similar to enterprise document-intelligence tools.

### Left panel

Display the fictional form with:

* Page controls
* Zoom controls
* Current field highlight
* Missing signature indicator
* Page count
* Form version

The document may be represented as styled HTML or an image.

### Right panel

Group fields by section:

* Student
* Request
* Delivery
* Authorization
* Validation

Each field should show:

* Label
* Extracted value
* Confidence
* Validity
* Edit action
* Source highlight action

Use confidence sparingly. Prefer labels such as:

* High confidence
* Review recommended
* Low confidence

The raw percentage can appear as secondary detail.

### Validation summary

Add a top alert:

> Review required: Signature is missing.

Actions:

* Request resubmission
* Approve remaining fields
* Save correction
* Escalate

## Agent Control Center Design

This screen should clearly demonstrate user control over automation.

### Scope selector

At the top, allow selection of:

* Institution
* Department
* Mailbox
* Request type

Always show what level is being configured.

Example:

> Editing settings for Northbridge University / Registrar / Registrar Shared Mailbox

### Operating mode

Make the current operating mode prominent.

Modes:

* Normal
* Increased QA
* Full Review
* Paused
* Knowledge Change
* Emergency Hold

Use a segmented control or mode cards.

Each mode should include a short explanation of its impact.

### Controls

Group settings into:

#### Automation

* Headless automation percentage
* Eligible request types
* Minimum grounding threshold
* Minimum classification threshold

#### Quality assurance

* Random QA percentage
* Mandatory review rules
* Minimum review volume
* New-policy review requirement

#### Release

* Release schedule
* Business-hours restriction
* Batch release
* Pause release
* Release delay

#### Tone and response

* Tone profile
* Required language
* Signature template
* Department style guidance

Use sliders only when the value is naturally continuous. Pair sliders with numeric input and explanatory text.

### Change summary

When settings change, show a persistent change summary:

```text
Pending changes

Random QA: 20% → 100%
Operating mode: Normal → Knowledge Change
Affected staged drafts: 14
Next release: Held
```

Require explicit save or apply.

## Knowledge Governance Design

The knowledge area should look like a controlled policy library, not a generic file browser.

### Table

Include:

* Title
* Department
* Status
* Owner
* Effective date
* Last reviewed
* Version
* Affected drafts

### Detail drawer

Selecting an article should open:

* Summary
* Full content or preview
* Topics
* Institution applicability
* Department applicability
* Approval history
* Version history
* Related response types
* Affected drafts
* Change actions

### Knowledge-change workflow

When an article changes, show a modal with:

* Change summary
* Effective time
* Affected mailboxes
* Affected draft count
* Recommended action

Available actions:

* Revalidate staged drafts
* Increase QA to 100%
* Hold affected batches
* Continue current settings

The safest recommended action should be visually clear but not automatically selected.

## Reporting Design

Reporting is intended for ORA leadership, grant stakeholders, and operational managers.

### Executive report

Include:

* Schools participating
* Departments active
* Volume processed
* Response-time improvement
* Estimated staff hours saved
* QA pass rate
* Automation rate
* Forms normalized
* Knowledge gaps identified

### Comparisons

Allow comparison by:

* School
* Department
* Mailbox
* Time period
* Request type

### Reporting tone

Avoid overstating AI success.

Prefer labels such as:

* Responses approved without edits
* Responses requiring minor edits
* Responses escalated
* Unsupported requests identified
* Human-review coverage
* Estimated time saved

Do not imply verified savings unless the metric is clearly labeled as an estimate.

## Administration Design

Administration screens should use a consistent master-detail pattern.

Entities:

* Institutions
* Departments
* Mailboxes
* Users
* Roles
* Knowledge sources
* Form types
* Routing rules
* Escalation rules
* QA policies
* Release schedules
* Tone profiles
* Retention settings

Use:

* Table or list on the left
* Detail form or drawer on the right
* Clear create, edit, archive, and save actions
* Validation messages
* Unsaved-change warnings

## Empty, Loading, and Error States

Design realistic states for:

### Empty states

Examples:

* No responses require QA
* No staged releases
* No forms awaiting review
* No knowledge changes
* No results match filters

Each empty state should state:

* What happened
* Whether action is needed
* What the user can do next

### Error states

Examples:

* Mailbox sync unavailable
* Draft generation failed
* Knowledge retrieval unavailable
* Release failed
* Attachment could not be processed

Errors should include:

* Clear summary
* User impact
* Retry action
* Escalation or detail option

Do not show raw technical stack traces.

### Loading states

Use skeletons for:

* Tables
* Metric cards
* Workbench panels
* Document preview

Avoid full-page spinners.

## Responsive Behavior

The primary target is desktop and laptop.

Support:

* 1440px desktop
* 1280px laptop
* 1024px compact laptop or tablet landscape

At narrower widths:

* Collapse left navigation
* Convert three-panel workbench into tabbed or stacked panels
* Preserve primary actions
* Allow table horizontal scroll only as a last resort

Mobile optimization is not required for this prototype.

## Accessibility Requirements

Verify:

* Keyboard navigation
* Logical tab order
* Visible focus states
* Proper button text
* Form labels
* Table headers
* Accessible modal focus trapping
* Escape-to-close behavior
* Contrast compliance
* Status labels beyond color
* Minimum 44px target for critical touch actions where practical

## Interaction and Motion

Use subtle motion only to communicate state.

Allowed:

* Drawer transitions
* Modal fade
* Toast appearance
* Expand and collapse
* Status update animation
* Small loading indicators

Avoid:

* Page transition animations
* Large motion effects
* Bouncing icons
* Animated gradients
* Decorative parallax

## Demo Presentation Quality

Ensure the prototype is visually ready for a leadership demonstration.

The primary demo path should feel intentional:

1. Open the dashboard.
2. Navigate to the Registrar queue.
3. Select the transcript request.
4. Review the random-QA notice.
5. Review the supporting knowledge.
6. Open the attached form.
7. Identify the missing signature.
8. Refine the response.
9. Approve it for scheduled release.
10. Open Agent Controls.
11. Change the mailbox to Knowledge Change mode.
12. Set QA to 100%.
13. Show the affected release batch being held.
14. Review network-level reporting.

Use fictional data that supports this narrative consistently across screens.

## Implementation Guidance

Before redesigning:

1. Inspect the existing component structure.
2. Preserve all working routes and interactions.
3. Identify reusable components before duplicating UI.
4. Create centralized design tokens.
5. Create a consistent spacing and type scale.
6. Replace inconsistent one-off styles.
7. Preserve existing mock-data behavior.
8. Do not rewrite working business logic without need.

## Design QA Checklist

Confirm that:

* Every page uses the same application shell.
* Page titles and actions align consistently.
* Status colors are used consistently.
* Buttons use a clear primary and secondary hierarchy.
* Destructive actions are distinguishable.
* Tables are readable at 1280px.
* Filters do not visually overwhelm tables.
* Workbench panels remain usable at laptop widths.
* Modal actions clearly state outcomes.
* Agent controls always show their configuration scope.
* Knowledge changes visibly affect releases and QA.
* Random QA is clearly explained.
* Demo data is visibly fictional.
* No placeholder lorem ipsum remains.
* No button appears functional when it has no behavior.
* All icons have labels or tooltips where needed.
* Browser console remains free of errors.
* Production build succeeds.

## Delivery Requirements

After completing the design pass:

1. Run the development server and inspect every route.
2. Test the main demo scenario end to end.
3. Test the application at 1440px, 1280px, and 1024px widths.
4. Run the production build.
5. Resolve TypeScript, layout, and browser-console errors.
6. Provide a concise summary of design improvements.
7. List any screens that still use simplified mock behavior.
8. Include screenshots of:

   * Dashboard
   * Work Queue
   * Response Workbench
   * Form Review
   * Agent Control Center
   * Release Queue
9. Do not add new product features until the design system and main workflow are complete.
