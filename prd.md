# Build Instructions: SSI AI Correspondence Platform Interactive Mockup

## Objective

Build a polished, clickable frontend prototype for an AI correspondence and document-intake platform designed for colleges and universities.

The prototype will be used in early discussions with SSI leadership. It must demonstrate the product experience and operating model without using real institutional data, live Microsoft integrations, a backend, or an AI model.

The application should feel like a credible enterprise Microsoft 365-adjacent product rather than a generic AI chatbot.

## Technical Stack

Use:

* Vite
* React
* TypeScript
* React Router
* Lucide React icons
* Tailwind CSS or well-structured CSS modules
* Static JSON files for all data
* React Context or a lightweight local state store
* `localStorage` for optional demo-state persistence

Do not add:

* A backend
* A database
* Authentication
* Microsoft Graph
* Azure services
* External APIs
* LLM calls
* Real student or institutional data
* Complex state-management libraries unless clearly necessary

The application must run with:

```bash
npm install
npm run dev
```

## Product Context

The platform supports multiple schools, departments, and Microsoft 365 shared or group mailboxes.

Initial departments represented in the mockup should include:

* Registrar
* Admissions
* Financial Aid
* Student Accounts
* Human Resources

The platform monitors incoming departmental email, classifies requests, drafts responses from approved knowledge, stages responses before simulated outbound email delivery, randomly selects a configurable percentage for human QA, processes attached forms, and allows authorized users to control agent autonomy. This is customer correspondence delivery, not a software release process.

All displayed data must be clearly fictional.

Add a persistent header label:

> Demonstration Environment — Fictional Data

## Attachment and Document-Intake Model

Treat email attachments as first-class incoming artifacts. An attachment is not automatically a form and must not be conflated with an extracted-form record.

The demonstrated processing pipeline is:

1. Receive an email containing zero, one, or multiple attachments.
2. Identify each attachment's basic file type, such as PDF, image, Word document, spreadsheet, or unknown binary.
3. Classify each document independently against the catalog of configured form definitions and supported versions.
4. Show the predicted form type, matched version, classification confidence, alternative candidates, and whether human confirmation is required.
5. For matched forms, extract fields into the configured canonical schema.
6. Validate required fields and business rules defined by the matched form version.
7. Route unmatched, unsupported, ambiguous, or invalid documents for human review.
8. Use the resulting attachment assessments to influence the email's response, routing, risk, and delivery status.

Configured forms are reusable classification targets and extraction schemas. They define:

* Form name and document category
* Supported versions
* Accepted file formats
* Classification cues or reference description
* Required and optional fields
* Canonical-field mappings
* Validation rules
* Classification and extraction confidence thresholds
* Review and routing behavior

A reviewer-confirmed classification becomes the adjudicated ground truth for that specific incoming attachment.

## Primary Demo Scenario

Create one complete clickable workflow centered on this scenario:

A student sends an email to the Registrar mailbox asking about a transcript request and attaches an incomplete transcript authorization form plus a supporting image that is not a configured form.

The platform should:

1. Display the email in the Registrar work queue.
2. Classify it as a transcript request.
3. Display a knowledge-grounded proposed response.
4. Show the relevant knowledge sources.
5. Classify the PDF as the configured Official Transcript Authorization form, version 2026.1.
6. Show the supporting image as a separate unmatched/supporting document.
7. Extract the authorization fields and identify that the matched form is missing a signature.
8. Stage the response for scheduled delivery.
9. Mark the response as selected through random QA sampling.
10. Allow the reviewer to adjust the response tone using predefined refinement actions.
11. Allow the reviewer to approve the response.
12. Move the response into the Delivery Queue.
13. Demonstrate that a policy change can increase QA to 100% and hold affected staged drafts.

The prototype does not need real AI. Every simulated AI action should use predefined static outputs.

## Application Navigation

Create a persistent left navigation containing:

* Program Dashboard
* Work Queue
* Delivery Queue
* Agent Controls
* Knowledge
* Reporting
* Administration
* Improvement Queue

Form Review is not a standalone primary navigation destination. It is an attachment-review modal launched from a Work Queue request or the Response Workbench attachment list, preserving the originating request context and selected attachment.

