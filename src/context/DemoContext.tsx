/* eslint-disable react-refresh/only-export-components -- demo context intentionally co-locates its hook */
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { createInitialDemoState, PRIMARY_RELEASE_BATCH_ID, TRANSCRIPT_KNOWLEDGE_ID } from '../data/mockData'
import type { AgentMode, Attachment, AuditEvent, DemoSelections, DemoState, EmailStatus, ExtractedField, ExtractedForm, ExtractionRun, FormDefinition, QaPolicy, ReleaseBatch } from '../types'

export type RefinementAction = 'warmer' | 'concise' | 'missing-documents' | 'approved-language' | 'restore'
export type KnowledgeImpactAction = 'revalidate' | 'increase-qa' | 'hold-batch' | 'continue'

export interface DemoActions {
  selectScope: (selection: Partial<DemoSelections>) => void
  selectAttachment: (emailId: string, attachmentId?: string) => void
  confirmAttachmentClassification: (attachmentId: string) => void
  correctAttachmentClassification: (attachmentId: string, formDefinitionId?: string, formVersionId?: string) => void
  updateDraft: (emailId: string, body: string) => void
  applyRefinement: (emailId: string, refinement: RefinementAction) => void
  saveDraft: (emailId: string) => void
  approveDraft: (emailId: string) => void
  holdDraft: (emailId: string, reason?: string) => void
  rejectDraft: (emailId: string) => void
  transferEmail: (emailId: string, departmentId: string, mailboxId?: string) => void
  escalateEmail: (emailId: string) => void
  selectFormField: (formId: string, fieldId: string) => void
  correctFormField: (formId: string, fieldId: string, value: string) => void
  approveFormField: (formId: string, fieldId: string) => void
  approveFormExtraction: (formId: string) => void
  requestResubmission: (formId: string) => void
  markFormUnreadable: (formId: string) => void
  updatePolicy: (policyId: string, changes: Partial<QaPolicy>) => void
  setReleasePaused: (paused: boolean) => void
  updateBatch: (batchId: string, changes: Partial<Pick<ReleaseBatch, 'scheduledReleaseAt' | 'status' | 'qaPercentage'>>) => void
  runRandomQa: (batchId: string) => void
  setBatchQaToFullReview: (batchId: string) => void
  holdBatch: (batchId: string) => void
  resumeBatch: (batchId: string) => void
  releaseBatch: (batchId: string) => void
  markKnowledgeChanged: (knowledgeId?: string) => void
  applyKnowledgeImpact: (action: KnowledgeImpactAction, knowledgeId?: string) => void
  resetDemo: () => void
}
export interface DemoContextValue extends DemoState, DemoActions {
  /** Nested aliases keep route code concise while the flat values remain convenient for shared UI. */
  state: DemoState
  actions: DemoActions
}
const DemoContext = createContext<DemoContextValue | null>(null)

