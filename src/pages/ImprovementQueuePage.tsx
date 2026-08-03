import { Activity, ArrowRight, CheckCircle2, ClipboardCheck, FlaskConical, Lightbulb, RotateCcw, ShieldCheck, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, Button, ConfidenceBar, MetricCard, Modal, PageHeader } from '../components/shared'
import { useDemo } from '../context/DemoContext'
import type { ImprovementProposal, QaFeedbackEvent } from '../types'
import './improvement-queue.css'

type Confirmation = { kind: 'activate' | 'rollback'; proposal: ImprovementProposal }

const toneFor = (status: ImprovementProposal['status']) => status === 'Active' ? 'success' : status === 'Evaluated' ? 'info' : status === 'Dismissed' || status === 'Rolled back' ? 'neutral' : 'review'
const priorityFor = (feedback: QaFeedbackEvent) => feedback.decision === 'Rejected' ? 'High' : feedback.decision === 'Corrected' || feedback.decision === 'Approved with edits' ? 'Medium' : 'Low'

export default function ImprovementQueuePage() {
  const { state, actions } = useDemo()
  const { qaFeedback: feedback, improvementProposals: proposals, activeAgentVersion } = state
  const [selectedId, setSelectedId] = useState(proposals.find((proposal) => proposal.status === 'Candidate')?.id ?? proposals[0]?.id)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [toast, setToast] = useState('')
  const selected = proposals.find((proposal) => proposal.id === selectedId) ?? proposals[0]
  const activeProposal = proposals.find((proposal) => proposal.status === 'Active')
  const canActivateSelected = selected?.status === 'Evaluated' && selected.currentVersion === activeAgentVersion && !activeProposal
  const openProposals = proposals.filter((proposal) => proposal.status === 'Candidate' || proposal.status === 'Evaluated')
  const evaluated = proposals.filter((proposal) => proposal.status === 'Evaluated' || proposal.status === 'Active').length
  const evidenceByCategory = useMemo(() => new Set(feedback.map((item) => item.category)).size, [feedback])
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 4600) }
  const subjectFor = (item: QaFeedbackEvent) => state.emails.find((email) => email.id === item.emailId)?.subject ?? `${item.category} feedback`
  const evaluate = (proposal: ImprovementProposal) => { actions.evaluateImprovement(proposal.id); notify(`${proposal.candidateVersion} passed its deterministic simulated evaluation.`) }
  const dismiss = (proposal: ImprovementProposal) => { actions.dismissImprovement(proposal.id); notify(`${proposal.target} was dismissed. The active version is unchanged.`) }
  const confirm = () => {
    if (!confirmation) return
    if (confirmation.kind === 'activate') {
      actions.activateImprovement(confirmation.proposal.id)
      notify(`${confirmation.proposal.candidateVersion} was human-approved and activated for simulated monitoring.`)
    } else {
      actions.rollbackImprovement(confirmation.proposal.id)
      notify(`${confirmation.proposal.candidateVersion} was rolled back to ${confirmation.proposal.currentVersion}.`)
    }
    setConfirmation(null)
  }

  return <div className="improvement-page">
    <PageHeader title="Improvement Queue" subtitle="Turn reviewer evidence into governed, reversible changes — never silent self-training." actions={<Badge tone="success">Human approval required</Badge>} />
    <section className="improvement-boundary" aria-label="No silent self-training boundary"><ShieldCheck size={20} /><div><strong>No silent self-training</strong><span>One QA decision becomes evidence, not a behavior change. Only repeated patterns can become candidates, and no candidate becomes active without evaluation and human approval.</span></div></section>
    <section className="learning-loop" data-tour="improvement-loop" aria-label="Governed learning loop"><div className="learning-step"><ClipboardCheck size={18} /><div><b>Capture QA</b><span>Preserve decisions, edits, and corrections.</span></div></div><ArrowRight size={16} /><div className="learning-step"><Lightbulb size={18} /><div><b>Find patterns</b><span>Repeated evidence forms a candidate.</span></div></div><ArrowRight size={16} /><div className="learning-step"><FlaskConical size={18} /><div><b>Evaluate safely</b><span>Fixed cases expose regressions.</span></div></div><ArrowRight size={16} /><div className="learning-step"><ShieldCheck size={18} /><div><b>Human approval</b><span>An owner activates a version.</span></div></div><ArrowRight size={16} /><div className="learning-step"><Activity size={18} /><div><b>Monitor or roll back</b><span>Later QA confirms the outcome.</span></div></div></section>
    <section className="improvement-metrics" aria-label="Improvement queue metrics"><MetricCard label="QA feedback captured" value={feedback.length} detail={`${evidenceByCategory} evidence categories`} tone="blue" /><MetricCard label="Candidate proposals" value={openProposals.filter((item) => item.status === 'Candidate').length} detail="Awaiting evaluation" tone="amber" /><MetricCard label="Safe evaluations" value={evaluated} detail="Fixed offline QA set" tone="green" /><MetricCard label="Active agent version" value={activeAgentVersion} detail="Human-approved behavior" tone="blue" /></section>
    <div className="improvement-layout">
      <section className="improvement-panel feedback-panel"><header><div><h2>Reviewer feedback evidence</h2><p>Live mock state from QA and document review.</p></div><Badge tone="info">Traceable evidence</Badge></header><div className="feedback-list">{feedback.slice().reverse().map((item) => { const priority = priorityFor(item); return <article key={item.id}><div className={`severity severity-${priority.toLowerCase()}`}><span>{priority} priority</span></div><div><div className="feedback-meta"><Badge tone={item.decision === 'Rejected' ? 'danger' : item.decision === 'Corrected' || item.decision === 'Approved with edits' ? 'review' : 'info'}>{item.decision}</Badge><span>{item.timestamp}</span></div><h3>{subjectFor(item)}</h3><p>{item.summary}</p><small>{item.category} · {item.source}</small></div></article> })}</div></section>
      <section className="improvement-panel proposal-panel"><header><div><h2>Candidate improvements</h2><p>Patterns become bounded, versioned proposals.</p></div><Badge tone="review">{openProposals.length} open</Badge></header><div className="proposal-list">{proposals.map((proposal) => <button type="button" key={proposal.id} className={`proposal-row ${proposal.id === selected?.id ? 'selected' : ''} ${proposal.status === 'Dismissed' || proposal.status === 'Rolled back' ? 'dismissed' : ''}`} onClick={() => setSelectedId(proposal.id)}><div><Badge tone={toneFor(proposal.status)}>{proposal.status}</Badge><h3>{proposal.target}</h3><p>{proposal.scope} · {proposal.evidenceCount} supporting observations</p></div><ArrowRight size={17} /></button>)}</div></section>
      <aside className="improvement-panel detail-panel">{selected ? <><header><div><p className="detail-kicker">Selected improvement</p><h2>{selected.target}</h2></div><Badge tone={toneFor(selected.status)}>{selected.status}</Badge></header><div className="detail-body"><p className="detail-summary">{selected.signal}</p><dl><div><dt>Candidate version</dt><dd>{selected.candidateVersion}</dd></div><div><dt>Scope</dt><dd>{selected.scope}</dd></div><div><dt>Current outcome</dt><dd>{selected.currentMetric}</dd></div><div><dt>Projected outcome</dt><dd>{selected.projectedMetric}</dd></div></dl>{selected.status === 'Candidate' ? <section className="evaluation-card pending"><div className="evaluation-heading"><div><h3>Evaluation not yet run</h3><p>Uses a fixed, simulated QA set. No live learning occurs.</p></div><FlaskConical size={20} /></div></section> : <section className="evaluation-card"><div className="evaluation-heading"><div><h3>Deterministic evaluation</h3><p>Fixed QA evidence · {selected.evidenceCount} governed observations</p></div><CheckCircle2 size={20} /></div><div className="evaluation-grid"><span><b>{selected.currentVersion}</b>Baseline</span><span><b>{selected.candidateVersion}</b>Candidate</span><span><b>0</b>Regressions</span></div><ConfidenceBar value={96} label="Evaluation confidence" /><p className="evaluation-outcome">{selected.evaluationSummary}</p></section>}{selected.status === 'Evaluated' && !canActivateSelected && <p className="evaluation-outcome">Activation is blocked until the currently active version is rolled back and this candidate's baseline matches it.</p>}</div><footer>{selected.status === 'Candidate' && <Button variant="primary" onClick={() => evaluate(selected)}><FlaskConical size={16} />Run simulated evaluation</Button>}{canActivateSelected && <Button variant="primary" onClick={() => setConfirmation({ kind: 'activate', proposal: selected })}><ShieldCheck size={16} />Approve and activate</Button>}{selected.status === 'Active' && <Button variant="danger" onClick={() => setConfirmation({ kind: 'rollback', proposal: selected })}><RotateCcw size={16} />Roll back version</Button>}{selected.status !== 'Active' && selected.status !== 'Dismissed' && selected.status !== 'Rolled back' && <Button onClick={() => dismiss(selected)}><XCircle size={16} />Dismiss proposal</Button>}</footer></> : <div className="empty-detail">Select an improvement to inspect its evidence and controls.</div>}</aside>
    </div>
    <section className="active-version" aria-label="Active agent version"><div><span className="detail-kicker">Currently active</span><h2>{activeAgentVersion} · {activeProposal?.target ?? 'Baseline correspondence behavior'}</h2><p>{activeProposal?.scope ?? 'All fictional institutions'} · Versioned and auditable</p></div><div><Badge tone="success">Monitoring</Badge><p>Watching subsequent QA acceptance, corrections, and escalations.</p></div></section>
    <Modal open={Boolean(confirmation)} title={confirmation?.kind === 'rollback' ? 'Roll back this improvement?' : 'Approve and activate this improvement?'} destructive={confirmation?.kind === 'rollback'} onClose={() => setConfirmation(null)} footer={<><Button onClick={() => setConfirmation(null)}>Cancel</Button><Button variant={confirmation?.kind === 'rollback' ? 'danger' : 'primary'} onClick={confirm}>{confirmation?.kind === 'rollback' ? <><RotateCcw size={16} />Roll back version</> : <><ShieldCheck size={16} />Approve and activate</>}</Button></>}><p>{confirmation?.kind === 'rollback' ? <>This simulated rollback restores <strong>{confirmation.proposal.currentVersion}</strong>. The activation and rollback remain in the audit history.</> : <>This simulated action promotes <strong>{confirmation?.proposal.candidateVersion}</strong> after its fixed evaluation. The previous version remains available for rollback and later QA outcomes remain visible.</>}</p></Modal>
    {toast && <div className="improvement-toast" role="status">{toast}</div>}
  </div>
}