Use a clean enterprise application shell with:

* Left navigation rail
* Top header
* Institution selector
* Department selector
* User avatar or role indicator
* Main content area
* Demo environment banner

## Required Screens

### 1. Program Dashboard

Show summary metrics across the fictional network.

Include cards for:

* Schools active
* Departments active
* Mailboxes monitored
* Emails processed
* Draft acceptance rate
* Automation rate
* QA rate
* Average response time
* Forms processed
* Exceptions requiring review

Include visual summaries for:

* Volume by department
* QA pass rate by institution
* Automation level by mailbox
* Recent knowledge changes
* Queue backlog

The dashboard should support switching between:

* Network view
* Institution view
* Department view

Charts may be simple CSS charts or a lightweight chart library.

### 2. Work Queue

Create a realistic queue table containing approximately 20 fictional emails.

Include columns:

* Sender
* Subject
* Institution
* Department
* Mailbox
* Request type
* Status
* Risk
* QA status
* Scheduled delivery
* Assigned user
* Received time

Add filters for:

* Institution
* Department
* Mailbox
* Status
* Risk level
* QA reason
* Request type
* Assigned user

Include representative statuses:

* New
* Classified
* Draft Ready
* QA Required
* Form Review Required
* Missing Information
* Specialist Review
* Approved
* Staged
* Delivered
* Held

Clicking a row should open the Response Workbench for that email.

### 3. Response Workbench

Use a three-panel layout.

#### Left panel

Display:

* Original email
* Sender information
* Conversation thread
* Attachments
* Per-attachment file type, document classification, match confidence, configured form/version, and review state
* Request classification
* Institution
* Department
* Mailbox
* Risk indicators

#### Center panel

Display:

* Editable proposed response
* Response status
* Tone profile
* Draft version
* Scheduled delivery time
* QA selection reason
* Save draft button
* Approve button
* Reject button
* Hold button
* Transfer button
* Escalate button

For the main transcript scenario, show:

> Selected for review through random QA sampling

The reviewer must be able to edit the response directly.

#### Right panel

Display:

* Supporting knowledge sources
* Grounding status
* Confidence indicators
* Missing-information warnings
* Required response elements
* Agent refinement controls
* Audit history

Add predefined refinement buttons:

* Make warmer
* Make more concise
* Explain missing documents
* Use approved transcript language
* Restore original draft

Each button should swap the draft with a predefined version. Do not generate text dynamically.

### 4. Delivery Queue

Display all staged responses awaiting simulated outbound email delivery. This is not a software release queue.

Include:

* Delivery batch
* Institution
* Department
* Mailbox
* Scheduled delivery time
* QA percentage
* Mandatory-review count
* Randomly selected count
* Approved count
* Held count
* Ready-for-delivery count

Allow the user to:

* Open a delivery batch
* Run simulated random QA selection
* Hold a batch
* Resume a batch
* Send approved responses
* Change delivery time
* Increase QA to 100%
* Pause automated delivery

For random QA simulation:

* Begin with an established delivery-batch population.
* Apply mandatory-review rules first.
* Select the configured percentage from remaining eligible drafts.
* Use JavaScript randomization for the demo.
* Record the selected items in the audit history.
* Make it clear that the agent does not choose which messages receive QA.

Add an explanatory tooltip:

> Random QA selection occurs after the delivery population is locked, preventing the agent or processing order from influencing the sample.

### 5. Attachment Review modal

Create an attachment-review modal launched from the originating Work Queue request or Response Workbench. It must retain the selected email and attachment, and return the reviewer to that request when closed.

When an email has multiple attachments, include an attachment selector and maintain independent classification/extraction state for each document.

#### Left side

Display a fictional transcript request form image or HTML representation.

Visually show:

* Student name
* Student ID
* Recipient
* Delivery method
* Signature field
* Missing signature warning

#### Right side

Display normalized structured fields:

* Student full name
* Student ID
* Request type
* Delivery recipient
* Delivery method
* Copy count
* Signature present
* Signature date
* Form version
* Extraction confidence
* Review status

Above the extracted fields, display the document-classification result:

* Incoming filename and file type
* Predicted configured form
* Matched form version
* Classification confidence
* Alternative candidates
* Confirmed, needs review, or unmatched status

