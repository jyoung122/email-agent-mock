export type Id = string
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type EmailStatus = 'New' | 'Classified' | 'Draft Ready' | 'QA Required' | 'Form Review Required' | 'Missing Information' | 'Specialist Review' | 'Escalated' | 'Approved' | 'Staged' | 'Released' | 'Held' | 'Rejected'
export type QaStatus = 'Not required' | 'Random sample' | 'Mandatory review' | 'Selected for QA' | 'Passed' | 'Failed'
export type ApprovalStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Superseded' | 'Expired' | 'Under Review'
export type FormValidation = 'Valid' | 'Invalid' | 'Needs review'
export type FormReviewStatus = 'Pending review' | 'Approved' | 'Resubmission requested' | 'Unreadable'
export type AttachmentPreviewKind = 'Document' | 'Image' | 'Spreadsheet' | 'Unknown'
export type AttachmentClassificationStatus = 'Pending' | 'Matched' | 'Low confidence' | 'Unmatched' | 'Confirmed' | 'Corrected'
export type ExtractionStatus = 'Not started' | 'Extracted' | 'Review required' | 'Not applicable'
export type ValidationStatus = 'Not run' | 'Valid' | 'Warnings' | 'Invalid'
export type ReleaseStatus = 'Scheduled' | 'Held' | 'Paused' | 'Released'
export type AgentMode = 'Normal' | 'Increased QA' | 'Full Review' | 'Paused' | 'Knowledge Change' | 'Emergency Hold'

export interface Institution { id: Id; name: string; shortName: string; region: string; active: boolean }
export interface Department { id: Id; name: string; institutionId: Id; leadUserId: Id }
export interface Mailbox { id: Id; name: string; address: string; institutionId: Id; departmentId: Id; active: boolean }
export interface User { id: Id; name: string; initials: string; role: string; email: string; institutionId?: Id }
export interface Attachment { id: Id; emailId: Id; fileName: string; /** Human-readable format retained for existing UI. */ type: string; mimeType: string; previewKind: AttachmentPreviewKind; size: string; classificationStatus: AttachmentClassificationStatus; predictedFormDefinitionId?: Id; predictedFormVersion?: string; classificationConfidence: number; alternatives: DocumentClassificationAlternative[]; documentAssessmentId?: Id; extractionRunId?: Id; extractedFormId?: Id; extractionStatus: ExtractionStatus; validationStatus: ValidationStatus }
export interface DocumentClassificationAlternative { formDefinitionId?: Id; formVersion?: string; label: string; confidence: number }
export interface DocumentAssessment { id: Id; attachmentId: Id; classificationStatus: AttachmentClassificationStatus; predictedFormDefinitionId?: Id; predictedFormVersion?: string; confidence: number; alternatives: DocumentClassificationAlternative[]; assessedAt: string; reviewedByUserId?: Id; reviewNote?: string }
export interface CanonicalFieldDefinition { key: string; label: string; required: boolean; validationRule: string; displayOrder: number }
export interface FormVersion { id: Id; version: string; status: ApprovalStatus; effectiveDate: string; canonicalFields: CanonicalFieldDefinition[]; validationSummary: string }
export interface FormDefinition { id: Id; name: string; documentCategory: string; departmentId: Id; description: string; classificationThreshold: number; extractionThreshold: number; acceptedMimeTypes: string[]; versions: FormVersion[]; activeVersionId: Id }
export interface EmailThread { id: Id; emailId: Id; sender: string; senderEmail: string; body: string; sentAt: string; direction: 'Inbound' | 'Outbound' }
export interface AgentAssessment { classification: string; confidence: number; groundingStatus: 'Grounded' | 'Partial' | 'Missing'; groundingConfidence: number; requiredElements: string[]; warnings: string[]; qaReason?: string }
export interface ResponseDraft { id: Id; emailId: Id; to: string; subject: string; body: string; originalBody: string; toneProfile: string; version: number; status: EmailStatus; scheduledReleaseAt: string; qaSelected: boolean; qaReason?: string; assignedUserId?: Id; refinementHistory: string[] }
export interface EmailMessage { id: Id; sender: string; senderEmail: string; subject: string; preview: string; institutionId: Id; departmentId: Id; mailboxId: Id; requestType: string; status: EmailStatus; risk: RiskLevel; qaStatus: QaStatus; scheduledReleaseAt?: string; assignedUserId?: Id; receivedAt: string; attachments: Attachment[]; assessment: AgentAssessment; draft?: ResponseDraft; thread: EmailThread[]; releaseBatchId?: Id; formId?: Id }
export interface KnowledgeSource { id: Id; title: string; institutionId: Id; departmentId: Id; topics: string[]; ownerUserId: Id; status: ApprovalStatus; effectiveDate: string; expirationDate?: string; lastReviewed: string; version: string; approvedLanguage: string; affectedDraftIds: Id[]; changed: boolean }
export interface ExtractedField { id: Id; key: string; label: string; value: string; confidence: number; validation: FormValidation; validationMessage: string; region: string; approved: boolean }
export interface ExtractionRun { id: Id; attachmentId: Id; emailId: Id; formDefinitionId: Id; formVersionId: Id; status: ExtractionStatus; validationStatus: ValidationStatus; confidence: number; createdAt: string; extractedFormId?: Id }
export interface ExtractedForm { id: Id; emailId: Id; attachmentId?: Id; extractionRunId?: Id; formDefinitionId?: Id; formVersionId?: Id; name: string; studentDisplayName: string; studentId: string; formVersion: string; confidence: number; reviewStatus: FormReviewStatus; fields: ExtractedField[]; selectedFieldId?: Id }
export interface ReleaseBatch { id: Id; name: string; institutionId: Id; departmentId: Id; mailboxId: Id; scheduledReleaseAt: string; qaPercentage: number; populationDraftIds: Id[]; mandatoryDraftIds: Id[]; randomSelectedDraftIds: Id[]; approvedDraftIds: Id[]; heldDraftIds: Id[]; releasedDraftIds: Id[]; status: ReleaseStatus; locked: boolean }
export interface QaPolicy { id: Id; institutionId: Id; departmentId: Id; mailboxId: Id; requestType: string; headlessAutomationPercentage: number; randomQaPercentage: number; mandatoryHumanReviewPercentage: number; minimumGroundingConfidence: number; minimumExtractionConfidence: number; scheduledReleaseTime: string; releaseFrequency: string; businessHoursOnly: boolean; releasesPaused: boolean; mode: AgentMode; toneProfile: string; knowledgeChangeHold: boolean }
export interface AuditEvent { id: Id; timestamp: string; actor: string; action: string; detail: string; emailId?: Id; draftId?: Id; formId?: Id; attachmentId?: Id; batchId?: Id; knowledgeId?: Id }
export interface DemoSelections { institutionId: Id; departmentId: Id; userId: Id; selectedAttachmentId?: Id }
export interface DemoState { institutions: Institution[]; departments: Department[]; mailboxes: Mailbox[]; users: User[]; attachments: Attachment[]; emails: EmailMessage[]; knowledge: KnowledgeSource[]; formDefinitions: FormDefinition[]; documentAssessments: DocumentAssessment[]; extractionRuns: ExtractionRun[]; forms: ExtractedForm[]; releaseBatches: ReleaseBatch[]; policies: QaPolicy[]; auditEvents: AuditEvent[]; selections: DemoSelections }
