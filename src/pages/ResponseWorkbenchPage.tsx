import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, BookOpen, Check, ChevronDown, Clock3, FileQuestion, FileSpreadsheet, FileText, Flag, History, Image as ImageIcon, MessageSquareText, MoreHorizontal, Save, ScanSearch, ShieldCheck, Sparkles, UserRoundCheck, X } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Badge, Button, ConfidenceBar, Modal } from '../components/shared'
import { useDemo, type RefinementAction } from '../context/DemoContext'
import { TRANSCRIPT_KNOWLEDGE_ID } from '../data/mockData'
import type { Attachment } from '../types'
import FormReviewPage from './FormReviewPage'
import './work-pages.css'
import './workbench-viewport.css'
import './attachment-pipeline.css'

const refinements: { action: RefinementAction; label: string }[] = [
  { action: 'warmer', label: 'Make warmer' },
  { action: 'concise', label: 'Make more concise' },
  { action: 'missing-documents', label: 'Explain missing documents' },
  { action: 'approved-language', label: 'Use approved transcript language' },
  { action: 'restore', label: 'Restore original draft' },
]

export default function ResponseWorkbenchPage() {
  const { emailId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { state, actions } = useDemo()
  const email = state.emails.find((item) => item.id === emailId)
  const [body, setBody] = useState(email?.draft?.body ?? '')
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState<'hold' | 'reject' | 'transfer' | ''>('')
  const [reviewAttachmentId, setReviewAttachmentId] = useState('')
  const [transferDepartment, setTransferDepartment] = useState('dept-financial-aid')
  const returnTo = searchParams.get('returnTo') ?? ''
  useEffect(() => { setBody(email?.draft?.body ?? '') }, [email?.draft?.body])
  useEffect(() => {
    if (!reviewAttachmentId) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setReviewAttachmentId('') }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [reviewAttachmentId])
  const references = useMemo(() => {
    if (!email) return []
    const direct = state.knowledge.filter((item) => item.id === TRANSCRIPT_KNOWLEDGE_ID || item.departmentId === email.departmentId)
    return direct.length ? direct.slice(0, 3) : state.knowledge.slice(0, 2)
  }, [email, state.knowledge])
  if (!email) return <div className="page"><section className="panel not-found-record"><MessageSquareText size={34} /><h1>Message not found</h1><p>This fictional queue item is not available.</p><Button onClick={() => navigate('/work-queue')}>Return to Work Queue</Button></section></div>
  const draft = email.draft
  const institution = state.institutions.find((item) => item.id === email.institutionId)
  const department = state.departments.find((item) => item.id === email.departmentId)
  const mailbox = state.mailboxes.find((item) => item.id === email.mailboxId)
  const assignee = state.users.find((item) => item.id === email.assignedUserId)
  const audit = state.auditEvents.filter((item) => item.emailId === email.id || item.draftId === draft?.id || item.formId === email.formId).slice().reverse()
  const attachmentDefinition = (attachment: Attachment) => state.formDefinitions.find((item) => item.id === attachment.predictedFormDefinitionId)
  const attachmentIcon = (attachment: Attachment) => attachment.previewKind === 'Image' ? <ImageIcon size={19} /> : attachment.previewKind === 'Spreadsheet' ? <FileSpreadsheet size={19} /> : attachment.previewKind === 'Unknown' ? <FileQuestion size={19} /> : <FileText size={19} />
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3800) }
  const save = () => { actions.updateDraft(email.id, body); actions.saveDraft(email.id); notify('Draft saved locally and recorded in audit history.') }
  const refine = (action: RefinementAction, label: string) => { actions.updateDraft(email.id, body); actions.applyRefinement(email.id, action); notify(`${label} applied using a predefined demo version.`) }
  const backLink = `/work-queue${returnTo ? `?${returnTo}` : ''}`

  return <div className="workbench-page">
    <header className="workbench-topline"><div><Link to={backLink} className="back-link"><ArrowLeft size={15} />Work Queue</Link><span>/</span><strong>{email.subject}</strong></div><div><Badge>{email.status}</Badge><span className="case-id">Case {email.id.replace('email-', '').toUpperCase()}</span></div></header>
    <div className="workbench-grid">
      <section className="workbench-panel source-panel" aria-label="Original message">
        <div className="workbench-panel-head"><div><span className="section-icon"><MessageSquareText size={17} /></span><div><h2>Original request</h2><p>{email.receivedAt}</p></div></div><Button variant="quiet" className="ora-icon-button" aria-label="More message actions"><MoreHorizontal size={17} /></Button></div>
        <div className="sender-card"><span className="sender-avatar">{email.sender.split(' ').map((part) => part[0]).join('')}</span><div><strong>{email.sender}</strong><span>{email.senderEmail}</span></div></div>
        <article className="message-card"><h3>{email.subject}</h3>{email.thread.map((entry) => <div className="message-body" key={entry.id}>{entry.body.split('\n').map((line, index) => <p key={`${entry.id}-${index}`}>{line || <br />}</p>)}</div>)}</article>
        <div className="detail-section"><h3>Request context</h3><dl className="context-list"><div><dt>Classification</dt><dd>{email.assessment.classification}<small>{email.assessment.confidence}% confidence</small></dd></div><div><dt>Institution</dt><dd>{institution?.name}</dd></div><div><dt>Department</dt><dd>{department?.name}</dd></div><div><dt>Mailbox</dt><dd>{mailbox?.name}<small>{mailbox?.address}</small></dd></div><div><dt>Risk</dt><dd><Badge tone={email.risk === 'High' ? 'danger' : email.risk === 'Medium' ? 'review' : 'neutral'}>{email.risk} risk</Badge></dd></div></dl></div>
        <div className="detail-section"><h3>Attachments <span>{email.attachments.length}</span></h3>{email.attachments.length ? <div className="attachment-stack">{email.attachments.map((attachment) => { const definition = attachmentDefinition(attachment); const classificationTone = attachment.classificationStatus === 'Matched' || attachment.classificationStatus === 'Confirmed' ? 'success' : attachment.classificationStatus === 'Unmatched' ? 'danger' : 'review'; return <button key={attachment.id} className="attachment-card attachment-card--pipeline" type="button" aria-haspopup="dialog" onClick={() => setReviewAttachmentId(attachment.id)}><span>{attachmentIcon(attachment)}</span><div className="attachment-card__info"><strong>{attachment.fileName}</strong><small>{attachment.type} · {attachment.size}</small><div className="attachment-match"><ScanSearch size={12} /><b>{definition?.name ?? 'No configured form match'}</b>{attachment.predictedFormVersion && <em>v{attachment.predictedFormVersion}</em>}<em>{attachment.classificationConfidence}%</em></div></div><div className="attachment-card__states"><Badge tone={classificationTone}>{attachment.classificationStatus}</Badge><small>{attachment.extractionStatus} · {attachment.validationStatus}</small></div></button> })}</div> : <p className="muted no-attachments">No attachments</p>}</div>
      </section>

      <section className="workbench-panel draft-panel" aria-label="Response draft">
        <div className="workbench-panel-head draft-title"><div><span className="section-icon"><Sparkles size={17} /></span><div><h2>Proposed response</h2><p>Predefined, knowledge-grounded draft</p></div></div><Badge>{draft?.status ?? email.status}</Badge></div>
        {draft?.qaReason && <div className="qa-review-banner"><ShieldCheck size={18} /><div><strong>{draft.qaReason}</strong><span>Population locked before selection · Agent did not choose this sample</span></div></div>}
        {draft ? <div className="composer">
          <div className="composer-meta"><div><span>To</span><strong>{draft.to}</strong></div><div><span>Subject</span><strong>{draft.subject}</strong></div></div>
          <div className="draft-facts"><span><UserRoundCheck size={14} />{draft.toneProfile}</span><span>Version {draft.version}</span><span><Clock3 size={14} />{draft.scheduledReleaseAt}</span><span>Assigned to {assignee?.name ?? 'Unassigned'}</span></div>
          <label className="draft-editor-label" htmlFor="draft-body">Response body</label><textarea id="draft-body" className="draft-editor" value={body} onChange={(event) => setBody(event.target.value)} spellCheck="false" />
          <div className="composer-foot"><span>{body.length} characters · edits stay in this demo</span><div><Button onClick={save}><Save size={15} />Save draft</Button><Button onClick={() => setModal('hold')}><Flag size={15} />Hold</Button><Button variant="primary" onClick={() => { actions.updateDraft(email.id, body); actions.approveDraft(email.id); notify('Approved for delivery. The QA outcome was captured in Improvement Queue.') }}><Check size={16} />Approve for delivery</Button></div></div>
        </div> : <div className="empty-state"><MessageSquareText size={30} /><h3>No response draft</h3><p>This message is still being classified in the simulation.</p></div>}
        <div className="secondary-actions"><Button variant="quiet" onClick={() => setModal('reject')}><X size={15} />Reject draft</Button><Button variant="quiet" onClick={() => setModal('transfer')}><ChevronDown size={15} />Transfer request</Button><Button variant="quiet" onClick={() => { actions.escalateEmail(email.id); notify('Request escalated to specialist review.') }}><AlertTriangle size={15} />Escalate</Button></div>
      </section>

      <aside className="workbench-panel evidence-panel" aria-label="Evidence and controls">
        <section className="evidence-section"><div className="evidence-heading"><BookOpen size={17} /><h2>Supporting knowledge</h2></div><div className="grounding-row"><Badge tone="success">{email.assessment.groundingStatus}</Badge><span>All required claims supported</span></div><ConfidenceBar value={email.assessment.groundingConfidence} label="Grounding confidence" />{references.map((article) => <article className="source-card" key={article.id}><div><BookOpen size={15} /><strong>{article.title}</strong></div><p>{article.approvedLanguage}</p><footer><span>Version {article.version}</span><Badge>{article.status}</Badge></footer></article>)}</section>
        {email.assessment.warnings.length > 0 && <section className="evidence-section"><div className="evidence-heading warning"><AlertTriangle size={17} /><h2>Missing information</h2></div>{email.assessment.warnings.map((warning) => <div className="warning-card" key={warning}><strong>{warning}</strong><span>Delivery is blocked until resolved.</span></div>)}</section>}
        <section className="evidence-section"><div className="evidence-heading"><Check size={17} /><h2>Required response elements</h2></div><ul className="requirements-list">{email.assessment.requiredElements.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul></section>
        {draft && <section className="evidence-section"><div className="evidence-heading"><Sparkles size={17} /><h2>Refine draft</h2></div><p className="evidence-help">Each action swaps in approved, predefined demonstration text.</p><div className="refinement-grid">{refinements.map((item) => <Button key={item.action} onClick={() => refine(item.action, item.label)}>{item.label}</Button>)}</div></section>}
        <section className="evidence-section audit-section"><div className="evidence-heading"><History size={17} /><h2>Audit history</h2></div><div className="audit-list">{audit.map((entry) => <article key={entry.id}><span className="audit-dot" /><div><strong>{entry.action}</strong><p>{entry.detail}</p><small>{entry.actor} · {entry.timestamp}</small></div></article>)}</div></section>
      </aside>
    </div>
    <Modal open={modal === 'hold'} title="Hold this response?" onClose={() => setModal('')} footer={<><Button onClick={() => setModal('')}>Cancel</Button><Button variant="primary" onClick={() => { actions.holdDraft(email.id, 'Held by Morgan Lee pending signature review.'); setModal(''); notify('Response held pending signature review.') }}>Hold response</Button></>}><p>This removes the response from the ready-to-deliver count while preserving the draft and audit trail.</p></Modal>
    <Modal open={modal === 'reject'} title="Reject this draft?" destructive onClose={() => setModal('')} footer={<><Button onClick={() => setModal('')}>Cancel</Button><Button variant="danger" onClick={() => { actions.rejectDraft(email.id); setModal(''); notify('Draft rejected for revision.') }}>Reject draft</Button></>}><p>The response will return to revision and the action will be recorded in the simulated audit history.</p></Modal>
    <Modal open={modal === 'transfer'} title="Transfer request" onClose={() => setModal('')} footer={<><Button onClick={() => setModal('')}>Cancel</Button><Button variant="primary" onClick={() => { actions.transferEmail(email.id, transferDepartment); setModal(''); notify('Request transferred to the selected department.') }}>Transfer request</Button></>}><label className="modal-field">Destination department<select value={transferDepartment} onChange={(event) => setTransferDepartment(event.target.value)}>{state.departments.filter((item) => item.id !== email.departmentId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></Modal>
    {reviewAttachmentId && <div className="attachment-review-backdrop" role="presentation" onMouseDown={() => setReviewAttachmentId('')}><section className="attachment-review-modal" role="dialog" aria-modal="true" aria-label="Attachment review" onMouseDown={(event) => event.stopPropagation()}><FormReviewPage embeddedEmailId={email.id} initialAttachmentId={reviewAttachmentId} onClose={() => setReviewAttachmentId('')} /></section></div>}
    {toast && <div className="toast-local" role="status">{toast}</div>}
  </div>
}