Allow reviewers to confirm or correct the configured-form classification before approving extracted fields. Unmatched/supporting documents should have a credible preview and may be mapped to a configured form or retained as an unstructured supporting document.

Each field should include:

* Value
* Confidence score
* Valid or invalid status
* Validation message
* Approve or edit capability

Clicking a field should highlight the corresponding area on the form.

Include actions:

* Approve extraction
* Correct field
* Mark unreadable
* Request resubmission
* Save mapping
* Escalate

### 6. Agent Control Center

This screen is a major product differentiator.

Allow configuration by:

* Institution
* Department
* Mailbox
* Request type

Include controls for:

* Headless automation percentage
* Random QA percentage
* Mandatory human-review percentage
* Minimum grounding confidence
* Minimum extraction confidence
* Scheduled delivery time
* Delivery frequency
* Business-hours-only delivery
* Pause all delivery
* Pause one mailbox
* Set 100% QA
* Enable increased-QA mode
* Enable knowledge-change hold
* Select tone profile
* Require review for specified request types

Provide operating modes:

* Normal
* Increased QA
* Full Review
* Paused
* Knowledge Change
* Emergency Hold

Show a sample configuration:

```text
Registrar Mailbox
Headless automation: 70%
Random QA sample: 20%
Mandatory high-risk review: 100%
Delivery time: 4:00 PM
Current mode: Increased QA
```

Changing controls should update visible state in the prototype.

### 7. Knowledge Governance

Create a table of fictional knowledge articles.

Include columns:

* Title
* Institution
* Department
* Topics
* Owner
* Approval status
* Effective date
* Expiration date
* Last reviewed
* Version
* Affected draft count

Include statuses:

* Draft
* Pending Approval
* Approved
* Superseded
* Expired
* Under Review

Add a knowledge-change workflow.

When the user marks the fictional transcript policy as changed:

* Display a warning that staged drafts may be affected.
* Show the number of affected drafts.
* Offer actions:

  * Revalidate drafts
  * Increase QA to 100%
  * Hold delivery batch
  * Continue with current settings
* Reflect the selected action in Agent Controls and Delivery Queue.

### 8. Reporting

Create grant- and leadership-oriented reporting.

Show:

* Emails processed
* Staff review rate
* Headless delivery rate
* Draft acceptance rate
* Average staff edit percentage
* Response-time reduction
* Forms normalized
* Missing forms detected
* QA pass rate
* Escalation rate
* Estimated staff hours saved
* Performance by school
* Performance by department
* Knowledge gaps identified

Use fictional but internally consistent numbers.

### 9. Administration

Include configuration sections for:

* Institutions
* Departments
* Mailboxes
* Users
* Roles
* Knowledge sources
* Form types
* Canonical fields
* Routing rules
* Escalation rules
* Delivery schedules
* QA policies
* Tone profiles
* Retention settings

These screens only need to appear functional. Use modal forms and local state updates.

The Form Types section represents the configured classification catalog, not previously extracted form instances. Show form definitions, supported versions/file types, classification thresholds, required canonical fields, and status.

### 10. Improvement Queue

Create a governed QA learning-loop screen at `/improvement-queue`. This screen is a frontend-only, deterministic simulation of how reviewed correspondence and document-intake feedback can inform a candidate improvement; it is not live training, automatic model learning, or autonomous deployment.

Show structured feedback collected from QA approvals, reviewer edits, rejections, attachment-classification corrections, and extraction-field corrections. Aggregate the fixtures into visible recurring patterns with counts, examples, affected workflows, and a proposed improvement hypothesis.

Required actions:

* Run simulated evaluation against a predefined offline holdout result.
* Review deterministic quality, safety, and policy-grounding results.
* Approve and activate a version only after the evaluation is visible and a human explicitly confirms.
* Dismiss a candidate improvement with visible local feedback.
* Show active-version monitoring and a rollback control after activation.

Never silently self-train, update a model, or auto-deploy from one review or one aggregate pattern. Activation is a simulated, human-approved, versioned change; monitoring and rollback are simulated local state only.

## Static Data

Store mock data in JSON or typed TypeScript files.