const now = () => 'Aug 2, 2026 · 10:24 AM ET'
const event = (action: string, detail: string, partial: Omit<AuditEvent, 'id' | 'timestamp' | 'action' | 'detail' | 'actor'> = {}): AuditEvent => ({ id: `audit-local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: now(), actor: 'Morgan Lee', action, detail, ...partial })
const updateEmail = (state: DemoState, emailId: string, status: EmailStatus, extra: Partial<DemoState['emails'][number]> = {}): DemoState['emails'] => state.emails.map((emailRecord) => emailRecord.id === emailId ? { ...emailRecord, ...extra, status, draft: emailRecord.draft ? { ...emailRecord.draft, status } : undefined } : emailRecord)
const addEvent = (state: DemoState, next: Omit<AuditEvent, 'id' | 'timestamp' | 'actor'> & Partial<Pick<AuditEvent, 'actor'>>): DemoState => ({ ...state, auditEvents: [...state.auditEvents, event(next.action, next.detail, { emailId: next.emailId, draftId: next.draftId, formId: next.formId, attachmentId: next.attachmentId, batchId: next.batchId, knowledgeId: next.knowledgeId, ...(next.actor ? { actor: next.actor } : {}) })] })
const withAttachments = (state: DemoState, attachments: Attachment[]): Pick<DemoState, 'attachments' | 'emails'> => ({ attachments, emails: state.emails.map((email) => ({ ...email, attachments: attachments.filter((attachment) => attachment.emailId === email.id) })) })
const assessmentIdFor = (attachmentId: string) => `assessment-${attachmentId.replace('attachment-', '')}`
const extractionRunIdFor = (attachmentId: string) => `extraction-${attachmentId.replace('attachment-', '')}-corrected`
const extractedFormIdFor = (attachmentId: string) => `form-${attachmentId.replace('attachment-', '')}-corrected`
const fieldValue = (key: string, emailId: string) => {
  const primary = emailId === 'email-transcript-001'
  const values: Record<string, string> = { student_full_name: primary ? 'Alex Harper' : 'Reviewer-confirmed student', student_identifier: primary ? 'NFU-DEMO-4821' : 'DEMO-0001', request_type: 'Official transcript', delivery_recipient: primary ? 'Cascadia Graduate School' : 'Reviewer-confirmed recipient', delivery_method: 'Electronic delivery', copy_count: '1', authorization_signature: 'Present', signature_date: 'Aug 2, 2026', applicant_name: 'Reviewer-confirmed applicant', application_identifier: 'RDC-DEMO-0001', requested_change: 'Contact information update', attestation: 'Present', account_reference: 'PCTU-DEMO-0001', disputed_amount: '$0.00', dispute_reason: 'Reviewer-confirmed documentation' }
  return values[key] ?? 'Reviewer-confirmed value'
}
const regionFor = (key: string) => ({ student_full_name: 'student-name', student_identifier: 'student-id', request_type: 'request-type', delivery_recipient: 'recipient', delivery_method: 'delivery', copy_count: 'copies', authorization_signature: 'signature', signature_date: 'signature-date' }[key] ?? key)
const formForDefinition = (attachment: Attachment, definition: FormDefinition, versionId: string): ExtractedForm => {
  const version = definition.versions.find((item) => item.id === versionId) ?? definition.versions.find((item) => item.id === definition.activeVersionId)!
  const runId = extractionRunIdFor(attachment.id)
  return { id: extractedFormIdFor(attachment.id), emailId: attachment.emailId, attachmentId: attachment.id, extractionRunId: runId, formDefinitionId: definition.id, formVersionId: version.id, name: definition.name, studentDisplayName: fieldValue('student_full_name', attachment.emailId), studentId: fieldValue('student_identifier', attachment.emailId), formVersion: version.version, confidence: Math.max(definition.extractionThreshold, 92), reviewStatus: 'Pending review', fields: version.canonicalFields.map((field) => ({ id: `${extractedFormIdFor(attachment.id)}-${field.key}`, key: field.key, label: field.label, value: fieldValue(field.key, attachment.emailId), confidence: 96, validation: 'Valid', validationMessage: field.required ? 'Validated against configured rule' : 'Optional field accepted', region: regionFor(field.key), approved: false })) }
}

export function DemoProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DemoState>(createInitialDemoState)
  const selectScope = useCallback((selection: Partial<DemoSelections>) => setState((previous) => ({ ...previous, selections: { ...previous.selections, ...selection } })), [])
  const selectAttachment = useCallback((_emailId: string, attachmentId?: string) => setState((previous) => ({ ...previous, selections: { ...previous.selections, selectedAttachmentId: attachmentId } })), [])
  const confirmAttachmentClassification = useCallback((attachmentId: string) => setState((previous) => {
    const attachment = previous.attachments.find((item) => item.id === attachmentId)
    if (!attachment) return previous
    const assessmentId = attachment.documentAssessmentId ?? assessmentIdFor(attachment.id)
    const attachments = previous.attachments.map((item) => item.id === attachmentId ? { ...item, documentAssessmentId: assessmentId, classificationStatus: 'Confirmed' as const } : item)
    const assessment = { id: assessmentId, attachmentId, classificationStatus: 'Confirmed' as const, predictedFormDefinitionId: attachment.predictedFormDefinitionId, predictedFormVersion: attachment.predictedFormVersion, confidence: attachment.classificationConfidence, alternatives: attachment.alternatives, assessedAt: now(), reviewedByUserId: previous.selections.userId, reviewNote: 'Classification confirmed by reviewer.' }
    const documentAssessments = previous.documentAssessments.some((item) => item.attachmentId === attachmentId) ? previous.documentAssessments.map((item) => item.attachmentId === attachmentId ? assessment : item) : [...previous.documentAssessments, assessment]
    return addEvent({ ...previous, ...withAttachments(previous, attachments), documentAssessments }, { action: 'Confirmed attachment classification', detail: `${attachment.fileName} classification confirmed for the simulated intake pipeline.`, emailId: attachment.emailId, attachmentId })
  }), [])
  const correctAttachmentClassification = useCallback((attachmentId: string, formDefinitionId?: string, formVersionId?: string) => setState((previous) => {
    const attachment = previous.attachments.find((item) => item.id === attachmentId)
    if (!attachment) return previous
    const definition = previous.formDefinitions.find((item) => item.id === formDefinitionId)
    const version = definition?.versions.find((item) => item.id === formVersionId) ?? definition?.versions.find((item) => item.id === definition.activeVersionId)
    const assessmentId = attachment.documentAssessmentId ?? assessmentIdFor(attachment.id)
    const generatedForm = definition && version ? formForDefinition(attachment, definition, version.id) : undefined
    const generatedRun: ExtractionRun | undefined = definition && version && generatedForm ? { id: generatedForm.extractionRunId!, attachmentId: attachment.id, emailId: attachment.emailId, formDefinitionId: definition.id, formVersionId: version.id, status: 'Extracted', validationStatus: 'Valid', confidence: generatedForm.confidence, createdAt: now(), extractedFormId: generatedForm.id } : undefined
    const corrected = { ...attachment, documentAssessmentId: assessmentId, classificationStatus: (definition ? 'Corrected' : 'Unmatched') as Attachment['classificationStatus'], predictedFormDefinitionId: definition?.id, predictedFormVersion: version?.version, classificationConfidence: definition ? 100 : 0, extractionRunId: generatedRun?.id, extractedFormId: generatedForm?.id, extractionStatus: definition ? 'Extracted' as const : 'Not applicable' as const, validationStatus: definition ? 'Valid' as const : 'Not run' as const, alternatives: definition ? [{ formDefinitionId: definition.id, formVersion: version?.version, label: definition.name, confidence: 100 }] : [{ label: 'No configured form match', confidence: 100 }] }
    const attachments = previous.attachments.map((item) => item.id === attachmentId ? corrected : item)
    const assessment = { id: assessmentId, attachmentId, classificationStatus: corrected.classificationStatus, predictedFormDefinitionId: corrected.predictedFormDefinitionId, predictedFormVersion: corrected.predictedFormVersion, confidence: corrected.classificationConfidence, alternatives: corrected.alternatives, assessedAt: now(), reviewedByUserId: previous.selections.userId, reviewNote: definition ? 'Classification corrected by reviewer.' : 'Reviewed and marked unmatched.' }
    const documentAssessments = previous.documentAssessments.some((item) => item.attachmentId === attachmentId) ? previous.documentAssessments.map((item) => item.attachmentId === attachmentId ? assessment : item) : [...previous.documentAssessments, assessment]
    const extractionRuns = generatedRun ? [...previous.extractionRuns.filter((item) => item.attachmentId !== attachmentId), generatedRun] : previous.extractionRuns.filter((item) => item.attachmentId !== attachmentId)
    const forms = generatedForm ? [...previous.forms.filter((item) => item.attachmentId !== attachmentId), generatedForm] : previous.forms.filter((item) => item.attachmentId !== attachmentId)
    return addEvent({ ...previous, ...withAttachments(previous, attachments), documentAssessments, extractionRuns, forms }, { action: 'Corrected attachment classification', detail: definition ? `${attachment.fileName} mapped to ${definition.name} ${version?.version ?? ''}.` : `${attachment.fileName} marked as unmatched.`, emailId: attachment.emailId, attachmentId })
  }), [])
  const updateDraft = useCallback((emailId: string, body: string) => setState((previous) => {
    const target = previous.emails.find((item) => item.id === emailId)
    if (!target?.draft) return previous
    return { ...previous, emails: previous.emails.map((item) => item.id === emailId ? { ...item, draft: { ...item.draft!, body } } : item) }
  }), [])
  const applyRefinement = useCallback((emailId: string, refinement: RefinementAction) => setState((previous) => {
    const target = previous.emails.find((item) => item.id === emailId)
    if (!target?.draft) return previous
    const texts: Record<RefinementAction, { label: string; body: string }> = {
      warmer: { label: 'Make warmer', body: target.draft.body.replace('Thank you for your transcript request.', 'Thank you for reaching out about your transcript request — we are glad to help.') },
      concise: { label: 'Make more concise', body: 'Hello Alex,\n\nYour authorization form is missing a signature. Please sign and return it to this mailbox. We will process your transcript request within three business days after receipt.\n\nSincerely,\nNorthstar Fictional University Registrar Services' },
      'missing-documents': { label: 'Explain missing documents', body: target.draft.body.replace('Our review found that the attached form is missing a signature.', 'Our review found that the authorization form needs your signature before we may release an official transcript.') },
      'approved-language': { label: 'Use approved transcript language', body: target.draft.body.replace('We can send an official transcript', 'Per the approved transcript policy, we may send an official transcript only after receiving a signed authorization') },
      restore: { label: 'Restore original draft', body: target.draft.originalBody },
    }
    const selected = texts[refinement]
    const emails = previous.emails.map((item) => item.id === emailId ? { ...item, draft: { ...item.draft!, body: selected.body, version: item.draft!.version + 1, refinementHistory: refinement === 'restore' ? [] : [...item.draft!.refinementHistory, selected.label] } } : item)
    return addEvent({ ...previous, emails }, { action: 'Applied predefined refinement', detail: `${selected.label} was applied to the simulated draft.`, emailId, draftId: target.draft.id })
  }), [])
  const saveDraft = useCallback((emailId: string) => setState((previous) => {
    const draft = previous.emails.find((item) => item.id === emailId)?.draft
    return draft ? addEvent(previous, { action: 'Saved draft', detail: `Draft version ${draft.version} saved locally.`, emailId, draftId: draft.id }) : previous
  }), [])
  const approveDraft = useCallback((emailId: string) => setState((previous) => {
    const draft = previous.emails.find((item) => item.id === emailId)?.draft
    if (!draft) return previous
    const emails = updateEmail(previous, emailId, 'Approved', { qaStatus: 'Passed' })
    const releaseBatches = previous.releaseBatches.map((batch) => batch.id === previous.emails.find((item) => item.id === emailId)?.releaseBatchId ? { ...batch, approvedDraftIds: Array.from(new Set([...batch.approvedDraftIds, draft.id])), heldDraftIds: batch.heldDraftIds.filter((id) => id !== draft.id) } : batch)
    return addEvent({ ...previous, emails, releaseBatches }, { action: 'Approved for release', detail: 'Draft approved and moved into its simulated release batch.', emailId, draftId: draft.id, batchId: previous.emails.find((item) => item.id === emailId)?.releaseBatchId })
  }), [])
  const holdDraft = useCallback((emailId: string, reason = 'Held by reviewer') => setState((previous) => {
    const draft = previous.emails.find((item) => item.id === emailId)?.draft
    const emails = updateEmail(previous, emailId, 'Held')
    const releaseBatches = previous.releaseBatches.map((batch) => batch.id === previous.emails.find((item) => item.id === emailId)?.releaseBatchId && draft ? { ...batch, heldDraftIds: Array.from(new Set([...batch.heldDraftIds, draft.id])), approvedDraftIds: batch.approvedDraftIds.filter((id) => id !== draft.id) } : batch)
    return draft ? addEvent({ ...previous, emails, releaseBatches }, { action: 'Held draft', detail: reason, emailId, draftId: draft.id }) : previous
  }), [])
  const rejectDraft = useCallback((emailId: string) => setState((previous) => addEvent({ ...previous, emails: updateEmail(previous, emailId, 'Rejected') }, { action: 'Rejected draft', detail: 'Draft rejected for simulated revision.', emailId })), [])
  const transferEmail = useCallback((emailId: string, departmentId: string, mailboxId?: string) => setState((previous) => {
    const destination = previous.mailboxes.find((mailbox) => mailbox.id === mailboxId || mailbox.departmentId === departmentId)
    const emails = previous.emails.map((item) => item.id === emailId ? { ...item, departmentId, mailboxId: destination?.id ?? item.mailboxId, institutionId: destination?.institutionId ?? item.institutionId, status: 'Specialist Review' as const } : item)
    return addEvent({ ...previous, emails }, { action: 'Transferred request', detail: `Transferred to ${destination?.name ?? 'selected department'} for review.`, emailId })
  }), [])
  const escalateEmail = useCallback((emailId: string) => setState((previous) => addEvent({ ...previous, emails: updateEmail(previous, emailId, 'Escalated', { qaStatus: 'Mandatory review' }) }, { action: 'Escalated request', detail: 'Escalated to a specialist reviewer.', emailId })), [])
  const selectFormField = useCallback((formId: string, fieldId: string) => setState((previous) => ({ ...previous, forms: previous.forms.map((form) => form.id === formId ? { ...form, selectedFieldId: fieldId } : form) })), [])
  const correctFormField = useCallback((formId: string, fieldId: string, value: string) => setState((previous) => {
    const form = previous.forms.find((item) => item.id === formId)
    const field = form?.fields.find((item) => item.id === fieldId)
    if (!form || !field) return previous
    const corrected: ExtractedField = { ...field, value, confidence: Math.max(field.confidence, 95), validation: 'Valid', validationMessage: 'Corrected by reviewer', approved: true }
    const forms = previous.forms.map((item) => item.id === formId ? { ...item, selectedFieldId: fieldId, fields: item.fields.map((entry) => entry.id === fieldId ? corrected : entry) } : item)
    const updatedForm = forms.find((item) => item.id === formId)!
    const validationStatus = updatedForm.fields.every((entry) => entry.validation === 'Valid') ? 'Valid' as const : updatedForm.fields.some((entry) => entry.validation === 'Invalid') ? 'Invalid' as const : 'Warnings' as const
    const attachments = previous.attachments.map((item) => item.id === form.attachmentId ? { ...item, validationStatus, extractionStatus: validationStatus === 'Valid' ? 'Extracted' as const : 'Review required' as const } : item)
    const extractionRuns = previous.extractionRuns.map((item) => item.id === form.extractionRunId ? { ...item, validationStatus, status: validationStatus === 'Valid' ? 'Extracted' as const : 'Review required' as const } : item)
    return addEvent({ ...previous, forms, ...withAttachments(previous, attachments), extractionRuns }, { action: 'Corrected extracted field', detail: `${field.label} was corrected and approved.`, formId, emailId: form.emailId, attachmentId: form.attachmentId })
  }), [])
  const approveFormField = useCallback((formId: string, fieldId: string) => setState((previous) => ({ ...previous, forms: previous.forms.map((form) => form.id === formId ? { ...form, fields: form.fields.map((field) => field.id === fieldId ? { ...field, approved: true } : field) } : form) })), [])
  const approveFormExtraction = useCallback((formId: string) => setState((previous) => {
    const form = previous.forms.find((item) => item.id === formId)
    if (!form) return previous
    const forms = previous.forms.map((item) => item.id === formId ? { ...item, reviewStatus: 'Approved' as const, fields: item.fields.map((field) => ({ ...field, approved: true, validation: 'Valid' as const, validationMessage: 'Approved by reviewer' })) } : item)
    const attachments = previous.attachments.map((item) => item.id === form.attachmentId ? { ...item, validationStatus: 'Valid' as const, extractionStatus: 'Extracted' as const } : item)
    const extractionRuns = previous.extractionRuns.map((item) => item.id === form.extractionRunId ? { ...item, validationStatus: 'Valid' as const, status: 'Extracted' as const } : item)
    return addEvent({ ...previous, forms, ...withAttachments(previous, attachments), extractionRuns }, { action: 'Approved form extraction', detail: 'All extracted fields approved for the simulated form.', formId, emailId: form.emailId, attachmentId: form.attachmentId })
  }), [])
  const requestResubmission = useCallback((formId: string) => setState((previous) => {
    const form = previous.forms.find((item) => item.id === formId)
    if (!form) return previous
    return addEvent({ ...previous, forms: previous.forms.map((item) => item.id === formId ? { ...item, reviewStatus: 'Resubmission requested' } : item) }, { action: 'Requested form resubmission', detail: 'A simulated resubmission request was staged.', formId, emailId: form.emailId })
  }), [])
  const markFormUnreadable = useCallback((formId: string) => setState((previous) => ({ ...previous, forms: previous.forms.map((form) => form.id === formId ? { ...form, reviewStatus: 'Unreadable' } : form) })), [])
  const updatePolicy = useCallback((policyId: string, changes: Partial<QaPolicy>) => setState((previous) => addEvent({ ...previous, policies: previous.policies.map((policy) => policy.id === policyId ? { ...policy, ...changes } : policy) }, { action: 'Updated agent controls', detail: 'Policy settings saved in this demonstration.', batchId: PRIMARY_RELEASE_BATCH_ID })), [])
  const setReleasePaused = useCallback((paused: boolean) => setState((previous) => addEvent({ ...previous, policies: previous.policies.map((policy) => ({ ...policy, releasesPaused: paused, mode: paused ? 'Paused' : policy.mode })), releaseBatches: previous.releaseBatches.map((batch) => ({ ...batch, status: paused ? 'Paused' : batch.status === 'Paused' ? 'Scheduled' : batch.status })) }, { action: paused ? 'Paused releases' : 'Resumed releases', detail: paused ? 'All simulated automated releases are paused.' : 'Simulated automated releases are active.' })), [])
  const updateBatch = useCallback((batchId: string, changes: Partial<Pick<ReleaseBatch, 'scheduledReleaseAt' | 'status' | 'qaPercentage'>>) => setState((previous) => ({ ...previous, releaseBatches: previous.releaseBatches.map((batch) => batch.id === batchId ? { ...batch, ...changes } : batch) })), [])
  const runRandomQa = useCallback((batchId: string) => setState((previous) => {
    const batch = previous.releaseBatches.find((item) => item.id === batchId)
    if (!batch || !batch.locked) return previous
    const eligible = batch.populationDraftIds.filter((id) => !batch.mandatoryDraftIds.includes(id) && !batch.heldDraftIds.includes(id))
    const count = Math.max(1, Math.ceil(eligible.length * batch.qaPercentage / 100))
    const selected = [...eligible].sort(() => Math.random() - 0.5).slice(0, count)
    const draftToEmail = new Map(previous.emails.filter((item) => item.draft).map((item) => [item.draft!.id, item.id]))
    const emails = previous.emails.map((item) => item.draft && selected.includes(item.draft.id) ? { ...item, status: 'QA Required' as const, qaStatus: 'Selected for QA' as const, draft: { ...item.draft, status: 'QA Required' as const, qaSelected: true, qaReason: 'Selected for review through random QA sampling' } } : item)
    const releaseBatches = previous.releaseBatches.map((item) => item.id === batchId ? { ...item, randomSelectedDraftIds: selected } : item)
    return selected.reduce((current, draftId) => addEvent(current, { action: 'Selected for random QA', detail: 'Selected after the release population locked; the agent did not choose the sample.', emailId: draftToEmail.get(draftId), draftId, batchId }), { ...previous, emails, releaseBatches })
  }), [])
  const setBatchQaToFullReview = useCallback((batchId: string) => setState((previous) => {
    const batch = previous.releaseBatches.find((item) => item.id === batchId)
    if (!batch) return previous
    const releaseBatches = previous.releaseBatches.map((item) => item.id === batchId ? { ...item, qaPercentage: 100, randomSelectedDraftIds: [...item.populationDraftIds] } : item)
    const policies = previous.policies.map((policy) => policy.mailboxId === batch.mailboxId ? { ...policy, randomQaPercentage: 100, mode: 'Full Review' as AgentMode } : policy)
    return addEvent({ ...previous, releaseBatches, policies }, { action: 'QA sample set to 100%', detail: 'All eligible drafts require simulated human QA.', batchId })
  }), [])
  const holdBatch = useCallback((batchId: string) => setState((previous) => addEvent({ ...previous, releaseBatches: previous.releaseBatches.map((batch) => batch.id === batchId ? { ...batch, status: 'Held' } : batch) }, { action: 'Held release batch', detail: 'Release batch placed on simulated hold.', batchId })), [])
  const resumeBatch = useCallback((batchId: string) => setState((previous) => addEvent({ ...previous, releaseBatches: previous.releaseBatches.map((batch) => batch.id === batchId ? { ...batch, status: 'Scheduled' } : batch) }, { action: 'Resumed release batch', detail: 'Release batch resumed in this demonstration.', batchId })), [])
  const releaseBatch = useCallback((batchId: string) => setState((previous) => {
    const batch = previous.releaseBatches.find((item) => item.id === batchId)
    if (!batch) return previous
    const releasable = batch.approvedDraftIds.filter((id) => !batch.heldDraftIds.includes(id))
    const emails = previous.emails.map((item) => item.draft && releasable.includes(item.draft.id) ? { ...item, status: 'Released' as const, draft: { ...item.draft, status: 'Released' as const } } : item)
    const releaseBatches = previous.releaseBatches.map((item) => item.id === batchId ? { ...item, releasedDraftIds: Array.from(new Set([...item.releasedDraftIds, ...releasable])), status: 'Released' as const } : item)
    return addEvent({ ...previous, emails, releaseBatches }, { action: 'Released approved responses', detail: `${releasable.length} approved response${releasable.length === 1 ? '' : 's'} released in the simulation.`, batchId })
  }), [])
  const markKnowledgeChanged = useCallback((knowledgeId = TRANSCRIPT_KNOWLEDGE_ID) => setState((previous) => addEvent({ ...previous, knowledge: previous.knowledge.map((item) => item.id === knowledgeId ? { ...item, changed: true, status: 'Under Review' } : item) }, { action: 'Marked policy changed', detail: 'Staged drafts may be affected by the simulated policy change.', knowledgeId })), [])
  const applyKnowledgeImpact = useCallback((action: KnowledgeImpactAction, knowledgeId = TRANSCRIPT_KNOWLEDGE_ID) => {
    setState((previous) => {
      const article = previous.knowledge.find((item) => item.id === knowledgeId)
      if (!article) return previous
      if (action === 'increase-qa') {
        const batchId = previous.emails.find((item) => item.draft?.id === article.affectedDraftIds[0])?.releaseBatchId ?? PRIMARY_RELEASE_BATCH_ID
        const batch = previous.releaseBatches.find((item) => item.id === batchId)
        const releaseBatches = previous.releaseBatches.map((item) => item.id === batchId ? { ...item, qaPercentage: 100, randomSelectedDraftIds: [...item.populationDraftIds], status: 'Held' as const, heldDraftIds: Array.from(new Set([...item.heldDraftIds, ...article.affectedDraftIds])) } : item)
        const policies = previous.policies.map((policy) => policy.mailboxId === batch?.mailboxId ? { ...policy, randomQaPercentage: 100, mode: 'Knowledge Change' as AgentMode, knowledgeChangeHold: true } : policy)
        const emails = previous.emails.map((item) => article.affectedDraftIds.includes(item.draft?.id ?? '') ? { ...item, status: 'Held' as const, draft: item.draft ? { ...item.draft, status: 'Held' as const } : undefined } : item)
        return addEvent({ ...previous, releaseBatches, policies, emails }, { action: 'Increased QA to 100% and held affected drafts', detail: `${article.affectedDraftIds.length} affected draft(s) held for policy review.`, knowledgeId, batchId })
      }
      if (action === 'hold-batch') return addEvent({ ...previous, releaseBatches: previous.releaseBatches.map((batch) => batch.id === PRIMARY_RELEASE_BATCH_ID ? { ...batch, status: 'Held', heldDraftIds: Array.from(new Set([...batch.heldDraftIds, ...article.affectedDraftIds])) } : batch) }, { action: 'Held affected drafts', detail: `${article.affectedDraftIds.length} affected draft(s) held pending revalidation.`, knowledgeId, batchId: PRIMARY_RELEASE_BATCH_ID })
      if (action === 'revalidate') return addEvent(previous, { action: 'Revalidated affected drafts', detail: `${article.affectedDraftIds.length} draft(s) revalidated against the policy update.`, knowledgeId })
      return addEvent(previous, { action: 'Continued with current settings', detail: 'Policy conflict acknowledged; current simulated release settings retained.', knowledgeId })
    })
  }, [])
  const resetDemo = useCallback(() => setState(createInitialDemoState()), [])
  const value = useMemo<DemoContextValue>(() => {
    const actions: DemoActions = { selectScope, selectAttachment, confirmAttachmentClassification, correctAttachmentClassification, updateDraft, applyRefinement, saveDraft, approveDraft, holdDraft, rejectDraft, transferEmail, escalateEmail, selectFormField, correctFormField, approveFormField, approveFormExtraction, requestResubmission, markFormUnreadable, updatePolicy, setReleasePaused, updateBatch, runRandomQa, setBatchQaToFullReview, holdBatch, resumeBatch, releaseBatch, markKnowledgeChanged, applyKnowledgeImpact, resetDemo }
    return { ...state, ...actions, state, actions }
  }, [state, selectScope, selectAttachment, confirmAttachmentClassification, correctAttachmentClassification, updateDraft, applyRefinement, saveDraft, approveDraft, holdDraft, rejectDraft, transferEmail, escalateEmail, selectFormField, correctFormField, approveFormField, approveFormExtraction, requestResubmission, markFormUnreadable, updatePolicy, setReleasePaused, updateBatch, runRandomQa, setBatchQaToFullReview, holdBatch, resumeBatch, releaseBatch, markKnowledgeChanged, applyKnowledgeImpact, resetDemo])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used within a DemoProvider')
  return context
}
