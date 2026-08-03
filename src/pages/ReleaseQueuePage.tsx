import { useMemo, useState } from 'react'
import { CalendarClock, CircleHelp, LockKeyhole, PauseCircle, PlayCircle, Send, ShieldCheck } from 'lucide-react'
import { Badge, Button, Modal, PageHeader } from '../components/shared'
import { useDemo } from '../context/DemoContext'
import type { ReleaseBatch } from '../types'
import './operations-pages.css'

const statusTone = (status: ReleaseBatch['status']) => status === 'Released' ? 'success' : status === 'Held' ? 'danger' : status === 'Paused' ? 'neutral' : 'review'

export default function ReleaseQueuePage() {
  const { state, actions } = useDemo()
  const [selectedId, setSelectedId] = useState(state.releaseBatches[0]?.id ?? '')
  const [releaseConfirm, setReleaseConfirm] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [releaseTime, setReleaseTime] = useState('4:00 PM ET')
  const [toast, setToast] = useState('')
  const batch = state.releaseBatches.find((item) => item.id === selectedId) ?? state.releaseBatches[0]
  const isPaused = state.policies.some((policy) => policy.releasesPaused)
  const names = useMemo(() => ({
    institution: (id: string) => state.institutions.find((entry) => entry.id === id)?.shortName ?? '—',
    department: (id: string) => state.departments.find((entry) => entry.id === id)?.name ?? '—',
    mailbox: (id: string) => state.mailboxes.find((entry) => entry.id === id)?.name ?? '—',
  }), [state])

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 4200) }
  if (!batch) return <div className="ops-page"><PageHeader title="Delivery Queue" subtitle="No simulated delivery batches are available." /></div>
  const ready = Math.max(0, batch.approvedDraftIds.length - batch.heldDraftIds.length)
  const update = (patch: Partial<ReleaseBatch>, message: string) => { actions.updateBatch(batch.id, patch); notify(message) }

  return <div className="ops-page">
    <PageHeader title="Delivery Queue" subtitle="Locked delivery batches with controlled human oversight." actions={<Button variant={isPaused ? 'secondary' : 'danger'} onClick={() => { actions.setReleasePaused(!isPaused); notify(isPaused ? 'Automated deliveries resumed.' : 'Automated deliveries paused across the simulation.') }}><PauseCircle size={16} />{isPaused ? 'Resume deliveries' : 'Pause all deliveries'}</Button>} />
    <section className={`ops-banner ${isPaused ? 'warning' : ''}`}><CalendarClock size={18} /><div><strong>{isPaused ? 'Automated delivery is paused' : `Next scheduled delivery · ${batch.scheduledReleaseAt}`}</strong><p>{isPaused ? 'No batch can be delivered until the control is resumed.' : 'Population is locked before mandatory review and random QA are evaluated.'}</p></div></section>
    <section className="ops-panel" data-tour="release-queue-batches">
      <div className="ops-panel-head"><h2>Delivery batches</h2><span className="ops-muted">{state.releaseBatches.length} simulated batches</span></div>
      <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Delivery batch</th><th>Institution</th><th>Department</th><th>Mailbox</th><th>Scheduled delivery</th><th className="num">QA</th><th className="num">Mandatory</th><th className="num">Random</th><th className="num">Approved</th><th className="num">Held</th><th className="num">Ready</th><th>Status</th></tr></thead><tbody>{state.releaseBatches.map((item) => <tr key={item.id} className={item.id === batch.id ? 'selected' : ''} tabIndex={0} onClick={() => setSelectedId(item.id)} onKeyDown={(event) => { if (event.key === 'Enter') setSelectedId(item.id) }}><td><strong>{item.name}</strong><br /><span className="ops-muted">{item.populationDraftIds.length} locked responses</span></td><td>{names.institution(item.institutionId)}</td><td>{names.department(item.departmentId)}</td><td>{names.mailbox(item.mailboxId)}</td><td>{item.scheduledReleaseAt}</td><td className="num">{item.qaPercentage}%</td><td className="num">{item.mandatoryDraftIds.length}</td><td className="num">{item.randomSelectedDraftIds.length}</td><td className="num">{item.approvedDraftIds.length}</td><td className="num">{item.heldDraftIds.length}</td><td className="num">{Math.max(0, item.approvedDraftIds.length - item.heldDraftIds.length)}</td><td><Badge tone={statusTone(item.status)}>{item.status === 'Released' ? 'Delivered' : item.status}</Badge></td></tr>)}</tbody></table></div>
    </section>
    <section className="ops-panel ops-detail" aria-label={`${batch.name} details`}>
      <div className="ops-detail-header"><div><h2>{batch.name}</h2><p>{names.mailbox(batch.mailboxId)} · Population locked for unbiased QA selection</p></div><div className="ops-actions"><Button onClick={() => { if (batch.status === 'Held') actions.resumeBatch(batch.id); else actions.holdBatch(batch.id); notify(batch.status === 'Held' ? 'Batch resumed for scheduled delivery.' : 'Batch held; no simulated response will be delivered.') }}>{batch.status === 'Held' ? <PlayCircle size={16} /> : <PauseCircle size={16} />}{batch.status === 'Held' ? 'Resume batch' : 'Hold batch'}</Button><Button onClick={() => setTimeOpen(true)}><CalendarClock size={16} />Change time</Button><span title="Random QA selection occurs after the delivery population is locked, preventing the agent or processing order from influencing the sample."><Button onClick={() => { actions.runRandomQa(batch.id); notify('Random QA simulation completed and recorded in audit history.') }}><ShieldCheck size={16} />Run random QA <CircleHelp size={14} /></Button></span><Button onClick={() => { actions.setBatchQaToFullReview(batch.id); notify('QA sample set to 100%; this batch is held for review.') }}><LockKeyhole size={16} />Set QA to 100%</Button><Button variant="primary" disabled={isPaused || batch.status === 'Held' || ready === 0} onClick={() => setReleaseConfirm(true)}><Send size={16} />Send approved</Button></div></div>
      <div className="ops-progress"><div><label>Population</label><strong>{batch.populationDraftIds.length}</strong></div><div><label>Mandatory</label><strong>{batch.mandatoryDraftIds.length}</strong></div><div><label>Randomly selected</label><strong>{batch.randomSelectedDraftIds.length}</strong></div><div><label>Approved</label><strong>{batch.approvedDraftIds.length}</strong></div><div><label>Held</label><strong>{batch.heldDraftIds.length}</strong></div><div><label>Ready</label><strong>{ready}</strong></div></div>
      <div className="ops-split" style={{ minHeight: 0 }}><div><h3 style={{ fontSize: 14 }}>Batch membership</h3><ul className="ops-mini-list">{batch.populationDraftIds.map((draftId) => { const email = state.emails.find((item) => item.draft?.id === draftId) ?? state.emails.find((item) => item.id.includes(draftId.replace('draft-', 'email-'))); return <li key={draftId}><span><strong>{email?.subject ?? draftId}</strong><br /><span className="ops-muted">{email?.sender ?? 'Simulated staged response'}</span></span><Badge tone={batch.heldDraftIds.includes(draftId) ? 'danger' : batch.approvedDraftIds.includes(draftId) ? 'success' : batch.randomSelectedDraftIds.includes(draftId) ? 'review' : 'neutral'}>{batch.heldDraftIds.includes(draftId) ? 'Held' : batch.approvedDraftIds.includes(draftId) ? 'Approved' : batch.randomSelectedDraftIds.includes(draftId) ? 'QA selected' : 'Staged'}</Badge></li> })}</ul></div><div><h3 style={{ fontSize: 14 }}>Control notes</h3><p className="ops-muted" style={{ fontSize: 13, lineHeight: '20px' }}>Mandatory-review rules are applied first. The simulated agent does not select QA messages; the sample is drawn only from the remaining eligible, locked population.</p><Badge tone="info">Simulated operational data</Badge></div></div>
    </section>
    <Modal open={timeOpen} title="Change scheduled delivery time" onClose={() => setTimeOpen(false)} footer={<><Button onClick={() => setTimeOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { update({ scheduledReleaseAt: `Aug 2, 2026 · ${releaseTime}` }, `Delivery time updated to ${releaseTime}.`); setTimeOpen(false) }}>Save time</Button></>}><p>Choose the simulated delivery window for this locked batch.</p><label style={{ display: 'grid', gap: 6, marginTop: 14 }}>Delivery time<input className="ops-input" value={releaseTime} onChange={(event) => setReleaseTime(event.target.value)} /></label></Modal>
    <Modal open={releaseConfirm} title="Send approved responses?" destructive onClose={() => setReleaseConfirm(false)} footer={<><Button onClick={() => setReleaseConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => { actions.releaseBatch(batch.id); notify(`${ready} response${ready === 1 ? '' : 's'} delivered in the simulation.`); setReleaseConfirm(false) }}>Send {ready} response{ready === 1 ? '' : 's'}</Button></>}><p>This simulated delivery will mark exactly <strong>{ready}</strong> approved response{ready === 1 ? '' : 's'} as Delivered. This action is recorded in batch audit history.</p></Modal>
    {toast && <div className="toast-local" role="status">{toast}</div>}
  </div>
}