Recommended files:

```text
src/data/
├── institutions.json
├── departments.json
├── mailboxes.json
├── users.json
├── emails.json
├── knowledge.json
├── form-definitions.json
├── extracted-forms.json
├── document-assessments.json
├── release-batches.json
├── audit-events.json
└── metrics.json
```

Create approximately:

* 4 fictional institutions
* 5 departments
* 8 mailboxes
* 20–25 emails
* 8–12 knowledge articles
* 4 forms
* 3 delivery batches
* 6 users

Include a representative mix of:

* Auto-deliver eligible emails
* Random QA selections
* Mandatory QA
* Missing knowledge
* Form extraction
* Missing signature
* Cross-department routing
* Specialist escalation
* Knowledge-change holds
* Scheduled deliveries
* High-risk requests
* Low-confidence classifications

Do not use real colleges, student names, addresses, email accounts, or student identifiers.

## Suggested Data Model

Use TypeScript interfaces for:

```ts
Institution
Department
Mailbox
User
EmailMessage
EmailThread
Attachment
AgentAssessment
ResponseDraft
KnowledgeSource
ExtractedForm
ExtractedField
FormDefinition
FormVersion
DocumentAssessment
ExtractionRun
ReleaseBatch
QaPolicy
AuditEvent
```

Each email should include:

* Institution
* Department
* Mailbox
* Request type
* Risk level
* Current status
* Agent confidence
* Grounding state
* QA state
* Draft
* Attachments
* Audit events

Each attachment should include its physical file metadata and an independent document assessment. Extracted-form instances must link to both the attachment and the configured form definition/version used as their schema.

## Required Interactions

The following controls must work:

* Navigate between screens
* Filter the work queue
* Open an email
* Edit a draft
* Apply predefined refinements
* Approve a draft
* Hold a draft
* Transfer a request
* Escalate a request
* Open an attachment
* Switch between multiple attachments on an email
* Confirm or correct an attachment's configured-form classification
* Map an unmatched attachment to a configured form or retain it as supporting material
* Correct an extracted field
* Approve form extraction
* Change QA percentage
* Change automation percentage
* Pause delivery
* Set 100% QA
* Run a simulated random QA sample
* Mark a knowledge article as changed
* Hold affected drafts
* Move an approved response to the Delivery Queue
* Simulate sending a delivery batch
* Reset the demonstration

Add a Reset Demo button that restores the original JSON-derived state.

## First-visit welcome

On the first visit only, show an accessible welcome modal after the application shell loads. It must introduce the business problem—high-volume institutional correspondence and document intake need safe, traceable automation with human oversight—and explain that this demonstration shows triage, evidence-grounded drafting, form validation, QA, controlled outbound email delivery, and policy governance.

Keep the modal concise and include a recommended walkthrough: **Program Dashboard → Work Queue → Transcript Response Workbench → Attachment Review → Delivery Queue → Agent Controls → Knowledge**. State clearly that every record, outcome, and action is fictional and simulated locally; no live email, student data, integrations, or AI service is used. Close with a pointer to the persistent **About this screen** control for route-specific help later in the walkthrough.

The user may dismiss the modal. Persist that dismissal in `localStorage` under a versioned, dedicated key such as `ssi-correspondence-welcome-dismissed-v1`, so it does not reappear on later visits. The welcome dismissal is presentation preference, not demo business state; Reset Demo should not silently re-show the modal.

## Route-specific onboarding

Place a persistent `About this screen` button in the application header immediately beside `Reset Demo`. On every primary screen, it opens a route-specific, keyboard-accessible onboarding modal. The modal is informational only: it must not change local demo state and must include four labeled sections: **What exists**, **Business case**, **Pain solved**, and **Possible additions**.

Provide concise route-specific content for Program Dashboard (network health and leadership oversight), Work Queue (filterable correspondence triage), Response Workbench (reviewable draft and evidence), Delivery Queue (locked-batch delivery governance), Agent Controls (scoped automation and QA policy), Knowledge (policy governance and impact), Reporting (measurable program value), Administration (controlled configuration, including the form-definition catalog), and Improvement Queue (governed QA learning loop). Each modal must explain the relevant operational pain it addresses and one or more plausible future additions without implying a live integration.

