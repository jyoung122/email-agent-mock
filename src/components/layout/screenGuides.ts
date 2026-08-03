export type ScreenGuide = {
  screen: string
  purpose: string
  exists: string[]
  businessCase: string
  painSolved: string
  additions: string[]
  firstAction: string
}

const guides: Record<string, ScreenGuide> = {
  dashboard: {
    screen: 'Program Dashboard',
    purpose: 'A network-level operating view of correspondence volume, automation, exceptions, quality, and knowledge health.',
    exists: ['Executive metrics for volume, backlog, QA, and delivery readiness', 'Comparisons across institutions and departments', 'Exception and knowledge-health summaries', 'Shortcuts into queues that need attention'],
    businessCase: 'Leaders can see whether the service is improving response operations without reading individual messages or assembling reports manually.',
    painSolved: 'Replaces fragmented mailbox reporting and delayed status updates with one shared view of throughput, risk, and intervention needs.',
    additions: ['Trend comparison against prior periods', 'Drill-down from every metric into its source population', 'Capacity forecasts and staffing scenarios'],
    firstAction: 'Start with the exception counts, then open Work Queue to inspect the messages driving them.',
  },
  workQueue: {
    screen: 'Work Queue',
    purpose: 'The operational inbox for finding, prioritizing, and opening correspondence that needs attention.',
    exists: ['Search and filters across institution, department, mailbox, status, risk, and QA reason', 'Queue-level counts for required review, form issues, and held items', 'A unified table of fictional inbound requests and operating state', 'Direct access to the response workbench for each request'],
    businessCase: 'A shared queue lets specialized teams manage work consistently across many mailboxes while preserving assignment, urgency, and policy context.',
    painSolved: 'Reduces mailbox switching, manual triage, lost ownership, and inconsistent prioritization of high-risk or incomplete requests.',
    additions: ['Saved views and team-specific queue presets', 'Bulk assignment, hold, and routing actions', 'Service-level timers and workload balancing'],
    firstAction: 'Open the highlighted transcript request to see the complete review workflow.',
  },
  workbench: {
    screen: 'Response Workbench',
    purpose: 'A single-request workspace that combines the original email, attachment review, proposed response, evidence, controls, and audit history.',
    exists: ['Original thread, sender, classification, institution, and risk context', 'Attachment cards that open classification and extraction in a modal', 'An editable predefined response with refinement and approval controls', 'Supporting knowledge, missing-information warnings, requirements, and audit events'],
    businessCase: 'Reviewers can make a delivery decision from one evidence-rich workspace instead of reconstructing context across email, forms, policies, and separate tools.',
    painSolved: 'Prevents context switching, unsupported responses, overlooked attachment issues, and approvals without a visible evidence trail.',
    additions: ['Side-by-side response version comparison', 'Internal reviewer comments and mentions', 'Student-record lookup and downstream case integration'],
    firstAction: 'Open an attachment to review its classification, then inspect the grounded response before approval.',
  },
  releaseQueue: {
    screen: 'Delivery Queue',
    purpose: 'The controlled staging area for QA-selected and approved responses before simulated delivery.',
    exists: ['Delivery batches grouped by institution, department, and mailbox', 'Locked population, mandatory review, random QA, approved, held, and delivered counts', 'Controls for schedule, hold, resume, QA expansion, and delivery', 'Confirmation safeguards for consequential actions'],
    businessCase: 'Batching separates response creation from delivery so teams can enforce sampling, timing, and final operational control.',
    painSolved: 'Avoids immediate unsupervised sends, opaque QA selection, and accidental delivery of held or policy-affected correspondence.',
    additions: ['Calendar and blackout-window management', 'Pre-delivery exception reports', 'Two-person approval for sensitive batches'],
    firstAction: 'Open the Registrar batch and compare approved, sampled, and held populations before delivery.',
  },
  controls: {
    screen: 'Agent Controls',
    purpose: 'The governance surface for configuring automation, QA, confidence, delivery, and emergency operating modes.',
    exists: ['Operating modes from normal automation through full review and pause', 'QA percentages and confidence thresholds', 'Delivery timing and business-hours safeguards', 'Visible knowledge-change and emergency controls'],
    businessCase: 'Policy owners can tune automation to risk and changing conditions without changing application code or relying on informal instructions.',
    painSolved: 'Replaces hidden model behavior and ad hoc operational reactions with explicit, reviewable controls that affect shared workflow state.',
    additions: ['Effective-dated control versions and approval history', 'Policy simulation before activation', 'Role-based limits for sensitive settings'],
    firstAction: 'Review the current operating mode and the Registrar QA policy before changing delivery behavior.',
  },
  knowledge: {
    screen: 'Knowledge',
    purpose: 'The governed library of approved guidance used to ground proposed correspondence.',
    exists: ['Institution- and department-scoped knowledge articles', 'Approval, review, effective-date, and version status', 'Approved response language and ownership', 'Impact handling when a policy change affects staged drafts'],
    businessCase: 'Responses can be tied to approved institutional guidance, giving policy owners a manageable source of truth for communications.',
    painSolved: 'Reduces outdated answers, policy drift, duplicated templates, and uncertainty about which language is approved for use.',
    additions: ['Source-document ingestion and change detection', 'Article-level usage and outcome analytics', 'Approval workflows with comments and legal review'],
    firstAction: 'Open the transcript policy article and demonstrate how a change affects staged work.',
  },
  improvementQueue: {
    screen: 'Improvement Queue',
    purpose: 'A governed feedback loop for turning reviewer decisions and operational patterns into candidate improvements without silent self-training.',
    exists: ['QA feedback and reviewer corrections collected as traceable improvement signals', 'Pattern aggregation that groups recurring misses, edits, and knowledge gaps', 'Simulated evaluation results before a candidate change can move forward', 'Human-approved version activation and post-activation monitoring'],
    businessCase: 'Teams can improve correspondence quality over time while retaining institutional oversight of what changes, why it changes, and when it becomes active.',
    painSolved: 'Avoids scattered reviewer feedback, repeated operational mistakes, and uncontrolled model or policy changes that cannot be explained to stakeholders.',
    additions: ['Evaluation cohorts segmented by institution and request type', 'Approval workflows with reviewer rationale and version comparison', 'Production monitoring for drift, rollback, and quality thresholds'],
    firstAction: 'Review the highest-impact pattern, inspect its simulated evaluation, then trace the required human approval before activation.',
  },
  reporting: {
    screen: 'Reporting',
    purpose: 'An outcome and performance view for evaluating operational value across the fictional network.',
    exists: ['Scope and reporting-period controls', 'Hours saved, response-time, automation, QA, and normalization metrics', 'Institution and department comparisons with exact values', 'Knowledge-gap and improvement signals'],
    businessCase: 'Program sponsors can connect the correspondence workflow to measurable efficiency, quality, and service outcomes.',
    painSolved: 'Eliminates spreadsheet-heavy reporting and prevents headline percentages from being separated from their underlying counts.',
    additions: ['Scheduled exports and stakeholder subscriptions', 'Cost-per-request and avoided-work estimates', 'Cohort, channel, and request-type analysis'],
    firstAction: 'Compare institution performance, then inspect the knowledge gaps that limit automation.',
  },
  administration: {
    screen: 'Administration',
    purpose: 'The configuration catalog for organizational scope, users, routing, safeguards, form definitions, and canonical fields.',
    exists: ['Institution, department, mailbox, user, and role records', 'Configured form definitions used as attachment-classification ground truth', 'Canonical extraction fields and validation rules', 'Routing, escalation, delivery, QA, tone, and retention settings'],
    businessCase: 'A governed configuration layer allows one platform to support multiple institutions and workflows without hard-coding every operating difference.',
    painSolved: 'Reduces inconsistent setup, undocumented routing, and form-processing logic scattered across teams and individual mailboxes.',
    additions: ['Import, duplication, and environment promotion tools', 'Configuration validation and dependency warnings', 'Change approvals, rollback, and full audit history'],
    firstAction: 'Open Form types to see how configured definitions govern attachment classification and extraction.',
  },
}

export function guideForPath(pathname: string): ScreenGuide {
  if (/^\/work-queue\/[^/]+/.test(pathname)) return guides.workbench
  if (pathname.startsWith('/work-queue')) return guides.workQueue
  if (pathname.startsWith('/release-queue')) return guides.releaseQueue
  if (pathname.startsWith('/agent-controls')) return guides.controls
  if (pathname.startsWith('/knowledge')) return guides.knowledge
  if (pathname.startsWith('/improvement-queue')) return guides.improvementQueue
  if (pathname.startsWith('/reporting')) return guides.reporting
  if (pathname.startsWith('/administration')) return guides.administration
  return guides.dashboard
}