The attachment-review modal should likewise explain the document-intake path: incoming artifact → configured form/version classification → canonical extraction → validation. It must state that configured form definitions are the ground truth, that unmatched artifacts may remain supporting material, and may cite visual mapping or exception handling as future additions.

## Guided demo tour

Provide a persistent `Start guided demo` entry point that launches a restartable, keyboard-accessible spotlight tour. The tour is a presentation aid only: it must never auto-mutate fixture-derived demo state, approve a draft, alter a policy, or otherwise trigger a workflow action.

The guided sequence moves through Dashboard, Work Queue, the Registrar transcript Response Workbench, attachment intake, Delivery Queue, Knowledge, Agent Controls, and finishes at Improvement Queue. Each step navigates to its required route or attachment-review context, highlights the relevant visible target, and explains the business value of that screen in concise leadership-facing copy.

Show step progress and provide `Back`, `Next`, and `Exit` controls. `Start guided demo` must restart the sequence from the first step at any time. Tour controls, focus movement, and route changes must be keyboard operable. If a target is unavailable because of a viewport, route, reset, or rendering condition, show a clear fallback message with a `Continue` action rather than blocking the tour or failing silently.

## UX and Visual Style

Use a restrained Microsoft enterprise-inspired design:

* Neutral white and light-gray surfaces
* Blue accent color
* Dark text
* Compact tables
* Clear status badges
* Strong spacing and alignment
* Minimal gradients
* Accessible contrast
* Consistent icons
* Professional typography
* Desktop-first layout

The product should communicate:

* Control
* Traceability
* Safety
* Human oversight
* Institutional separation
* Operational maturity

Avoid:

* Futuristic AI imagery
* Excessive animation
* Chatbot-first layouts
* Neon colors
* Large decorative graphics
* Consumer-style cards everywhere

## Accessibility

Include:

* Keyboard-accessible navigation
* Visible focus states
* Semantic HTML
* Proper button labels
* Form labels
* Sufficient color contrast
* Statuses represented by both color and text
* Responsive behavior for smaller laptop screens

## Project Structure

Use a maintainable structure similar to:

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

Do not place the entire application in one file.

## Implementation Standards

* Enable TypeScript strict mode.
* Avoid `any`.
* Use reusable components.
* Keep mock business logic separate from UI components.
* Add clear comments only where logic is not self-explanatory.
* Avoid unnecessary abstraction.
* Use stable IDs for all mock records.
* Ensure filters and buttons do not throw runtime errors.
* Ensure all routes load directly when refreshed.
* Add a clear README.

## README Requirements

Document:

* Purpose of the prototype
* Technology stack
* Installation
* Development command
* Production build command
* Project structure
* Mock-data approach
* How to reset demo state
* Main demo workflow
* Explicit statement that there are no live integrations or real data

## Acceptance Criteria

The prototype is complete when:

1. It starts successfully with `npm run dev`.
2. All primary screens are accessible from navigation; attachment review is accessible from an email's attachment list rather than the persistent navigation.
3. The main transcript scenario can be demonstrated end to end.
4. Queue filters work.
5. Draft editing and predefined refinement actions work.
6. Form review and field correction work.
7. Attachments are independently classified against configured form definitions, including matched and unmatched examples.
8. Agent-control settings update the interface.
9. Random QA selection can be simulated.
10. Knowledge changes can place staged drafts on hold.
11. Approved drafts can move through the Delivery Queue.
12. Demo state can be reset.
13. Improvement Queue aggregates structured QA and document-intake feedback, runs only deterministic simulated offline evaluation, and requires human approval before versioned activation or simulated rollback.
14. No live APIs, backend, authentication, or AI services are used.
15. The interface is polished enough to share with executive stakeholders.

## Delivery Instructions

After implementation:

1. Run the application and resolve all browser-console errors.
2. Run the production build and resolve all TypeScript or build errors.
3. Review every route for missing data or broken interactions.
4. Confirm that no real personal or institutional data appears.
5. Provide a concise implementation summary.
6. List any intentionally simulated behaviors.
7. List the commands needed to run the project.
8. Do not add features outside this scope until the core demo workflow is complete.
